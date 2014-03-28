/// <reference path="./imodel.ts"/>
/// <reference path="../observable.ts"/>
/// <reference path="./annotation-group.ts"/>
/// <reference path="./person.ts"/>

module Genovesa.Models {

    /**
     * Represent an annotation in genovesa.
     *
     * @class
     */
    export class Annotation implements IModel {

        private _raw: any = null;

        private _group: AnnotationGroup = null;
        private _person: Person = null;

        /**
         * Creates an instance of Annotation.
         *
         * @constructor
         * @param {PlainObject | string} The server-side-like annotation's data.
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
         * Get the AnnotationGroup this Annotation is contained in.
         *
         * @method
         * @return {AnnotationGroup} The AnnotationGroup this Annotation is contained in.
         */
        public get group(): AnnotationGroup {
            return this._group;
        }

        public set group(value: AnnotationGroup) {
            this._group = value;
            this._raw.group = value.id;
        }

        /**
         * Get the Person described by this Annotation.
         *
         * @method
         * @return {Person} The Person described by this Annotation.
         */
        public get person(): Person {
            return this._person;
        }

        public set person(value: Person) {
            this._person = value;
            this._raw.person = value.id;
        }


        /**
         * Get the Tags contained in this Annotation.
         *
         * @method
         * @return { [index: string]: string; } The Tags contained in this Annotation.
         */
        public get tags(): { key: string; value: string; }[] {
            return this._raw.tags;
        }

        public set tags(value: { key: string; value: string; }[]) {
            // TODO double check this
            this._raw.tags = value;
        }

        /**
         * Removes a given tag then call the given
         * callback when the annotation has been saved.
         *
         * @param {String} key
         * @param {Function} callback
         */
        public removeTag(key: string): void {
            delete this.tags[key];
        }
    }
}
