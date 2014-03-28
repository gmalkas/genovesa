/// <reference path="../../../../definitions/references.d.ts"/>
/// <reference path="./tab.ts"/>
/// <reference path="../../../../models/document.ts"/>
/// <reference path="../../../../models/annotation-group.ts"/>
/// <reference path="../forms/annotation-group-form.ts"/>

module Genovesa.UI.DocumentViewer.AnnotationViewer.Tabs {
    export class CreateAnnotationTab extends Tab {
        private form: Forms.AnnotationGroupForm = null;
        private document: Models.Document = null;
        private page: Models.Page         = null;
        private annotationGroup: Models.AnnotationGroup         = null;

        constructor(doc: Genovesa.Models.Document, page: Genovesa.Models.Page, annotationGroup: Models.AnnotationGroup = null) {
            super();

            this.header('Nouvelle annotation', 'sticky-note--plus');
            this._view = $('<div></div>');

            this.form = new Forms.AnnotationGroupForm();
            this._view.append(this.form.view);

            this.document = doc;
            this.page     = page;
            this.annotationGroup     = annotationGroup;

            this.initializeForm();

            this.registerEventHandlers();
        }

        private registerEventHandlers(): void {
            this.form.bind('submit', (group: Models.AnnotationGroup): void => {
                this.trigger('submit-annotation-group', group);
            });

            this._view.find('[data-action=cancel-create-annotation-group]').click((e: JQueryEventObject): void => {
                e.preventDefault();
                this.trigger('cancel-annotation-group-creation');
            });
        }

        private initializeForm(): void {
            if (this.annotationGroup) {
            } else {
                this.form.addTagField('Lieu', this.document.township.name);
                this.form.addTagField('Date', this.document.fromYear.toString());

                if (this.document.documentTypes.length > 0) {
                    this.form.addTagField('Type', this.adaptDocumentTypeName(this.document.documentTypes[0].name));
                }
            }
        }

        private adaptDocumentTypeName(name: string): string {
            switch (name) {
                case 'Acte de naissance':
                    return 'Naissance';
                case 'Acte de décès':
                      return 'Décès';
                case 'Acte de mariage':
                      return 'Mariage';
                default:
                      return name;
            }
        }
    }
}
