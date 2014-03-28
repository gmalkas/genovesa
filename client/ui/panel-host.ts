/// <reference path="../definitions/references.d.ts"/>
/// <reference path="iview.ts"/>
/// <reference path="../observable.ts"/>
/// <reference path="panels/ipanel.ts"/>
/// <reference path="../template-factory.ts"/>

module Genovesa.UI {
    export class PanelHost implements IView {
        private _view = TemplateFactory.create('panel-host');

        private _panel: Panels.IPanel = null;

        private toolbarView: JQuery = null;
        private panelView: JQuery = null;

        private animationDelay = 150;

        constructor() {
            this.toolbarView = this._view.find('#toolbar').first();
            this.panelView = this._view.find('#panel').first();
        }

        //#region IView members.

        public get view(): JQuery {
            return this._view;
        }

        //#endregion

        public set panel(panel: Panels.IPanel) {
            // Store the new panel.
            this._panel = panel;

            // Fade the old panel out.
            this.fadeOut().then(() => {
                // Remove old panel.
                this.toolbarView.contents().detach();
                this.panelView.contents().detach();

                // Replace it with the new one.
                if (this._panel.toolbar === null) {
                    this.toolbarView.hide();
                } else {
                    this.toolbarView.append(this._panel.toolbar);
                    this.toolbarView.show();
                }

                this.panelView.append(this._panel.view);
            }).then(() => {
                    // Fade the new panel in.
                    this.fadeIn().then(() => {
                        panel.attached();
                    });
                });
        }

        private fadeOut(): JQueryPromise<void> {
            // First call
            if (this._view === null) {
                return $.Deferred().resolve().promise();
            }

            return this._view.fadeOut(this.animationDelay).promise();
        }

        private fadeIn(): JQueryPromise<void> {
            // First call
            if (this._view === null) {
                return $.Deferred().resolve().promise();
            }

            return this._view.fadeIn(this.animationDelay).promise();
        }
    }
}