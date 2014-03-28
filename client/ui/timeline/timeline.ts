/// <reference path="../../definitions/references.d.ts"/>
/// <reference path="../iview.ts"/>
/// <reference path="../../template-factory.ts"/>
/// <reference path="../../models/person.ts"/>

module Genovesa.UI.Timeline {

    /**
     * This class represent the timeline part of the timeline panel.
     *
     * @class
     */
    export class TimelineComponent implements IView {

        /** @var {JQuery} Underlying JQuery view. */
        private _view = TemplateFactory.create('timeline/timeline-component');

        /** @var {Genovesa.Models.Person} The person you a resume for. */
        private person: Genovesa.Models.Person = null;

        /**
         * Creates an instance of Timeline.
         *
         * @constructor
         * @param {Genovesa.Models.Person} person The person you want a timeline for.
         */
        constructor(person: any) {
            this.person = person;
            this.generateEvents();
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

        private generateEvents(): void {
            this.person.events.forEach(event => {
                event.person = this.person;
               var eventView = TemplateFactory.create('timeline/event', event); 
               this.view.find('.events').append(eventView);
            });
        }
    }
}

