/// <reference path="../definitions/references.d.ts"/>
/// <reference path="../definitions/jquery.d.ts"/>
/// <reference path="imodel.ts"/>
/// <reference path="document.ts"/>

module Genovesa.Models {

    /**
     * Represent a page in genovesa.
     *
     * @class
     */
    export class Page implements IModel {
        /** @const {string} The extension of manipulated images. */
        private static extension: string = '.jpg';

        /** @const {string} The path to the low-quality version of the images. */
        private static lowPath: string = '-low';

        /** @const {string} The path to the thumbnail version of the images. */
        private static thumbnail: string = 'thumbnail';

        /** @var {object} JSON object that holds this Township's fields. */
        private _raw: any = null;

        /**
         * Creates an instance of Page.
         *
         * @constructor
         * @param {PlainObject | string} The server-side-like page's data.
         */
        constructor(raw) {
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
         * Gets the position of this Page in its Document.
         *
         * @method
         * @return {number} The position of this Page in its Document. 
         */
        public get number(): number {
            return this._raw.number;
        }

        /**
         * Gets the path to the image of this Page on storage media.
         *
         * @method 
         * @return {string} The path to the image of this Page on storage media.
         */
        public get highResolutionPath(): string {
            return this._raw.imagePath + Page.extension;
        }

        /**
         * Gets the path to the low-quality image of this Page on storage media.
         *
         * @method 
         * @return {string} The path to the low-quality of this Page on storage media.
         */
        public get lowResolutionPath(): string {
            return this._raw.imagePath + Page.lowPath + Page.extension;
        }

        /**
         * Gets the path to the thumbnail image of this Page on storage media.
         *
         * @method 
         * @return {string} The path to the thumbnail image of this Page on storage media.
         */
        private get thumbnailPath(): string {
            return this._raw.imagePath + Page.thumbnail + Page.extension;
        }

        /**
         * Gets the high resolution image for this page.
         * 
         * @method
         * @return A JQuery promise that will fetch the image and give back a object of type HTMLElementImage. 
         */
        public get highResolutionImage(): JQueryPromise<any> {
            return Page.loadImage(this.highResolutionPath);
        }

        /**
         * Gets the low resolution image for this page.
         * 
         * @method
         * @return A JQuery promise that will fetch the low resolution image and give back a object of type HTMLElementImage. 
         */
        public get lowResolutionImage(): JQueryPromise<any> {
            return Page.loadImage(this.lowResolutionPath);
        }

        /**
         * Gets the thumbnail for this page.
         * 
         * @method
         * @return A JQuery promise that will fetch the thumbnail and give back a object of type HTMLElementImage. 
         */
        public get thumbnail(): JQueryPromise<any> {
            return Page.loadImage(this.thumbnailPath);
        }

        private static loadImage(src: string): JQueryPromise<any> {
            var deferred = $.Deferred();

            var image = new Image();
            image.src = src;
            image.onload = () => {
                deferred.resolve(image);
            };

            return deferred.promise();
        }
    }
}
