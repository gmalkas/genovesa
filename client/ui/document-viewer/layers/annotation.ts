/// <reference path="../../../definitions/references.d.ts"/>
/// <reference path="../visualizer.ts"/>
/// <reference path="ilayer.ts"/>
/// <reference path="../../../geometry/point.ts"/>
/// <reference path="../../../geometry/rectangle.ts"/>
/// <reference path="image.ts"/>

module Genovesa.UI.DocumentViewer.Layers {
    export class AnnotationLayer implements ILayer {

        private imageLayer: Layers.ImageLayer = null;
        private canvas: HTMLCanvasElement         = null;
        private context: CanvasRenderingContext2D = null;
        private validAnnotation             = false;
        private _rectangle = new Geometry.Rectangle(0, 0, 0, 0);

        /**
         * @class Represents a tool to select an annotation field and create the annotation through a form
         * @public
         * @constructor
         *
         */
        constructor(layer: Layers.ImageLayer) {
            this.imageLayer = layer;
            this.canvas = <HTMLCanvasElement>$('<canvas></canvas>')[0];
            this.canvas.style.setProperty('z-index', '2');
            this.context = this.canvas.getContext('2d');
            this.validAnnotation = true;
        }

        public get view(): JQuery {
            return $(this.canvas);
        }

        /**
         * Resizes the canvas and re-adjusts the image size.
         *
         * @param {Number} width new width of the canvas in pixels.
         * @param {Number} height new height of the canvas in pixels.
         */
        public resize(width, height): void {
            this.canvas.width = width;
            this.canvas.height = height;
        }
        
        /**
         * Transform a rectangle coordinates, width and height from relative to absolute.
         *
         * @param {Number} width New width of the canvas in pixels.
         * @param {Number} height New height of the canvas in pixels.
         * @return {Object} The given rectangle with absolute features.
         */
        public toAbsoluteRect(rectangle: Geometry.Rectangle): Geometry.Rectangle {
            var x = rectangle.x * this.canvas.width;
            var y = rectangle.y * this.canvas.height;
            var width = rectangle.width * this.canvas.width;
            var height = rectangle.height * this.canvas.height;

            return new Geometry.Rectangle(x, y, width, height);
        }

        /**
         * Transform an relative position to its absolute position.
         *
         * @param {Object} position Given position.
         * @return {Object} The given position with absolute features.
         */
        public toAbsolutePos(position: Geometry.Point): Geometry.Point {
            var x = position.x * this.canvas.width + $(this.canvas).offset().left;
            var y = position.y * this.canvas.height;
            return new Geometry.Point(x, y);
        }

        /**
         * Draw the parameter rectangle of the calling object on the canvas.
         */
        public drawRect(color, rectangle: Geometry.Rectangle): void {
            this.draw();

            var x = rectangle.x * this.canvas.width;
            var y = rectangle.y * this.canvas.height;
            var width = rectangle.width * this.canvas.width;
            var height = rectangle.height * this.canvas.height;

            this.context.lineWidth = this.getLineWidth();
            this.context.strokeStyle = color;

            this.context.strokeRect(x, y, width, height);

            this.context.fillStyle = 'rgba(255, 255, 0, 0.2)';
            this.context.fillRect(x, y, width, height);
        }

        public drawAnnotation(rectangle: Geometry.Rectangle): void {
            var rect = this.rectImgToCanvas(rectangle);
            rect = this.toAbsoluteRect(rectangle);

            this.context.lineWidth = this.getLineWidth();
            this.context.strokeStyle = Visualizer.annotationRectColor;

            this.context.strokeRect(rect.x, rect.y, rect.width, rect.height);

            // FIXME
            this.context.fillStyle = 'rgba(0, 0, 0, .5)';
            this.context.fillRect(rect.x, rect.y, rect.width, rect.height);
        }


        public draw(): void {
            this.clear();

            if (this.rectangle.width == 0 || this.rectangle.height == 0) {
                return;
            }

            var rect = this.rectImgToCanvas(this.rectangle);
            rect = this.toAbsoluteRect(rect);

            this.context.lineWidth = this.getLineWidth();
            this.context.strokeStyle = Visualizer.annotationRectColor;

            this.context.strokeRect(rect.x, rect.y, rect.width, rect.height);

            // FIXME
            this.context.fillStyle = 'rgba(0, 0, 0, .1)';
            this.context.fillRect(rect.x, rect.y, rect.width, rect.height);
        }

