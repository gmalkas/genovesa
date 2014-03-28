/// <reference path="../../definitions/references.d.ts"/>
/// <reference path="../../geometry/rectangle.ts"/>
/// <reference path="../iview.ts"/>
/// <reference path="../../template-factory.ts"/>

module Genovesa.UI.DocumentViewer {

    /**
     * An area that can be draw over an element.
     *
     * @class
     */
    export class Area implements IView {
        private _view: JQuery = TemplateFactory.create('document-viewer/area');

        private _rectangle: Geometry.Rectangle = null;

        private _color: string = null;

        private _selected: bool = null;

        constructor(rectangle: Geometry.Rectangle, color: string = null) {
            this._rectangle = rectangle;
            this._color     = color;
            this._selected = false;
            this.view.css({ 'display': 'none' });

            this.updateMetrics();

            if (color) {
                this.updateColor();
            }
        }

        public get rectangle(): Geometry.Rectangle {
            return this._rectangle;
        }

        public set rectangle(rectangle: Geometry.Rectangle) {
            this._rectangle = rectangle;
            this.updateMetrics();
        }

        public get width(): number {
            return this._rectangle.width;
        }

        public set width(value: number) {
            this._rectangle.width = value;
            this.updateMetrics();
        }

        public get height(): number {
            return this._rectangle.height;
        }

        public set height(value: number) {
            this._rectangle.height = value;
            this.updateMetrics();
        }


        public get x(): number {
            return this._rectangle.x;
        }

        public set x(value: number) {
            this._rectangle.x = value;
            this.updateMetrics();
        }

        public get y(): number {
            return this._rectangle.y;
        }

        public set y(value: number) {
            this._rectangle.y = value;
            this.updateMetrics();
        }

        public get position(): Geometry.Point {
            return new Geometry.Point(this._rectangle.x, this._rectangle.y);
        }

        public set position(value: Geometry.Point) {
            this._rectangle.x = value.x;
            this._rectangle.y = value.y;

            this.updateMetrics();
        }

        public get size(): Geometry.Size {
            return new Geometry.Size(this._rectangle.width, this._rectangle.height);
        }

        public set size(value: Geometry.Size) {
            this._rectangle.width  = value.width;
            this._rectangle.height = value.height;

            this.updateMetrics();
        }

        public get color(): string {
            return this._color;
        }

        public set color(value: string) {
            this._color = value;
            this.updateColor();
        }

        public set display(value: bool) {
            var displayMode = (value) ? 'block' : 'none';

            this.view.css({ 'display': displayMode });
        }

        public get display(): bool {
            return this.view.css('display') === 'block';
        }

        public set selected(value: bool) {
            this._selected = value;
            this.updateColor();
        }

        public get selected(): bool {
            return this._selected;
        }

        private updateMetrics() {
            this.view.css({ 'top':    this._rectangle.x, 
                            'bottom': this._rectangle.y, 
                            'width':  this._rectangle.width, 
                            'height': this._rectangle.height });
        }

        private updateColor() {
            this.view.css({ 'border-color': this._color });

            var backgroundColor = (this._selected) ? 'rgba(255,255,255,0.1)' : 'transparent';

            this.view.css({ 'background-color': backgroundColor });
        }

        public get view(): JQuery {
            return this._view;
        }
    }
}
