/// <reference path="../definitions/references.d.ts"/>
/// <reference path="../observable.ts"/>
/// <reference path="../api.ts"/>

module Genovesa.Models {

    /**
     * Provides a utility class to deal with the application's users.
     *
     * @class
     */
    export class User extends Observable {
        /** @var {any} User's attributes */
        private _data: any = null;

        /** @var {boolean} Is the user currently logged in */
        private _isLogged = false;

        /** @var {number} CSRF token for this user */
        private _csrfToken = 0;

        constructor(_data: string, csrfToken: number = 0) {
            super();

            this._data = _data;
            this._csrfToken = csrfToken;
        }

        /**
         * Returns a boolean indicating whether this user
         * is logged in or not.
         *
         * @method
         * @returns {boolean} True if the user is logged in, false otherwise.
         */
        public isLogged(): boolean {
            return this._isLogged;
        }

        /**
         * Gets the current CSRF token for this User.
         *
         * @method
         * @returns {number} The user's CSRF token.
         */
        public csrfToken(): number {
            return this._csrfToken;
        }

        /**
         * Computes the next CSRF token according to the current one.
         *
         * @method
         * @returns the next CSRF token according to the current one.
         */
        public computeNextCsrfToken(): void {
            this._csrfToken = (this._csrfToken + (this._csrfToken * 0x100) + 0xB00B) % 0x10000;
        }

        /**
         * Changes this User's status to logged in.
         *
         * @method
         */
        public login(): void {
          this._isLogged = true;
        }

        /**
         * Gets the name of the user.
         * 
         * @method
         */
        public get name(): string {
            return this._data['name'];
        }

        /**
         * Gets the bookmarks of this user.
         * Note: This a readonly array.
         *
         * @method
         */
        public get bookmarks(): { name: string; path: string; }[] {
            return this._data['bookmarks'];
        }

        /**
         * Adds a new bookmark to the user bookmarks list.
         * This trigger the event changedBookmarks of the user.
         *
         * @method
         * @param {String} name The name of the new bookmark.
         * @param {String} path The path of the new bookmark.
         */
        public addBookmark(name: string, path: string): void {
            this.bookmarks.push({ name: name, path: path });

            API.post('/bookmarks', { name: name, path: path }, 'text');

            this.trigger('changedBookmarks');
        }

        /**
         * Deletes the given bookmark from the user.
         * This trigger the event changedBookmarks of the user.
         *
         * @method
         * @param {String} name The name of the bookmark.
         * @param {String} path The path of the bookmark.
         */
        public deleteBookmark(name: string, path: string): void {
            for (var i = 0; i < this.bookmarks.length; ++i) {
                if (this.bookmarks[i].name == name && this.bookmarks[i].path == path) {
                    this.bookmarks.splice(i, 1);
                    break;
                }
            }

            API.destroy('/bookmarks', { name: name, path: path }, 'text');

            this.trigger('changedBookmarks');
        }

        /**
         * Checks if the user has this bookmark.
         *
         * @method
         * @param {String} name The name of the bookmark.
         * @return {bool} true if the user has this bookmark, false otherwise.
         */
        public hasBookmark(name: string): boolean {
            for (var i = 0; i < this.bookmarks.length; ++i) {
                if (this.bookmarks[i].name == name) {
                    return true;
                }
            }

            return false;
        }

        public get data(): any {
            return this._data;
        }

        public get id(): string {
            return this._data._id;     
        }
    }
}
