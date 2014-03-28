/// <reference path="../../definitions/references.d.ts"/>
/// <reference path="../iview.ts"/>
/// <reference path="../../template-factory.ts"/>

module Genovesa.UI.Timeline {

    /**
     * Represent a section inside a resume.
     *
     * @class
     * @param {String} title The title of this new section.
     */
    export class ResumeSection implements IView {

        /** @var {JQuery} Underlying JQuery view. */
        private _view: JQuery = null;

        /**
         * Creates an instance of Resume.
         *
         * @constructor
         * @param {Genovesa.Models.Person} person The title of this new section.
         */
        constructor(title: string) {
            this._view = TemplateFactory.create('timeline/resume-section', { title: title });
        }

        /**
        * Add a new property into this section.
        *
        * @method
        * @param {String} name The name of this new property.
        * @param {{value, annotationGroup}[]} references An array of references of the property
        */
        public addProperty(name: string, references: any[]): void {
            this._view.find('.properties').append(TemplateFactory.create('timeline/resume-property', ({ name: name, references: references })));
        }

        /**
         * Get the underlying JQuery view of this component.
         *
         * @method
         * @override
         * @return The underkying JQuery view of this component.
         */
        public get view(): JQuery {
            return this._view;
        }
    }
}
