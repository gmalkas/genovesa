/// <reference path="../../definitions/references.d.ts"/>
/// <reference path="ipanel.ts"/>
/// <reference path="toolbars/item-list.ts"/>
/// <reference path="../../models/township.ts"/>
/// <reference path="../../template-factory.ts"/>

module Genovesa.UI.Panels {
    export class TownshipTile implements IView {
        private _view: JQuery = null;

        private township: Models.Township = null;

        constructor(township: Models.Township) {
            this.township = township;
            this._view = TemplateFactory.create('panels/tiles/township-tile', township);
        }

        //#region IView members.

        public get view(): JQuery {
            return this._view;
        }

        //#endregion
    }

    export class TownshipListPanel implements IPanel {
        private _view: JQuery = null;

        private _toolbar = new Toolbars.ItemListToolbar();

        private items: TownshipTile[] = [];

        constructor(townships: Models.Township[]) {
            // Create a tile for each document type.
            townships.map(township => {
                this.items.push(new TownshipTile(township));
            });

            this._view = TemplateFactory.create('panels/list', this);

            // Append the tile views to our root view.
            this.items.map(item => {
                this._view.append(item.view);
            });
        }

        //#region IPanel members.

        public get view() {
            return this._view;
        }

        public get toolbar(): JQuery {
            return this._toolbar.view;
        }

        public attached(): void {
        }

        public hasOpenedDocument(documentId): boolean {
          return false;
        }
        //#endregion
    }
}
