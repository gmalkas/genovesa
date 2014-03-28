/// <reference path="../../definitions/references.d.ts"/>
/// <reference path="ipanel.ts"/>
/// <reference path="toolbars/item-list.ts"/>
/// <reference path="../../models/document-type.ts"/>
/// <reference path="../../template-factory.ts"/>

module Genovesa.UI.Panels {
    export class DocumentTypeTile implements IView {
        private _view: JQuery = null;

        private documentType: Models.DocumentType = null;

        constructor(documentType: Models.DocumentType) {
            this.documentType = documentType;
            this._view = TemplateFactory.create('panels/tiles/document-type-tile', documentType);
        }

        //#region IView members.

        public get view(): JQuery {
            return this._view;
        }

        //#endregion
    }

    export class DocumentTypeListPanel implements IPanel {
        private _view: JQuery = null;

        private _toolbar = new Toolbars.ItemListToolbar();

        private items: DocumentTypeTile[] = [];

        constructor(documentTypes: Models.DocumentType[]) {
            // Create a tile for each document type.
            documentTypes.map(documentType => {
                this.items.push(new DocumentTypeTile(documentType));
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
