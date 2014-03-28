/// <reference path="../definitions/references.d.ts"/>

module Genovesa.Errors {
    // TODO: doc
    export class Application {
        // TODO: doc
        private name = 'ApplicationError';
        private type: string;
        private message: string;

        constructor(message?: string, type?: string) {
            this.name = 'ApplicationError';
            this.type = type || 'default';
            this.message = message || 'Application Error';
        }
    }
}
