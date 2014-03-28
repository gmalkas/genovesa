/// <reference path="../../../../definitions/references.d.ts"/>
/// <reference path="../../../iview.ts"/>
/// <reference path="../../../../observable.ts"/>
/// <reference path="../../../../template-factory.ts"/>
/// <reference path="./tab.ts"/>

module Genovesa.UI.DocumentViewer.AnnotationViewer.Tabs {
    export class TabViewer extends Observable implements IView {
        private tabs: Tab[]              = null;
        private selectedTabIndex: number = null;

        /** @var {JQuery} Underlying JQuery view */
        private _view = TemplateFactory.create('document-viewer/tab-viewer');

        constructor() {
            super();

            this.tabs = [];
            this.selectedTabIndex = -1;
        }

        public get view(): JQuery {
            return this._view;
        }

        /**
         * Adds a new tab, then select it if the select
         * param is true.
         *
         * @param {Object} tab
         * @param {Boolean} select
         */
        public add(tab: Tab, select = false): void {
            tab.index = this.tabs.length;
            this.tabs.push(tab);

            this.view.find('.tabs').append(tab.header().view);
            tab.header().bind('select', () => {
                this.select(tab.index);
            });

            if (this.selectedTabIndex < 0 || select) {
                this.select(tab.index);
            }
        }

        public close(index: number): void {
            if (index >= this.tabs.length || index < 0) {
                throw 'Argument out of range';
            }

            this.tabs[index].header().view.remove();
            this.tabs[index].view.remove();

            // Delete the tab
            var rest = this.tabs.slice(index + 1, this.tabs.length);
            this.tabs.length--;
            this.tabs.concat(rest);

            if (this.selectedTabIndex == index) {
                this.selectedTabIndex = -1;
                if (index > 0) {
                    this.select(index - 1);
                } else {
                    this.select(0);
                }
            }
        }

        public closeSelectedTab(): void {
            this.close(this.selectedTabIndex);
        }

        public select(index): void {
            if (index >= this.tabs.length) {
                throw 'Argument out of range';
            }

            if (index == this.selectedTabIndex) {
                return;
            }

            if (this.selectedTabIndex >= 0) {
                this.selectedTab.header().view.removeClass('selected');
                // Remove previous tab
                this.selectedTab.view.detach();
            }

            this.tabs[index].header().view.addClass('selected');
            this.content = this.tabs[index].view;

            this.selectedTabIndex = index;
        }

        public get selectedTab(): Tab {
            if (this.selectedTabIndex < 0 || this.selectedTabIndex >= this.tabs.length) {
                throw 'Selected index out of range';
            }

            return this.tabs[this.selectedTabIndex];
        }

        public set content(content: JQuery) {
            this.view.find('.tab-content').first().append(content);
        }

        public has(index: number): boolean {
            return (0 <= index && index < this.tabs.length);
        }
    }
}
