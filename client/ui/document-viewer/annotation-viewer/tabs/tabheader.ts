/// <reference path="../../../../definitions/references.d.ts"/>
/// <reference path="../../../iview.ts"/>
/// <reference path="../../../../observable.ts"/>
/// <reference path="../../../../template-factory.ts"/>
/// <reference path="./tab.ts"/>

module Genovesa.UI.DocumentViewer.AnnotationViewer.Tabs {
    export class TabHeader extends Observable implements IView {
        /** @var {JQuery} Underlying JQuery view */
        private _view = null;

        constructor(tab: Tab, title: string, icon: string) {
            super();
            this._view = TemplateFactory.create('document-viewer/tab-header', { title: title, icon: icon });

            this.view.click((e: JQueryEventObject): void => {
                this.trigger('select', tab);
            });
        }

        public get view(): JQuery {
            return this._view;
        }

        public set title(title: string) {
            this.view.find('span').text(title);
        }
    }
}
