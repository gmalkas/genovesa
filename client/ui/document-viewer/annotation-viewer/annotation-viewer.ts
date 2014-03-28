/// <reference path="../../../definitions/references.d.ts"/>
/// <reference path="../../iview.ts"/>
/// <reference path="../../../observable.ts"/>
/// <reference path="../../../template-factory.ts"/>
/// <reference path="../../../models/document.ts"/>
/// <reference path="../../../models/annotation-group.ts"/>
/// <reference path="./tabs/tab-viewer.ts"/>
/// <reference path="./tabs/annotation-groups-tab.ts"/>
/// <reference path="./tabs/create-annotation-tab.ts"/>

module Genovesa.UI.DocumentViewer.AnnotationViewer {

    /**
     * Provides tools to handle annotation management.
     *
     * @class
     */
    // TODO: change this TERRIBLE NAMESPACE
    // Suffix 2 to work around a bug in the compiler (module name == exported class name)
    export class AnnotationViewer2 extends Observable implements IView {
        private document: Models.Document = null;
        private page: Models.Page = null;
        private tabViewer: Tabs.TabViewer = null;
        private annotationGroupsTab: Tabs.AnnotationGroupsTab = null;

        /** @var {JQuery} Underlying JQuery view */
        private _view = TemplateFactory.create('document-viewer/annotation-viewer');

        constructor(doc: Models.Document) {
            super();

            this.document = doc;

            this.tabViewer = new Tabs.TabViewer();
            this.annotationGroupsTab = new Tabs.AnnotationGroupsTab(doc);

            this.tabViewer.add(this.annotationGroupsTab);

            this.view.append(this.tabViewer.view);
            this.registerEventHandlers();
        }

        public get view(): JQuery {
            return this._view;
        }

        private registerEventHandlers(): void {
            this.annotationGroupsTab.bind('start-annotation-group-creation', (): void => {
                this.trigger('start-annotation-group-creation');
            });

            this.annotationGroupsTab.bind('show-annotation-group', group => {
                this.trigger('show-annotation-group', group);
            });

            this.annotationGroupsTab.bind('clear-annotation-group', () => {
                this.trigger('clear-annotation-group');
            });

            this.annotationGroupsTab.bind('destroy-annotation-group', (group) => {
                Repository.of('AnnotationGroup').destroy(group).then(() => {
                    this.openPage(this.page);
                });
            });
        }

        public openAnnotationGroup(annotationGroup: Models.AnnotationGroup) {
            this.annotationGroupsTab.openAnnotationGroup(annotationGroup);
        }

        public closeNewAnnotationGroup(): void {
            if (this.tabViewer.has(1)) {
                this.tabViewer.close(1);
            }
        }

        public goToNewAnnotationGroup(): void {
            // If there is a second tab, we select it
            // since it's already available
            if (this.tabViewer.has(1)) {
                this.tabViewer.select(1);
            } else {
                var tab = new Tabs.CreateAnnotationTab(this.document, this.page);
                tab.bind('cancel-annotation-group-creation', (): void => {
                    this.tabViewer.closeSelectedTab();
                    this.trigger('cancel-annotation-group-creation');
                });

                tab.bind('submit-annotation-group', (tags: any): void => {
                    this.trigger('submit-annotation-group', tags);
                });
                this.tabViewer.add(tab, true);
            }
        }

        public openPage(page: Models.Page): void {
            this.page = page;
            this.annotationGroupsTab.openPage(page);

            if (this.tabViewer.has(1)) {
                this.tabViewer.close(1);
            }
        }
    }
}
