/// <reference path="../definitions/references.d.ts"/>
/// <reference path="iview.ts"/>
/// <reference path="../template-factory.ts"/>
/// <reference path="../observable.ts"/>

module Genovesa.UI {
    /**
     * Provides buttons to navigate to previously visited panels.
     *
     * @class
     */
    export class Breadcrumbs extends Observable implements IView {
        /** @var { [index: string]: Crumb; } Object that maps a string to a pre-built crumb. */
        private crumbs: { [index: string]: Crumb; } = {};

        /** @var {JQuery} Underlying JQuery view */
        private _view = TemplateFactory.create('breadcrumbs');

        constructor() {
            super();
        }

        public get view(): JQuery {
            return this._view;
        }

        public cached(name: string): boolean {
            return this.crumbs[name] !== undefined;
        }

        public cache(name: string, crumb: Crumb): void {
            this.crumbs[name] = crumb;
        }

        public append(crumb: Crumb): void {
            this._view.append(crumb.view);
        }

        public appendCached(name: string): void {
            this._view.append(this.crumbs[name].view);
        }

        public clear(): void {
            this._view.empty();
        }
    }


    /**
     * A single crumb.
     *
     * @class
     */
    export class Crumb implements IView {
        /** @var {string} Crumb's title */
        private title: string = null;

        /** @var {string} Crumb's icon's name */
        private icon: string = null;

        /** @var {string} Data associated with the crumb, used when the crumb is clicked */
        private url: string = null;

        /** @var {JQuery} Underlying JQuery view */
        private _view: JQuery = null;

        constructor(title: string, icon: string, url: string) {
            this.title = title;
            this.icon = icon;
            this.url = url;

            this._view = TemplateFactory.create('breadcrumbs-button', this);
        }

        public get view(): JQuery {
            return this._view;
        }
    }
}
