/// <reference path="../definitions/references.d.ts"/>
/// <reference path="iview.ts"/>
/// <reference path="../template-factory.ts"/>
/// <reference path="./forms/form.ts"/>

module Genovesa.UI {
    /** 
     * This class host displayed forms.
     *
     * @class
     */
    export class FormHost implements IView {
        private _view = TemplateFactory.create('forms/form-host');
        private currentForm: Forms.Form = null;

        constructor() {
        }

        public showForm(form: Forms.Form): void {
            // TODO: stackable forms
            if (this.currentForm !== null) {
                this.currentForm.close();
            }

            this.currentForm = form;

            this.currentForm.bind('clean', () => {
                this.currentForm = null;
                this.view.empty();
            });

            this.view.append(form.view);
            this.currentForm.show();
        }


        public get view(): JQuery {
            return this._view;
        }
    }
}