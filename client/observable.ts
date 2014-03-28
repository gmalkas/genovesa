/// <reference path="definitions/references.d.ts"/>

module Genovesa {
    /**
     * Base class that implements the pattern Observable.
     *
     * @class
     */
    export class Observable {
        /** @var {array} Registered events. */
        private events: { [index: string]: Function[]; } = {};

        /**
         * Binds an event handler to an event.
         *
         * @method
         * @param {string} event The event name.
         * @param {function} handler The function that will be called when the event is triggered.
         */
        public bind(event: string, handler: Function): void {
            // Initialize array of handlers for the event if it doesn't exist.
            this.events[event] = this.events[event] || [];
            // Append the handler at the bottom of the stack.
            this.events[event].push(handler);
        }

        /**
         * Triggers an event.
         *
         * @method
         * @param {string} event The event name.
         */
        public trigger(event: string, ...args: any[]): void {
            // Copy of the handlers for the event.
            var handlers = this.events[event] || [];

            // Call every handler in succession.
            for (var i = 0; i < handlers.length; ++i) {
                // Forward this function's argument (except "event").
                handlers[i].apply(this, args);
            }
        }
    }
}
