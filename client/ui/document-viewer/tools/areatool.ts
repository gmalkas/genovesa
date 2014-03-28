/// <reference path="../../../geometry/point.ts"/>
/// <reference path="../../../geometry/rectangle.ts"/>
/// <reference path="../area.ts"/>
/// <reference path="itool.ts"/>

module Genovesa.UI.DocumentViewer.Tools {

  /**
   * A tool that handle area drawing.
   *
   */
    export class AreaTool implements ITool {
        private area: Area = null;
        private referencePoint: Geometry.Point = null;
        private keepArea: bool = null;

        /**
         * Creates an instance of AreaTool.
         *
         *
         * @constructor
         * @param {JQuery} containter The container of this area.
         * @param {bool} keepArea Specify weither the area keep display after the drop. 
         */
        constructor(container: JQuery, keepArea: bool = false) {
            this.area = new Area(new Geometry.Rectangle(0, 0, 0, 0));
            this.keepArea = keepArea;
            container.append(this.area.view);
        }

        /**
         * Initialize the rectangle position .
         *
         * @param {Object} position reference position of the annotation's rectangle
         */
        public initialize(position: Geometry.Point): void {
            this.area.position  = position;
            this.area.display   = true;
            this.referencePoint = position;
        }

        /**
         * Update and draw the selection rectangle according to the mouse position 
         * 
         * @param {Array} position Contains a relative position to the canvas where the mouse was moved
         * @public
         */
        public drag(position: Geometry.Point): void {
            var delta = position.minus(this.referencePoint);

            if (delta.x < 0) {
                this.area.x = this.referencePoint.x + delta.x;
                this.area.width = -delta.x;
            } else {
                this.area.x = this.referencePoint.x;
                this.area.width = delta.x;
            }

            if (delta.y < 0) {
                this.area.y = this.referencePoint.y + delta.y;
                this.area.height = -delta.y;
            } else {
                this.area.y = this.referencePoint.y;
                this.area.height = delta.y;
            }
        }

        /**
         * Validate the selection zone of an annotation and trigger the display of the form 
         * 
         * @param {Array} position Contains a relative position to the canvas where the mouse was released
         * @public
         */
        public drop(position: Geometry.Point): void {
            this.drag(position);
            this.area.display = this.keepArea;
        }

        /**
         * Gets the generated area.
         *
         * @method
         * @return {Area} The generated area.
         */
        public get area(): Area {
            return this.area;
        }
    }
}


