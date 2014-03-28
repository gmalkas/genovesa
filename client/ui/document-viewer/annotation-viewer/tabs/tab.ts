/// <reference path="../../../../definitions/references.d.ts"/>
/// <reference path="./tabheader.ts"/>
/// <reference path="../../../iview.ts"/>
/// <reference path="../../../../observable.ts"/>

module Genovesa.UI.DocumentViewer.AnnotationViewer.Tabs {

    /**
     * Defines a tab (title and icon) and its content.
     */
    export class Tab extends Observable implements IView {
        private _index: number      = null;
        private _header: TabHeader = null;

        // FIXME
        public _view = null;

        constructor() {
            super();
            this.index = -1;
        }

        public get view(): JQuery {
            return this._view;
        }

        public get index(): number {
            return this._index;
        }

        public set index(value: number) {
            this._index = value;
        }

        public header(title: string = undefined, icon: string = undefined): TabHeader {
            if (title || icon) {
                this._header = new TabHeader(this, title, icon);
            }

            return this._header;
        }
    }
}
