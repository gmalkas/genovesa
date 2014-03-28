/// <reference path="../../../../definitions/references.d.ts"/>
/// <reference path="../../../iview.ts"/>
/// <reference path="../../../../observable.ts"/>
/// <reference path="../../../../template-factory.ts"/>
/// <reference path="../../../../models/person.ts"/>
/// <reference path="./new-tag-field-form.ts"/>

module Genovesa.UI.DocumentViewer.AnnotationViewer.Forms {
    export class PersonFieldForm extends Observable implements IView {
        private name: string            = null;
        private id: string              = null;
        private fieldCounter: number    = null;
        private tagFields: JQuery       = null;
        private newTagFieldForm: NewTagFieldForm = null;

        /** @var {JQuery} Underlying JQuery view */
        private _view = null;

        constructor(id: string) {
            super();
            this._view = TemplateFactory.create('document-viewer/person-field', { name: 'person-' + id })
            this.name            = 'person-' + id;
            this.id              = id;
            this.fieldCounter    = 0;
            this.tagFields       = this.view.find('.person-fields').first();
            this.newTagFieldForm = new NewTagFieldForm(true);

            this.view.find('.person-tag-field-form').first().append(this.newTagFieldForm.view);
            this.registerEventHandlers();
        }

        public get view(): JQuery {
            return this._view;
        }

        private registerEventHandlers(): void {
            this.newTagFieldForm.bind('new-tag-field', (name: string): void => {
                this.addTagField(name);
            });

            this.view.find('[data-action=remove-person]').click((e: JQueryEventObject): void => {
                this.view.remove();
                this.trigger('remove');
            });
        }

        public addTagField(name: string, defaultValue: string = null, removable = true): void {
            this.fieldCounter++;

            var field = {
                id: 'person-field-' + this.id + '-' + this.fieldCounter,
                name: name,
                removable: removable,
                value: defaultValue
            };

            var newField = TemplateFactory.create('document-viewer/tag-field', field);
            this.tagFields.append(newField);

            newField.find('[data-action="remove-field"]').click((e: JQueryEventObject): void => {
                e.preventDefault();
                this.tagFields.find('[data-field="' + field.id + '"]').remove();
            });
        }

        public setPersons(persons: Models.Person[]):void {
            persons.forEach(person => {
              this.view.find('select').append($('<option value="' + person.id + '">' + person.fullname + '</option>'));
            });
        }

        public getAnnotation(): any {
            var annotation = {
                tags: [],
                person: null,
                role: '',
                _id: this.view.find('[name="_annotationId"]').val()
            };

            this.view.find('.person-fields input').each((index: any, tag: Element): void => {
                // Ignore Rôle tag
                if ($(tag).attr('data-tag-key') == 'Rôle') {
                    return;
                }

                // Ignore tags with no values
                if (!$(tag).val()) {
                    return;
                }

                annotation.tags.push({
                    key: $(tag).attr('data-tag-key'),
                    value: $(tag).val()
                });
            });


            annotation.person = this.view.find('select').val();
            annotation.role = this.view.find('[data-tag-key=Rôle]').val();

            return annotation;
        }
    }
}
