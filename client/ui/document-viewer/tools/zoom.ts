/// <reference path="../../../geometry/point.ts"/>
/// <reference path="../../../geometry/size.ts"/>
/// <reference path="../layers/image.ts"/>
/// <reference path="../layers/annotation.ts"/>
/// <reference path="../../../geometry/rectangle.ts"/>
/// <reference path="itool.ts"/>

module Genovesa.UI.DocumentViewer.Tools {

  /**
   * Provides zoom and unzoom.
   * When selected, a drag & drop action on the layer has the effect of zooming in the selected area.
   * It also allows zooming or unzooming at a given position by a constant factor.
   *
   * FIXME this class is coupled to both layers
   *
   * @param {Object} layers array of layers.
   * @constructor
   */
    export class ZoomTool implements ITool {
        /*
         * @var {array} The available layers
         */
        private imageLayer: Layers.ImageLayer = null;

        private annotationLayer: Layers.AnnotationLayer = null;

        private currentPosition: Geometry.Point = null;
        private currentSize: Geometry.Size = null;

        constructor(imageLayer: Layers.ImageLayer, annotationLayer: Layers.AnnotationLayer) {
            this.imageLayer = imageLayer;
            this.annotationLayer = annotationLayer;
        }

        /**
         * Initializes a drag & drop action at the given position.
         * @param {Object} position given position.
         */
        public initialize(position: Geometry.Point): void {
            this.currentPosition = position;
        }
      
        /**
         * Updates a drag & drop action at the given position.
         * Draws a rectangle on the selected region.
         * @param {Object} position given position.
         */
        public drag(position: Geometry.Point): void {
            this.currentSize = new Geometry.Size(position.x - this.currentPosition.x, position.y - this.currentPosition.y);

            this.annotationLayer.drawRect(Visualizer.zoomRectColor, new Geometry.Rectangle(this.currentPosition, this.currentSize));
        }

        /**
         * Terminates a drag & drop action at the given position.
         * Zooms in the selected rectangle (between the init position and the given position).
         * @param {Object} position given position.
         */
        public drop(position: Geometry.Point): void {
            this.currentSize = new Geometry.Size(position.x - this.currentPosition.x, position.y - this.currentPosition.y);

            var x      = Math.min(this.currentPosition.x, this.currentPosition.x + this.currentSize.width);
            var y      = Math.min(this.currentPosition.y, this.currentPosition.y + this.currentSize.height);
            var width  = Math.abs(this.currentSize.width);
            var height = Math.abs(this.currentSize.height);

            var factor = Math.min(1 / width, 1 / height);

            if (factor * this.imageLayer.zoomFactor > Visualizer.zoomMax) {
                factor = Visualizer.zoomMax / this.imageLayer.zoomFactor;
            }

            this.imageLayer.move(0.5 - (x + width / 2), 0.5 - (y + height / 2));
            this.imageLayer.zoom(factor);
        }

        /**
         * Zooms in the image at the given position.
         * @param {Layers.Point} position position relative to the layer.
         */
        public zoom(position: Geometry.Point): void {
            var factor = Math.min(Visualizer.zoomFactor, Visualizer.zoomMax / this.imageLayer.zoomFactor);
            var rel = this.imageLayer.toRelative(position);
            this.imageLayer.zoom(factor);
            var abs = this.imageLayer.toAbsolute(rel);
            this.imageLayer.move(position.x - abs.x, position.y - abs.y);
        }

        /**
         * Unzooms in the image at the given position.
         * @param {Layers.Point} position position relative to the layer.
         */
        public unZoom(position): void {
            var factor = Math.min(Visualizer.zoomFactor, this.imageLayer.zoomFactor / Visualizer.zoomMin);
            var rel = this.imageLayer.toRelative(position);
            this.imageLayer.zoom(1 / factor);
            var abs = this.imageLayer.toAbsolute(rel);
            this.imageLayer.move(position.x - abs.x, position.y - abs.y);
        }
    }
}


