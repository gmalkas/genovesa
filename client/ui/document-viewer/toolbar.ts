/// <reference path="../../definitions/references.d.ts"/>
/// <reference path="../iview.ts"/>
/// <reference path="../../template-factory.ts"/>
/// <reference path="../../observable.ts"/>

module Genovesa.UI.DocumentViewer {
    /**
     *  Defines the document viewer panel's toolbar.
     *
     * @class
     */
    export class Toolbar extends Observable implements IView {

        /** @var {JQuery} Underlying JQuery view */
        private _view = TemplateFactory.create('document-viewer/toolbar');

        constructor() {
            super();

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
            this._view.find('[data-action=go-first]').click(() => {
                this.trigger('go-first');
                return false;
            });

            this._view.find('[data-action=go-last]').click(() => {
                this.trigger('go-last');
                return false;
            });

            this._view.find('[data-action=go-next]').click(() => {
              this.trigger('go-next');
              return false;
            });

            this._view.find('[data-action=go-previous]').click(() => {
              this.trigger('go-previous');
              return false;
            });

            this._view.find('[data-action=adjust]').click(() => {
              this.trigger('adjust');
              return false;
            });
  
            this._view.find('[data-action=choose-zoom]').click(() => {
              this.trigger('choose-zoom');
              return false;
            });

            this._view.find('[data-action=choose-move]').click(() => {
              this.trigger('choose-move');
              return false;
            });
  
            this._view.find('[data-action=rotate-left]').click(() => {
              this.trigger('rotate-left');
              return false;
            });

            this._view.find('[data-action=rotate-right]').click(() => {
              this.trigger('rotate-right');
              return false;
            });
        }
    }
}
