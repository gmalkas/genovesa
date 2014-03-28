/// <reference path="../definitions/references.d.ts"/>
/// <reference path="imodel.ts"/>

module Genovesa.Models {
    /**
     * Represents a DocumentType.
     *
     * @class
     */
    export class DocumentType implements IModel {
        /** @var {object} JSON object that holds this DocumentType's fields. */
        private _raw: any = null;

        /**
         * Initializes a new instance of the DocumentType class.
         *
         * @constructor
         * @param {object} raw The raw JSON data of this DocumentType.
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
         * Type of document.
         * For example: "birth", "death", ...
         *
         * @type {string}
         * @readonly
         */
        public get type(): string {
            return this._raw.type;
        }

        /**
         * Localized name of the document type.
         * For example: "naissance", "décès", ...
         *
         * @type {string}
         * @readonly
         */
        public get name(): string {
            return this._raw.name;
        }
    }
}
