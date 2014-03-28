/// <reference path="../../../../definitions/references.d.ts"/>
/// <reference path="./tab.ts"/>
/// <reference path="../../../iview.ts"/>
/// <reference path="../../../../template-factory.ts"/>
/// <reference path="../../../../observable.ts"/>
/// <reference path="../../../../models/annotation-group.ts"/>
/// <reference path="./annotation-group-view.ts"/>

module Genovesa.UI.DocumentViewer.AnnotationViewer.Tabs {
    export class AnnotationGroupsList extends Observable implements IView {
        private _view: JQuery = TemplateFactory.create('document-viewer/annotation-groups');
        private annotationGroups: Models.AnnotationGroup[] = [];

        constructor() {
            super();
        }

        public get view(): JQuery {
            return this._view;
        }

        public load(annotationGroups: Models.AnnotationGroup[]): void {
            this.annotationGroups = annotationGroups;
            this._view.find('h1').text(annotationGroups.length + ((annotationGroups.length == 1) ? ' annotation' : ' annotations'));
            this._view.find('.groups').empty();

            annotationGroups.forEach(annotationGroup => {
                var group = TemplateFactory.create('document-viewer/annotation-group', new AnnotationGroupView(annotationGroup));
                group.mouseenter(() => {
                    this.trigger('show-annotation-group', annotationGroup);
                });

                group.mouseleave(() => {
                    this.trigger('clear-annotation-group');
                });

                group.find('[data-action="destroy"]').click(e => {
                    e.preventDefault();
                    this.trigger('destroy-annotation-group', annotationGroup);
                });

                group.find('[data-action="edit"]').click(e => {
                    e.preventDefault();
                });

                group.find('[data-action="toggle"]').click(e => {
                    e.preventDefault();

                    var show = !group.hasClass('toggle');

                    this.trigger('toggle-annotation-group', annotationGroup);

                    if (show) {
                      group.addClass('toggle');
                    }
                });

                this._view.find('.groups').append(group);
            });
        }
    }
}

