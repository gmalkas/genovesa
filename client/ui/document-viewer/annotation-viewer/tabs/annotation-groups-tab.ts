/// <reference path="../../../../definitions/references.d.ts"/>
/// <reference path="./tab.ts"/>
/// <reference path="./annotation-groups-list.ts"/>
/// <reference path="../../../iview.ts"/>
/// <reference path="../../../../template-factory.ts"/>
/// <reference path="../../../../models/document.ts"/>

module Genovesa.UI.DocumentViewer.AnnotationViewer.Tabs {
    export class AnnotationGroupsTab extends Tab implements IView {
        private document: Models.Document = null;
        private annotationGroupsList = new AnnotationGroupsList();

        private pageLoaded = $.Deferred();

        constructor(document: Models.Document) {
            super();

            this._view = TemplateFactory.create('document-viewer/annotation-groups-tab');

            this.document = document;
            this.header('0 annotations', 'sticky-notes-stack');
            
            this._view.append(this.annotationGroupsList.view);

            this.annotationGroupsList.bind('show-annotation-group', group => {
                this.trigger('show-annotation-group', group);
            });

            this.annotationGroupsList.bind('clear-annotation-group', () => {
                this.trigger('clear-annotation-group');
            });

            this.annotationGroupsList.bind('toggle-annotation-group', () => {
                this._view.find('li.toggle').removeClass('toggle');
            });

            this.annotationGroupsList.bind('destroy-annotation-group', (group) => {
                this.trigger('destroy-annotation-group', group);
            });

            setTimeout(() => {
              $('[data-action=start-annotation-group-creation]').click(e => {
                  e.preventDefault();
                  this.trigger('start-annotation-group-creation');
                  return false;
              });
            }, 1000);
        }

        public get view(): JQuery {
            return this._view;
        }

        public openPage(page): void {
            Repository.of('AnnotationGroup').where({ document: this.document.id, pageNumber: page.number }).then(annotationGroups => {
                this.header().title = annotationGroups.length + ((annotationGroups.length == 1) ? ' annotation' : ' annotations');
                this.annotationGroupsList.load(annotationGroups);
                this.pageLoaded.resolve();
            });
        }

        public openAnnotationGroup(annotationGroup) {
            this.pageLoaded.promise().then(() => {
                this._view.find('li.toggle').removeClass('toggle');
                this._view.find('li[data-annotation-group="' + annotationGroup.id + '"]').addClass('toggle');
            });
        }
    }
}


