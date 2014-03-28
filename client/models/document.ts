/// <reference path="../definitions/references.d.ts"/>
/// <reference path="imodel.ts"/>
/// <reference path="./township.ts"/>
/// <reference path="./document-type.ts"/>


module Genovesa.Models {
    export class Document implements IModel {
        /** @var {object} JSON object that holds this Document's fields. */
        private _raw = null;

        private _township: Township = null;
        private _documentTypes: DocumentType[] = [];

        private _pages: Page[] = [];

        /**
         * Initializes a new instance of the Document class.
         *
         * @constructor
         * @param {object} raw The raw JSON data of this Document.
         */
        constructor(raw: any) {
            this._raw = raw;

            raw.pages.forEach(rawPage => {
                var page = new Page(rawPage);
                this._pages[page.number] = page;
            });
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
         *
         *
         * @type {string}
         * @readonly
         */
        public get reference(): string {
            return this._raw.reference;
        }

        public get township(): Township {
            return this._township;
        }

        public set township(value: Township) {
            this._township = value;
            this._raw.township = value.id;
        }

        /**
         *
         *
         * @type {number}
         * @readonly
         */
        public get fromYear(): number {
            return this._raw.fromYear;
        }

        /**
         *
         *
         * @type {number}
         * @readonly
         */
        public get toYear(): number {
            return this._raw.toYear;
        }

        public get documentTypes(): DocumentType[] {
            return this._documentTypes;
        }

        /**
         *
         *
         * @type {string}
         * @readonly
         */
        public get collectionType(): string {
            return this._raw.collectionType;
        }

        public get pages(): Page[] {
            return this._pages;
        }

        /**
         *
         *
         * @type {bool}
         * @readonly
         */
        public get singleYear(): boolean {
            return this.fromYear == this.toYear;
        }
    }
}
