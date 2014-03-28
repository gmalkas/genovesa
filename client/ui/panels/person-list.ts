/// <reference path="../../definitions/references.d.ts"/>
/// <reference path="ipanel.ts"/>
/// <reference path="toolbars/item-list.ts"/>
/// <reference path="../../models/person.ts"/>
/// <reference path="../../template-factory.ts"/>
/// <reference path="../../session.ts"/>

module Genovesa.UI.Panels {
    export class PersonTile implements IView {
        private _view: JQuery = null;

        private baseUrl: string;

        private person: Models.Person = null;

        //#region IView members.

        public get view(): JQuery {
            return this._view;
        }

        //#endregion

        constructor(baseUrl: string, person: Models.Person) {
            this.baseUrl = baseUrl;
            this.person = person;

            this._view = TemplateFactory.create('panels/tiles/person-tile', this);
        }
    }

    export class PersonListPanel implements IPanel {
        private _view: JQuery = null;

        private _toolbar = new Toolbars.ItemListToolbar();

        private items: PersonTile[] = [];
        private persons: Models.Person[] = [];
        private baseUrl: string = null;

        constructor(baseUrl: string, persons: Models.Person[]) {
            this.persons = persons;
            this.baseUrl = baseUrl;

            this.buildView();
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

        private buildView(): void {
            this.items = [];

            // Create a tile for each person.
            this.persons.map(person => {
                this.items.push(new PersonTile(this.baseUrl, person));
            });

            this._view = TemplateFactory.create('panels/list', this);

            // Append the tile views to our root view.
            this.items.map(item => {
                this._view.append(item.view);
            });
        }
    }
}

