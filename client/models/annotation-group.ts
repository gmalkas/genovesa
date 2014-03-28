/// <reference path="./imodel.ts"/>
/// <reference path="../observable.ts"/>
/// <reference path="./user.ts"/>
/// <reference path="./page.ts"/>
/// <reference path="annotation.ts"/>
/// <reference path="../geometry/point.ts"/>
/// <reference path="../geometry/size.ts"/>

module Genovesa.Models {

    /**
     * Represent an annotation group in genovesa.
     *
     * @class
     */
    export class AnnotationGroup implements IModel {
        private _raw: any = null;

        private _document: Document = null;
        private _owner: User = null;

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


        public get document(): Document {
            return this._document;
        }

        public set document(value: Document) {
            this._document = value;
            this._raw.document = value.id;
        }

        public get pageNumber(): number {
            return this._raw.pageNumber;
        }

        public set pageNumber(value: number) {
            this._raw.pageNumber = value;
        }

        /**
         * Page on which this AnnotationGroup appears.
         *
         * @method
         * @return {Page} The Page on which this AnnotationGroup appears.
         */
        public get page(): Page {
            return this.document.pages[this.pageNumber];
        }

        /**
         * Gets the User who created and owns this AnnotationGroup.
         *
         * @method
         * @return {User} The User who created and owns this AnnotationGroup.
         */
        public get owner(): User {
            return this._owner;
        }

        public set owner(value: User) {
            this._owner = value;
        }

        /**
         * Gets the coordinates of this AnnotationGroup on the Page.
         * 
         * @method
         * @return {Geometry.Point} The coordinates of this AnnotationGroup on the Page.
         */
        public get position(): Geometry.Point {
            return new Geometry.Point(this._raw.position.x, this._raw.position.y);
        }

        /**
         * Sets the coordinates of this AnnotationGroup on the Page.
         * 
         * @method
         * @param {Geometry.Point} The coordinates of this AnnotationGroup on the Page.
         */
        public set position(value: Geometry.Point) {
            this._raw.position.x = value.x;
            this._raw.position.y = value.y;
        }

        /**
         * Gets the area covered by this AnnotationGroup on the Page.
         * 
         * @method
         * @return {Geometry.Size} The area covered by this AnnotationGroup on the Page.
         */
        public get size(): Geometry.Size {
            return new Geometry.Size(this._raw.size.width, this._raw.size.height);
        }

        /**
         * Sets the area covered by this AnnotationGroup on the Page.
         * 
         * @method
         * @param {Geometry.Size} The area covered by this AnnotationGroup on the Page.
         */
        public set size(value: Geometry.Size) {
            this._raw.size.width = value.width;
            this._raw.size.height = value.height;
        }

        /**
         * Array of pairs <ref, role>, indicating which Annotations belong to
         * this AnnotationGroup and what their role is.
         * ref is a reference to Annotation.
         * role is the role of the Annotation (for example: concerned, father, mother,
         * witness, ...).
         *
         * @method
         * @return [{ annotation: Annotation, role: string }]
         */
        public get annotations(): { annotation: Annotation; role: string; }[] {
            return this._raw.annotations;
        }

        /**
         * Gets tags describing the context of this AnnotationGroup.
         *
         * For example: date, place, type of event (birth, death, ...).
         * @method 
         * @param [Tags] the tags describing the context of this AnnotationGroup.
         */
        public get tags(): { key: string; value: string; }[] {
            return this._raw.tags;
        }

        public set tags(value: { key: string; value: string; }[]) {
            // TODO: double check this
            this._raw.tags = value;
        }
    }
}
