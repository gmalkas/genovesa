/// <reference path="../../../../definitions/references.d.ts"/>
/// <reference path="../../../iview.ts"/>
/// <reference path="../../../../observable.ts"/>
/// <reference path="../../../../template-factory.ts"/>
/// <reference path="../../../../repository.ts"/>
/// <reference path="../../../../models/person.ts"/>
/// <reference path="./new-tag-field-form.ts"/>
/// <reference path="./person-field-form.ts"/>

module Genovesa.UI.DocumentViewer.AnnotationViewer.Forms {
    export class AnnotationGroupForm extends Observable implements IView {
        private tagFields: JQuery                = null;
        private newTagFieldForm: NewTagFieldForm = null;
        private personFields: PersonFieldForm[]  = null;
        private personCounter: number            = null;
        private fieldCounter: number             = null;
        private persons: Models.Person[] = [];

        /** @var {JQuery} Underlying JQuery view */
        private _view = TemplateFactory.create('document-viewer/annotation-group-form');

        constructor(annotationGroup: Models.AnnotationGroup = null) {
            super();

            this.tagFields = this.view.find('.fields').first();
            this.newTagFieldForm = new NewTagFieldForm();
            this.view.find('.tag-field-form').first().append(this.newTagFieldForm.view);

            this.personFields  = [];
            this.personCounter = 0;
            this.fieldCounter  = 0;

            Repository.of('Person').where({owner: Session.currentUser.id}).then(persons => {
                this.persons = persons;
                if (this.personCounter > 0) {
                    this.personFields.forEach(field => {
                        field.setPersons(persons);
                    });
                }
            });

            this.registerEventHandlers();

        }

        public get view(): JQuery {
            return this._view;
        }

        private registerEventHandlers(): void {
            this.newTagFieldForm.bind('new-tag-field', (name: string): void => {
                this.addTagField(name)
            });

            this.view.find('[data-action=add-person-field]').click((e: JQueryEventObject): void => {
                e.preventDefault();
                this.addPersonField();
            });

            this.view.find('[data-action=create-annotation-group]').click((e: JQueryEventObject): void => {
                e.preventDefault();
                this.submit();
            });
        }


        public addTagField(name: string, defaultValue: string = null, removable = true): void {
            this.fieldCounter++;

            var field = {
                id: 'group-field-' + this.fieldCounter,
                name: name,
                value: defaultValue,
                removable: removable
            };

            var newField = TemplateFactory.create('document-viewer/tag-field', field);
            this.tagFields.append(newField);

            newField.find('[data-action="remove-field"]').click((e: JQueryEventObject): void => {
                e.preventDefault();
                this.tagFields.find('[data-field="' + field.id + '"]').remove();
            });
        }

        private addPersonField(): void {
            this.personCounter++;
            var field = new PersonFieldForm(this.personCounter.toString());
            field.setPersons(this.persons);

            this.personFields[this.personCounter] = field;
            field.bind('remove', (): void => {
                var rest = this.personFields.slice(this.personCounter + 1, this.personFields.length);
                this.personFields.length--;
                this.personFields.concat(rest);
            });

            field.addTagField('Rôle', '', false);
            field.addTagField('Nom');
            field.addTagField('Prénom');

            this.view.find('.persons').append(field.view);
        }

        public submit(): void {
            var group = {
                _id: this.view.find('[name="_id"]').val(),
                tags: [],
                annotations: []
            };

            this.view.find('.fields input').each((index: any, tag: Element): void => {
                if (!$(tag).val()) {
                    return;
                }

                group.tags.push({
                    key: $(tag).attr('data-tag-key'),
                    value: $(tag).val()
                });
            });

            this.personFields.forEach((personField: any): void => {
                group.annotations.push(personField.getAnnotation());
            });

            this.trigger('submit', group);
        }
    }
}


