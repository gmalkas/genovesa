/// <reference path="../../definitions/references.d.ts"/>
/// <reference path="./resume-sections.ts"/>
/// <reference path="../iview.ts"/>
/// <reference path="../../template-factory.ts"/>

module Genovesa.UI.Timeline {

    /**
     * A simple resume for a person that can be embedded into the timeline panel.
     *
     * @class
     * @param {Genovesa.Models.Person} person The person you want a resume for.
     */
    export class Resume implements IView {
        /** @var {Genovesa.Models.Person} The person you a resume for. */
        private person: Genovesa.Models.Person = null;

        /** @var {JQuery} The HTML body of this resume. */
        private body: JQuery                   = null;

        /** @var {Genovesa.UI.Timeline.ResumeSection} The resume section for the identity of the person. */
        private identity: ResumeSection        = null;

        /** @var {Genovesa.UI.Timeline.ResumeSection} The resume section for the other details of the person. */
        private other: ResumeSection           = null;

        /** @var {JQuery} Underlying JQuery view. */
        private _view: JQuery                  = null;

        /**
         * Creates an instance of Resume.
         *
         * @constructor
         * @param {Genovesa.Models.Person} person The person you want a resume for.
         */
        constructor(person: Genovesa.Models.Person) {
            this._view = TemplateFactory.create('timeline/resume', person);

            this.person = person;
            this.body = this.view.find('#resume-body');
            this.generateSections();
        }

        /**
        * Generate all sections for this resum (like familly section, person characteristic, ...).
        *
        * @method
        */
        private generateSections(): void {
            this.identity = new ResumeSection(this.person.fullname);
            this.other = new ResumeSection('Autres annotations');

            var identityKeys = ['Nom', 'Prénom', 'Date de naissance', 'Lieu de naissance', 'Date du décès', 'Lieu du décès'];

            // TODO Refactor this if needed later on
            this.person.attributes.forEach(attribute => {
                if (identityKeys.indexOf(attribute.key) >= 0) {
                    this.identity.addProperty(attribute.key, attribute.references);
                } else {
                    this.other.addProperty(attribute.key, attribute.references);
                }
            });

            this.addSection(this.identity.view);
            this.addSection(this.other.view);
        }

        /**
          *  Add a new section into the resume.
          *
          * @method {Object} section The new section.
          */
        private addSection(section: JQuery) {
            this.body.append(section);
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
