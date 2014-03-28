/// <reference path="../../definitions/references.d.ts"/>
/// <reference path="../iview.ts"/>
/// <reference path="../../observable.ts"/>

module Genovesa.UI.Forms {
    /**
     * Abstract class that encapsulate the basic behaviours of a form.
     *
     * @class
     */
    export class Form extends Observable implements IView {
        // TODO: Replace this with an enum, which are compatibles with the next typescript version.
        public static Result = {
            cancel: 0,
            yes: 1,
            no: 2
        };

        private _result: number = null;

        // No need to encapsulate.
        public resultAction: string = null;


        /**
         * Indicates whether this form is modal or not.
         * Note: A modal form or dialog box must be closed or hidden before you can continue working with the rest of the application.
         *       A modal form must be close by assigning the result value.
         *       This property can be override in childs classes.
         *
         * @method
         * @return tue if the form is modal, false otherwise.
         */
        public get isModale(): boolean {
            return true;
        }

        /**
         * Creates an instance of Form.
         *
         * @constructor
         */
        constructor() {
            super();
        }

        //#region IView
        /**
         * Abstract method: must be implemented.
         */
        public get view(): JQuery {
            throw new Error('This method is abstract');
            return null;
        }
        //#endregion

        /**
         * Shows the login form.
         * Reset the form result to null.
         *
         * @method
         */
        public show(): void {
            this._result = null;
            this.view.hide();
            this.view.fadeIn(150);
        }

        /**
         * Closes the form. 
         * Set the result value to 'cancel' if the form is modale.
         * 
         * @method
         */
        public close(): void {
            if (this.isModale) {
                this.result = Form.Result.cancel;
            } else {
                console.log(this);
                this.end();
            }
        }

        /**
         * Ends the interaction between the user and the form.
         *
         * @method
         * @private
         */
        public end(): void {
            this.view.fadeOut(150, () => {
                this.trigger('clean');
                this.trigger('end');
            });
        }

        /**
         * Gets the result of this form.
         * 
         * @method
         * @return {string} The result of the form.
         */
        public get result(): number {
            return this._result;
        }

        /**
         * Sets the result of this form.
         * Note: If the form is modal, calling this setter will end the user interaction with this form.
         *
         * @method
         * @param {String} The new result of the form.
         */
        public set result(data: number) {
            this._result = data;

            if (this.isModale) {
                this.end();
            }
        }
    }
}
