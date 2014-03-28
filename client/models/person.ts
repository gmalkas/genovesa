/// <reference path="./township.ts"/>
/// <reference path="./user.ts"/>
/// <reference path="./annotation.ts"/>
/// <reference path="./imodel.ts"/>

module Genovesa.Models {

    /**
     * Represents a person.
     *
     * @class
     */
    export class Person implements IModel {
        private _raw: any = null;
        private _events: any[] = [];
        private _attributes: any[] = [];

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

        /**
         * Get the references of the annotations linked to this person.
         *
         * @method
         * @returns [Annotation] The references of the annotations linked to this person.
         */
        public get attributes(): any[] {
            return this._attributes;
        }

        public set attributes(value: any[])  {
            this._attributes = value;
        }

        public get events(): any[] {
            return this._events;
        }

        public set events(value: any[])  {
            this._events = value;
        }

        /**
         * Get the id of the person's owner.
         *
         * @method
         * @returns {string} The id of the person's owner.
         */
        public get owner(): string {
            return this._raw.owner;
        }

        /**
         * Get person's firstname.
         *
         * @method
         * @returns {string} The person's firstname.
         */
        public get firstname(): string {
            return this.getMostRecentValue('Prénom');
        }

        /**
         * Get person's lastname.
         *
         * @method
         * @returns {string} The person's lastname.
         */
        public get lastname(): string {
            return this.getMostRecentValue('Nom') || 'Inconnu';
        }

        public get fullname(): string {
            if (this.firstname) {
              return this.firstname + ' ' + this.lastname;
            }

            return this.lastname;
        }

        public get birthPlace(): string {
            return this.getMostRecentValue('Lieu de naissance') || 'Inconnu';
        }

        public get birthDate(): string {
            return this.getMostRecentValue('Date de naissance') || 'Inconnue';
        }

        // FIXME Not really most recent
        private getMostRecentValue(key: string) : string {
            var instance = this.attributes.filter(attribute => {
                return (attribute.key == key);
            });

            if (instance.length > 0 && instance[0].references.length > 0) {
                return instance[0].references[0].value;
            }

            return null;
        }

    }
}
