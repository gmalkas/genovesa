/// <reference path="../../../definitions/references.d.ts"/>
/// <reference path="annotation.ts"/>
/// <reference path="../visualizer.ts"/>
/// <reference path="ilayer.ts"/>
/// <reference path="../../../geometry/point.ts"/>

module Genovesa.UI.DocumentViewer.Layers {
    /**
     * Class displaying an image.
     *
     * @param {Canvas} canvas on which the image will be displayed.
     * @param {Object} layers the list of layers (this layer may have to interact with other layers).
     * @constructor
     */
    export class ImageLayer implements ILayer {

        private visualizer: Visualizer         = null;
        private canvas: HTMLCanvasElement         = null;

        // The upper layer.
        private context: CanvasRenderingContext2D = null;
        private angle: number                     = null;
        private _zoomFactor: number                = null;
        private _image: HTMLImageElement           = null;
        private width: number                     = 0;
        private height: number                    = 0;
        private x: number                         = 0;
        private y: number                         = 0;

        constructor(visualizer: Visualizer) {
            this.visualizer = visualizer;

            this.canvas = <HTMLCanvasElement>$('<canvas></canvas>')[0];
            this.canvas.width = this.visualizer.view.width();
            this.canvas.height = this.visualizer.view.height();
            this.canvas.style.setProperty('z-index', '1');
            this.context = this.canvas.getContext('2d');
            this.angle = 0;
            this._zoomFactor = 1;
        }

        public get view(): JQuery {
            return $(this.canvas);
        }

        public get image(): HTMLImageElement {
            return this._image;
        }

        /**
         * Resizes the canvas and re-adjusts the image size.
         * @param {Number} width new width of the canvas in pixels.
         * @param {Number} height new height of the canvas in pixels.
         */
        public resize(width: number, height: number): void {
            this.canvas.width = width;
            this.canvas.height = height;

            // The modification of the canvas size cancels the rotation.
            this.angle = 0;

            if (this.image !== undefined) {
                this.adjust();
            }
        }

        /**
         * Changes the displayed image (and re-adjusts the size and position to fit to the container).
         * @param {String} large path to the image.
         * @param {String} small path to the thumbnail.
         */
        public set image(image: HTMLImageElement) {
            this._image = image;
            this.adjust();
        }

        public get zoomFactor() {
          return this._zoomFactor;
        }

        /**
         * Changes the contrast of the image.
         * @param {String} value new value of the contrast (1 is the original value).
         */
        public contrast(value: number): void {
            if (value <= 0) {
                value = 1;
            }

            var constratValue = 'contrast(' + value + ')';
            this.canvas.style.setProperty('-webkit-filter', constratValue);
            this.canvas.style.setProperty('-moz-filter', constratValue);
            this.canvas.style.setProperty('-filter', constratValue);
        }

        /**
         * Transforms a given point according to the current rotation angle.
         * @param {Number} x x position.
         * @param {Number} y y position.
         * @param {Boolean} [anticlockwise]
         * @return {Object} the rotated point.
         * @private
         */
        public transform(p: Geometry.Point, anticlockwise: boolean): any {
            var d = anticlockwise ? -1 : 1;

            return new Geometry.Point(Math.cos(this.angle) * p.x + d * Math.sin(this.angle) * p.y,
                             Math.cos(this.angle) * p.y - d * Math.sin(this.angle) * p.x);
        }

        /**
         * Adjusts the size and position of the image to fit exactly in the canvas.
         */
        public adjust(): void {
            if (this._image === null) {
                return;
            }

            var size = this.transform(new Geometry.Point(this._image.width, this._image.height), null);

            var d = Math.min(this.canvas.height / Math.abs(size.y), this.canvas.width / Math.abs(size.x));
            this.width = this.image.width * d;
            this.height = this.image.height * d;
            this.x = (this.canvas.width - this.width) / 2;
            this.y = (this.canvas.height - this.height) / 2;
            this._zoomFactor = 1;

            // We draw the entire visualizer
            this.visualizer.draw();
        }

        /**
         * Moves the image from the given vector.
         * @param {Number} dx
         * @param {Number} dy
         */
        public move(dx: number, dy: number): void {
            var vect = this.transform(new Geometry.Point(dx * this.canvas.width, dy * this.canvas.height), null);

            this.x += vect.x;
            this.y += vect.y;

            this.visualizer.draw();
        }

        /**
         * Rotates the image by a given angle.
         * @param {Number} angle the rotation angle (in degrees).
         */
        public rotate(angle: number): void {
            var radians = angle * Math.PI / 180;
            this.angle += radians;

            this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
            this.context.rotate(radians);
            this.context.translate(-this.canvas.width / 2, -this.canvas.height / 2);

            this.visualizer.draw();
        }

        /**
         * Zooms the image on the center of the canvas from a given zoom factor.
         * @param {Number} factor the zoom factor.
         */
        public zoom(factor): void {
            var dx = (this.canvas.width / 2 - this.x) / this.width;
            var dy = (this.canvas.height / 2 - this.y) / this.height;

            this.width *= factor;
            this.height *= factor;
            this._zoomFactor *= factor;

            this.x = this.canvas.width / 2 - this.width * dx;
            this.y = this.canvas.height / 2 - this.height * dy;

            this.visualizer.draw();
        }

        /**
         * Converts a position relative to the canvas into a position relative to the image.
         * @param {Object} position the position relative to the canvas to convert.
         * @return {Object} the position relative to the image.
         */
        public toRelative(position: Geometry.Point): Geometry.Point {
            var pos = this.transform(new Geometry.Point((position.x - 0.5) * this.canvas.width, (position.y - 0.5) * this.canvas.height), null);
            pos.x += this.canvas.width / 2;
            pos.y += this.canvas.height / 2;

            return new Geometry.Point((pos.x -this.x) / this.width,
                             (pos.y -this.y) / this.height);
        }

        /**
         * Converts a position relative to the image into a position relative to the canvas.
         * @param {Object} position the position relative to the image to convert.
         * @return {Object} the position relative to the canvas.
         */
        public toAbsolute(position: Geometry.Point): Geometry.Point {
            var x = this.x + position.x * this.width - this.canvas.width / 2;
            var y = this.y + position.y * this.height - this.canvas.height / 2;

            var pos = this.transform(new Geometry.Point(x, y), true);
            pos.x = (pos.x / this.canvas.width) + 0.5;
            pos.y = (pos.y / this.canvas.height) + 0.5;

            return pos;
        }

        /**
         * Draws the image on the canvas.
         */
        public draw(): void {
            this.context.save();
            this.context.setTransform(1, 0, 0, 1, 0, 0);
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.restore();
            this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
}
