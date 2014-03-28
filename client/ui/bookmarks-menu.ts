/// <reference path="../definitions/references.d.ts"/>
/// <reference path="iview.ts"/>
/// <reference path="../template-factory.ts"/>
/// <reference path="../session.ts"/>


module Genovesa.UI {
    /**
     * A side menu that displays user's bookmarks.
     *
     * @class
     */
    export class BookmarksMenu implements IView {
        /** @var {JQuery} Underlying JQuery view. */
        private _view = TemplateFactory.create('bookmarks-menu', { bookmarks: [] });

        /**
         * Creates an instance of BookmarksMenu.
         *
         * @constructor
         */
        constructor() {

            // Register to global events.
            Session.registerHandler('login', () => { this.trackUser(); });
            Session.registerHandler('logout', () => { this.clean(); });

            this.clean();
        }

        /**
         * Tracks the event 'boomarksChanged' of the new User. 
         *
         * @method
         */
        private trackUser(): void {
            Session.currentUser.bind('changedBookmarks', () => {
                this.drawBookmarks()
            });

            // Let's do the first draw.
            this.drawBookmarks();
        }

        /**
         * Draws the bookmarks of the current user.
         * 
         * @method
         */
        private drawBookmarks(): void {
            var bookmarks = Session.currentUser.bookmarks;

            this._view.empty();

            // Let's draw the new bookmarks.
            this._view.append(TemplateFactory.create('bookmarks', { bookmarks: bookmarks }));
        }

        /**
         * Cleans the bookmarks.
         *
         * @method
         */
        private clean(): void {
            this._view.empty();
            this._view.append(TemplateFactory.create('bookmarks', { bookmarks: [] }));
        }

        public get view(): JQuery {
            return this._view;
        }
    }
}
