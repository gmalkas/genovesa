/// <reference path="../layers/image.ts"/>
/// <reference path="../../../geometry/point.ts"/>
/// <reference path="itool.ts"/>

module Genovesa.UI.DocumentViewer.Tools {
    export class MoveTool implements ITool {
        private imageLayer: Layers.ImageLayer = null;
        private position: Geometry.Point = null;

        constructor(layer: Layers.ImageLayer) {
            this.imageLayer = layer;
        }

        /**
         * Initializes a drag & drop action at the given position.
         * @param {Object} position given position.
         */
        public initialize(position: Geometry.Point): void {
            this.position = position;
        }

        /**
         * Updates a drag & drop action at the given position.
         * @param {Object} position given position.
         */
        public drag(position: Geometry.Point): void {
            var dx = position.x - this.position.x;
            var dy = position.y - this.position.y;
            this.position = position;

            this.imageLayer.move(dx, dy);
        }

        /**
         * Terminates a drag & drop action at the given position.
         * @param {Object} position given position.
         */
        public drop(position: Geometry.Point): void {
        }
    }
}



