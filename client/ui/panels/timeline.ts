/// <reference path="../../definitions/references.d.ts"/>
/// <reference path="../timeline/resume.ts"/>
/// <reference path="../timeline/timeline.ts"/>
/// <referene path="../../application.ts"/>
/// <reference path="../../template-factory.ts"/>
/// <reference path="../../models/person.ts"/>
/// <reference path="../../observable.ts"/>
/// <reference path="ipanel.ts"/>

module Genovesa.UI.Panels {
    /**
     * A panel that will present the timeline of a person.
     *
     * @class
     * @param {Genovesa.Models.Person} person The person you want to create a timeline panel for.
     */
    export class TimelinePanel extends Observable implements IPanel {

        /** @var {Genovesa.Models.Person} The person you want a timeline panel for. */
        private person: Genovesa.Models.Person = null;

        /** @var {Genovesa.UI.Timeline.Resume} The resume component of this timeline panel. */
        private resume: Genovesa.UI.Timeline.Resume = null;

        /** @var {Genovesa.UI.Timeline.Timeline} The timeline component of this timeline panel. */
        private timeline: Genovesa.UI.Timeline.TimelineComponent = null;

        /** @var {JQuery} Underlying JQuery view. */
        private _view = TemplateFactory.create('panels/timeline-panel');

        /**
         * Creates an instance of TimelinePanel.
         *
         * @constructor
         * @param {Genovesa.Models.Person} person The person you want to create a timeline panel for.
         */
        constructor(person: Genovesa.Models.Person) {
            super();
            this.person = person;

            this.initializeComponents();
        }

        /**
         * Initialize all components of this panel.
         * 
         * @method
         */
        private initializeComponents(): void {
            // Let's construct the 3 ui components of this panel.
            this.resume = new Genovesa.UI.Timeline.Resume(this.person);
            this.timeline = new Genovesa.UI.Timeline.TimelineComponent(this.person);

            // We add them in the panel.
            this.view.append(this.resume.view);
            this.view.append(this.timeline.view);
        }

        public get toolbar(): JQuery {
            return null;
        }

        public get attached(): () => void {
            return () => { };
        }
        //#endregion

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

        public hasOpenedDocument(documentId): boolean {
            return false;
        }
    }
}
