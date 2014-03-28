/// <reference path="../../definitions/references.d.ts"/>
/// <reference path="ipanel.ts"/>
/// <reference path="toolbars/item-list.ts"/>
/// <reference path="../../models/document.ts"/>
/// <reference path="../../template-factory.ts"/>
/// <reference path="../../session.ts"/>

module Genovesa.UI.Panels {
    export class DocumentTile implements IView {
        private _view: JQuery = null;

        private baseUrl: string;

        private document: Models.Document = null;

        //#region IView members.

        public get view(): JQuery {
            return this._view;
        }

        //#endregion

        constructor(baseUrl: string, document: Models.Document) {
            this.baseUrl = baseUrl;
            this.document = document;

            this._view = TemplateFactory.create('panels/tiles/document-tile', this);

            this._view.find('.favorite-icon').click(e => {
                if (Session.isLogged() && !$(e.target).hasClass('favorited')) {
                    Session.currentUser.addBookmark(document.reference, baseUrl + '/' + document.id);
                } else {
                    Session.currentUser.deleteBookmark(document.reference, baseUrl + '/' + document.id);
                }

                $(e.target).toggleClass('favorited');

                return false;
            });
        }
    }

    export class DocumentListPanel implements IPanel {
        private _view: JQuery = null;

        private _toolbar = new Toolbars.ItemListToolbar();

        private items: DocumentTile[] = [];
        private documents: Models.Document[] = [];
        private baseUrl: string = null;

        constructor(baseUrl: string, documents: Models.Document[]) {
            this.documents = documents;
            this.baseUrl = baseUrl;

            this.registerHandlers();
            this.buildView();
        }

        public hasOpenedDocument(documentId): boolean {
            return false;
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

        //#endregion

        private registerHandlers(): void {
            Session.registerHandler('login', () => {
                this.buildView();
            });

            Session.registerHandler('logout', () => {
                this.buildView();
            });
        }

        private buildView(): void {
            this.items = [];

            // Create a tile for each document.
            this.documents.map(document => {
                this.items.push(new DocumentTile(this.baseUrl, document));
            });

            this._view = TemplateFactory.create('panels/list', this);

            // Append the tile views to our root view.
            this.items.map(item => {
                this._view.append(item.view);
            });
        }
    }
}
