/// <reference path="../../../definitions/references.d.ts"/>
/// <reference path="../../iview.ts"/>
/// <reference path="../../../template-factory.ts"/>
/// <reference path="../../../observable.ts"/>

module Genovesa.UI.Panels.Toolbars {
    export class ItemListToolbar extends Observable implements IView {
        /** @var {JQuery} Underlying JQuery view */
        private _view = TemplateFactory.create('panels/toolbars/item-list');

        private tilesButton: JQuery = null;

        private listButton: JQuery = null;

        constructor() {
            super();

            this.tilesButton = this._view.find('[data-action="display-tiles"]');
            this.listButton = this._view.find('[data-action="display-list"]');

            this.registerEventHandlers();
        }

        public get view(): JQuery {
            return this._view;
        }

        /**
         * Register all user events to the form handlers.
         *
         * @method
         */
        private registerEventHandlers(): void {
            this.tilesButton.click(e => {
                e.preventDefault();

                if (this.tilesButton.hasClass('selected')) {
                    return;
                }

                this.tilesButton.addClass('selected');
                this.listButton.removeClass('selected');

                this.trigger('display-change', 'tiles');
            });

            this.listButton.click(e => {
                e.preventDefault();

                if (this.listButton.hasClass('selected')) {
                    return;
                }

                this.listButton.addClass('selected');
                this.tilesButton.removeClass('selected');

                this.trigger('display-change', 'list');
            });
        }
    }
}
