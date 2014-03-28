/// <reference path="../../definitions/references.d.ts"/>
/// <reference path="../iview.ts"/>
/// <reference path="../../observable.ts"/>
/// <reference path="../../template-factory.ts"/>
/// <reference path="../../geometry/rectangle.ts"/>
/// <reference path="tools/itool.ts"/>
/// <reference path="tools/move.ts"/>
/// <reference path="tools/zoom.ts"/>
/// <reference path="tools/annotation.ts"/>
/// <reference path="layers/ilayer.ts"/>
/// <reference path="layers/image.ts"/>
/// <reference path="layers/annotation.ts"/>

module Genovesa.UI.DocumentViewer {

    /**
     * The visualizer is responsible for displaying the document's pages and allowing
     * for interaction with the pages themselves.
     *
     * It manages several layers (as in Photoshop layers): the first one
     * is the image, then annotations (rectangles).
     *
     * @class
     */
    export class Visualizer extends Observable implements IView {

        /**
         * @const {number} 
         */
        public static refreshTime = 20;
        /**
         * @const {number} Defines the maximum zoom factor
         */
        public static zoomMax = 20;

        /**
         * @const {number} Defines the minimum zoom factor
         */
        public static zoomMin = 0.8;

        /**
         * @const {number} 
         */
        public static zoomFactor = 1.2;

        /**
         * @const {string} Defines the zoom rectangle color
         */
        public static zoomRectColor = 'yellow';

        /**
         * @const {string} Defines the annotation rectangle color
         */
        public static annotationRectColor = '#eeeeff';

        /*
         * @var {array} The available tools
         */
        private tools: { move: Tools.MoveTool; zoom: Tools.ZoomTool; annotation: Tools.AnnotationTool; } = null;

        /*
         * @var {array} The available layers
         */
        private imageLayer: Layers.ImageLayer = null;

        private annotationLayer: Layers.AnnotationLayer = null;

        /**
          * @var {bool} True if the user is currently dragging something
          */
        private drag = false;

        private selectedTool: Tools.ITool = null;

        /** @var {JQuery} Underlying JQuery view */
        private _view = TemplateFactory.create('document-viewer/visualizer');

        constructor() {
            super();

            this.initializeLayers();
            this.initializeTools();
            this.registerEventHandlers();

            this._view.append(this.imageLayer.view);
            this._view.append(this.annotationLayer.view);

            this.resize(this.view.width(), this.view.height());
        }

        public get view(): JQuery {
            return this._view;
        }

        /**
          * Initializes the visualizer's tools.
          */
        private initializeTools(): void {
            this.tools = {
              'move': new Tools.MoveTool(this.imageLayer),
              'zoom': new Tools.ZoomTool(this.imageLayer, this.annotationLayer),
              'annotation': new Tools.AnnotationTool(this.annotationLayer)
            };

            this.selectedTool = this.tools.move;
        }

        private initializeLayers(): void {            
            this.imageLayer = new Layers.ImageLayer(this);
            this.annotationLayer = new Layers.AnnotationLayer(this.imageLayer);
        }

        private registerEventHandlers(): void {
            // Returns the relative position to the canvas of the given mouse event.
            var position = (event: JQueryEventObject) => {
                return new Geometry.Point(
                  (event.pageX - this.view.offset().left) / this.view.width(),
                  (event.pageY - this.view.offset().top) / this.view.height()
                );
            };


            this.view.mousedown((event: JQueryEventObject): void => {
                var pos = position(event);
                
                this.drag = true;
                this.selectedTool.initialize(pos);

                if (this.selectedTool === this.tools.move) {
                    this.view.css('cursor', 'move');
                }
            });

            $(window).mouseup((event: JQueryEventObject): void => {
                var pos = position(event);
                
                if (this.drag) {
                    this.drag = false;
                    this.selectedTool.drop(pos);

                    if (this.selectedTool !== this.tools.move) {
                        if (this.selectedTool == this.tools.annotation) {
                            this.trigger('annotation-group-area-selected', this.annotationLayer.rectangle);
                        }
                        this.selectTool('move');
                    } else {
                        this.view.css('cursor', 'pointer');
                    }
                }
            });

            var lastMoved;
            $(window).mousemove((event: JQueryEventObject):void  => {
                var pos = position(event);

                if (!lastMoved || (event.timeStamp - lastMoved > Visualizer.refreshTime)) {
                    lastMoved = event.timeStamp;
                    
                    if (this.drag) {
                        this.selectedTool.drag(pos);
                    }
                }
            });

            this.view.mousewheel((event: JQueryEventObject, delta: number, deltaX: number, deltaY: number): boolean => {
                var pos = position(event);
                
                if (deltaY > 0) {
                    this.tools.zoom.zoom(pos);
                } else {
                    this.tools.zoom.unZoom(pos);
                }

                return false;
            });

            // When the window is resized, we need to resize all the layers.
            $(window).resize((event: JQueryEventObject): void => {
                this.resize(this.view.width(), this.view.height());
            });
        }


        /**
         * Changes the displayed image.
         * @param {Image} image
         */
        public changeImage(image: any): void {
            this.tools.annotation.reset();
            this.imageLayer.image = image;
            this.resize(this.view.width(), this.view.height());
        }

        /**
         * Changes the currently used tool.
         * @param {Object} tool the name of the tool to use.
         */
        public selectTool(tool: string): void {
            if (tool === 'move') {
                this.view.css("cursor", "pointer");
            } else if (tool === 'zoom') {
                this.view.css("cursor", "default");
            } else if (tool === 'annotation') {
                this.view.css("cursor", "crosshair");
            }

            this.selectedTool = this.tools[tool];
        }

        public getRectangle(): Geometry.Rectangle {
            return this.annotationLayer.rectangle;
        }


        /**
         * Adjusts the image position and size to fit exactly to the contents().
         */
        public adjust(): void {
            this.imageLayer.adjust();
        }

        /**
         * Rotates the image by a given angle.
         * @param {Number} angle the rotation angle (in degrees).
         */
        public rotate(angle: number): void {
            this.imageLayer.rotate(angle);
            this.adjust();
        }

        /**
         * Changes the contrast value of the image to a new value.
         * Warning, this function uses the CSS3 'filter' property which is
         * currently supported only by Webkit browsers.
         * @param {Number} value new value of the contrast.
         */
        public contrast(value: number): void {
            this.imageLayer.contrast(value);
        }

        public clearSelection(): void {
            this.annotationLayer.clearSelection();
        }

        /**
         * Resizes all the layers.
         * @param {Number} width new width in pixels.
         * @param {Number} height new height in pixels.
         */
        public resize(width: number, height: number): void {
            this.imageLayer.resize(width, height);
            this.annotationLayer.resize(width, height);
        }

        /**
         * Draws every layer in the visualizer.
         */
        public draw(): void {
            this.imageLayer.draw();
            this.annotationLayer.draw();
        }

        public drawAnnotation(rectangle: Geometry.Rectangle) {
            this.annotationLayer.drawAnnotation(rectangle);
        }

        public clearAnnotation() {
            this.annotationLayer.clear();
        }
    }
}
