/// <reference path="../../../geometry/point.ts"/>
/// <reference path="../../../geometry/rectangle.ts"/>
/// <reference path="../layers/annotation.ts"/>
/// <reference path="itool.ts"/>

module Genovesa.UI.DocumentViewer.Tools {

  /**
   * @class Represents a tool to select an annotation field and create the annotation through a form
   * @public
   * @constructor
   *
   * @param {Layer[]} layers Reference to the array that contains annotLayer and ImageLayer
   */
    export class AnnotationTool implements ITool {
        private annotationLayer: Layers.AnnotationLayer  = null;

        constructor(layer: Layers.AnnotationLayer) {
            this.annotationLayer = layer;
        }

        /**
         * Initialize the rectangle position .
         *
         * @param {Object} position reference position of the annotation's rectangle
         */
        public initialize(position: Geometry.Point): void {
            this.annotationLayer.initRectangle(position);
            this.annotationLayer.clear();
        }

        /**
         * Update and draw the selection rectangle according to the mouse position 
         * 
         * @param {Array} position Contains a relative position to the canvas where the mouse was moved
         * @public
         */
        public drag(position: Geometry.Point): void {
            this.annotationLayer.updateRectangle(position);
            this.annotationLayer.draw();
        }

        /**
         * Validate the selection zone of an annotation and trigger the display of the form 
         * 
         * @param {Array} position Contains a relative position to the canvas where the mouse was released
         * @public
         */
        public drop(position: Geometry.Point): void {
            if (this.annotationLayer.rectOutOfBound()) {
                for (var attr in this.annotationLayer.rectangle) {
                    delete this.annotationLayer.rectangle[attr];
                }

                this.annotationLayer.clear();
            } else {
                this.annotationLayer.draw();
            }
        }


       /**
        * Draw an annotation on the canvas and show the key and value in the form.
        * @return{Annotation} A rectangle describing the canvas position and size.
        * @public
        */
        public showAnnotation(annotation: Geometry.Rectangle): void {
            this.annotationLayer.rectangle = annotation;

            if (annotation != {}) {
                this.annotationLayer.draw();
            }
        }

        /**
         * Reset the state of the tool.
         *
         *@function
         *@public
         */
        public reset(): void {
            this.annotationLayer.clearSelection();
        }
    }
}


