/// <reference path="../definitions/references.d.ts"/>
/// <reference path="iview.ts"/>
/// <reference path="../template-factory.ts"/>
/// <reference path="../session.ts"/>


module Genovesa.UI {
    /**
     * A side menu that displays items to search persons
     * and access user's persons.
     *
     * @class
     */
    export class PersonsMenu implements IView {
        /** @var {JQuery} Underlying JQuery view. */
        private _view = TemplateFactory.create('persons-menu');

        /**
         * Creates an instance of PersonsMenu.
         *
         * @constructor
         */
        constructor() {
            // Register to global events.
            Session.registerHandler('login', this.reset.bind(this));
            Session.registerHandler('logout', this.reset.bind(this));
        }

        /**
         * Resets the menu, to display or hide the item for the
         * current user's persons.
         *
         * @method
         */
        private reset(): void {
            var newMenu = TemplateFactory.create('persons-menu');
            this._view.replaceWith(newMenu);
            this._view = newMenu;
        }

        public get view(): JQuery {
            return this._view;
        }
    }
}