        public getLineWidth(): number {
            return 1 / Visualizer.zoomFactor;
        }

        /**
         * Clear all the canvas.
         */
        public clear(): void {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        public clearSelection(): void {
            this.rectangle = new Geometry.Rectangle(0, 0, 0, 0);
            this.clear();
        }

        /**
         * Initialize the rectangle features from the given position
         * @param {Object} position Given position
         */
        public initRectangle(position: Geometry.Point): void {
            var posit = this.imageLayer.toRelative(position);
            this.rectangle = new Geometry.Rectangle(posit.x, posit.y, 0, 0);
        }

        /**
         * Update the rectangle width and height from the given position
         * @param {Object} position Given position
         */
        public updateRectangle(position): void {
            var posit = this.imageLayer.toRelative(position);
            this.rectangle.width = posit.x - this.rectangle.x;
            this.rectangle.height = posit.y - this.rectangle.y;
        }

        public get rectangle() : Geometry.Rectangle {
            return this._rectangle;
        }

        public set rectangle(value: Geometry.Rectangle) {
            this._rectangle = value;
        }

        /**
         * Transforms the rectangle features relative to the canvas to be relative to the image.
         * @param {rectangle} position Given rectangle.
         * @return {rectangle} Return a rectangle with the updated features
         */
        public rectCanvasToImg(rectangle: Geometry.Rectangle): Geometry.Rectangle {
            var newRect = new Geometry.Rectangle(0, 0, 0, 0);
            var posit = new Geometry.Point(0, 0);
            posit.x = rectangle.x;
            posit.y = rectangle.y;
            posit = this.imageLayer.toRelative(posit);

            newRect.x = posit.x;
            newRect.y = posit.y;

            posit.x = rectangle.x + rectangle.width;
            posit.y = rectangle.y + rectangle.height;
            posit = this.imageLayer.toRelative(posit);
            newRect.width = posit.x - newRect.x;
            newRect.height = posit.y - newRect.y;
            return newRect;
        }

        /**
         * Transforms the rectangle features relative to the image to be relative to the canvas.
         * @param {rectangle} position Given rectangle.
         * @return {rectangle} Return a rectangle with the updated features.
         */
        public rectImgToCanvas(rectangle): Geometry.Rectangle {
            var newRect = new Geometry.Rectangle(0, 0, 0, 0);
            var posit = new Geometry.Point(0, 0);
            posit.x = rectangle.x;
            posit.y = rectangle.y;
            posit = this.imageLayer.toAbsolute(posit);

            newRect.x = posit.x;
            newRect.y = posit.y;

            posit.x = rectangle.x + rectangle.width;
            posit.y = rectangle.y + rectangle.height;
            posit = this.imageLayer.toAbsolute(posit);
            newRect.width = posit.x - newRect.x;
            newRect.height = posit.y - newRect.y;
            return newRect;
        }

        /**
         * If the rectangle if fully outside of the image then return false; if not, modify the 
         * rectangle features so as to be inside the image
         * @return {Boolean} Return true if the rectangle is fully outside of the image
         */
        public rectOutOfBound(): boolean {
            var pointA = { 'x': this.rectangle.x + this.rectangle.width, 'y': this.rectangle.y + this.rectangle.height };
            var pointB = { 'x': this.rectangle.x, 'y': this.rectangle.y }

            // Moves a point inside the image if it is not the case.
            var movePointInsideImage = (point: any) => {
                point.x = Math.max(point.x, 0);
                point.y = Math.max(point.y, 0);
                point.x = Math.min(point.x, 1);
                point.y = Math.min(point.y, 1);
            };

            movePointInsideImage(pointA);
            movePointInsideImage(pointB);

            if (pointA.x == pointB.x || pointA.y == pointB.y) {
                return true;
            }

            this.rectangle.x = pointB.x;
            this.rectangle.y = pointB.y;
            this.rectangle.width = pointA.x - pointB.x;
            this.rectangle.height = pointA.y - pointB.y;

            return false;
        }  
    }
}
