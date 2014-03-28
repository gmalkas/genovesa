/// <reference path="./user.ts"/>
/// <reference path="./annotation-group.ts"/>
/// <reference path="./imodel.ts"/>

module Genovesa.Models {

    /**
     * Represents an event.
     *
     * @class
     */
    export class Event implements IModel {
        private _raw: any = null;

        private _annotationGroup: Models.AnnotationGroup = null;

        /**
         * Creates an instance of Person.
         *
         * @constructor
         * @param {PlainObject | string} The server-side-like person's data.
         */
        constructor(data: any) {
            this._raw = data;
        }

        //#region IModel members.

        public get raw(): any {
            return this._raw;
        }

        public get id(): string {
            return this._raw._id;
        }

        //#endregion

        public get annotationGroup(): Models.AnnotationGroup {
            return this._annotationGroup;
        }

        public set annotationGroup(value: Models.AnnotationGroup) {
            this._annotationGroup = value;
            this._raw.annotationGroup = value.id;
        }

        public get participants(): any[] {
            return this._raw.participants;
        }

    }
}
