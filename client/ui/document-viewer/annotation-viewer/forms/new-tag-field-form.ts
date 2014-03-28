/// <reference path="../../../../definitions/references.d.ts"/>
/// <reference path="../../../iview.ts"/>
/// <reference path="../../../../observable.ts"/>
/// <reference path="../../../../template-factory.ts"/>

module Genovesa.UI.DocumentViewer.AnnotationViewer.Forms {
    export class NewTagFieldForm extends Observable implements IView {
        private _contents: JQuery = null;

        /** @var {JQuery} Underlying JQuery view */
        private _view = TemplateFactory.create('document-viewer/add-tag-field');
        private autocomplete: boolean;

        constructor(autocomplete = false) {
            super();
            this.autocomplete = autocomplete;
            this.registerEventHandlers();
        }

        private registerEventHandlers(): void {
            this.view.find('a').click((e: JQueryEventObject) => {
                e.preventDefault();
                this.showForm();
            });
        }
        
        public get view(): JQuery {
            return this._view;
        }

        public reset(): void {
            var button = TemplateFactory.create('document-viewer/add-tag-field');
            this._view.replaceWith(button);
            this._view = button;
            this.registerEventHandlers();
        }

        private showForm(): void {
            var form = TemplateFactory.create('document-viewer/tag-field-form', { autocomplete: this.autocomplete });
            this.view.replaceWith(form);
            this._view = form;

            form.find('[data-action="add-tag-field"]').click((e: JQueryEventObject): void => {
                e.preventDefault();
                var name = form.find('input').val();

                if (name == '') {
                    alert('Veuillez saisir un nom pour le champ');
                    return;
                }

                this.trigger('new-tag-field', name);
                this.reset();
            });

            form.find('[data-action="cancel-tag-field"]').click((e: JQueryEventObject) => {
                e.preventDefault();
                this.reset();
            });
        }
    }
}
