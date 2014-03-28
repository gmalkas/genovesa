/// <reference path="../definitions/references.d.ts"/>
/// <reference path="imodel.ts"/>

module Genovesa.Models {
    /**
     * Represents a Township.
     *
     * @class
     */
    export class Township implements IModel {
        /** @var {object} JSON object that holds this Township's fields. */
        private _raw: any = null;

        /**
         * Initializes a new instance of the Township class.
         *
         * @constructor
         * @param {object} raw The raw JSON data of this Township.
         */
        constructor(raw: any) {
            this._raw = raw;
        }

        //#region IModel members.

        public get raw(): any {
            return this._raw;
        }

        public get id(): string {
            return this._raw._id;
        }

        //#endregion

        /**
         * Postal code of this Township.
         *
         * @type {string}
         * @readonly
         */
        public get postalCode(): string {
            return this._raw.postalCode;
        }

        /**
         * Name of this Township.
         *
         * @type {string}
         * @readonly
         */
        public get name(): string {
            return this._raw.name;
        }

        /**
         * Department this Township belongs to.
         *
         * @type {string}
         * @readonly
         */
        public get department(): string {
            return this._raw.department;
        }
    }
}
