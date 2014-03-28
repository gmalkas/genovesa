/// <reference path="../../definitions/references.d.ts"/>
/// <reference path="ipanel.ts"/>
/// <reference path="../../template-factory.ts"/>

module Genovesa.UI.Panels {
    /**
     * This is the home panel.
     *
     * @class
     */
    export class HomePanel implements IPanel {
        /** @var {JQuery} Underlying JQuery view. */
        private _view = TemplateFactory.create('panels/home');

        //#region Panel members.

        public get view(): JQuery {
            return this._view;
        }

        public get toolbar(): JQuery {
            return null;
        }

        public attached(): void {
        }

        public hasOpenedDocument(documentId): boolean {
            return false;
        }

        //#endregion
    }
}
