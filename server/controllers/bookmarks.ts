/// <reference path="../definitions/references.d.ts"/>
/// <reference path="base.ts"/>
/// <reference path="../utils/session.ts"/>
/// <reference path="../models/user.ts"/>
/// <reference path="../configuration.ts"/>

module Genovesa.Controllers {
    // TODO: doc
    export class Bookmarks {

        /**
         * Returns user's bookmarks
         *
         * @method
         * @param {express.Request} req The request object.
         * @param {express.Response} res The response object.
         * @param {function} next The next middleware.
         */
        public static all(req: ExpressServerRequest, res: ExpressServerResponse, next: Function): void {
            if (!Utils.Session.isLogged(req)) {
                res.send(403);
                return;
            }

            Models.User.findById(Utils.Session.currentUser(req), (err, user) => {
                if (err) {
                    next(err);
                    return;
                }

                res.send(200, user.bookmarks || []);
            });
        }


        /**
         * Adds a new bookmark to the user list.
         *
         * @method
         * @param {express.Request} req The request object.
         * @param {express.Response} res The response object.
         * @param {function} next The next middleware.
         */
        public static add(req: ExpressServerRequest, res: ExpressServerResponse, next: Function): void {
            if (!Utils.Session.isLogged(req)) {
                res.send(403);
                return;
            }

            var id = Utils.Session.currentUser(req);

            Models.User.findById(id, (err, user) => {
                if (err) {
                    next(err);
                    return;
                }

                var bookmarks = user.bookmarks || [];

                bookmarks.push({ name: req.body.name, path: req.body.path });

                Models.User.findByIdAndUpdate(id, { bookmarks: bookmarks }, (err, result) => {
                    if (err) {
                        next(err);
                        return;
                    }

                    res.send(200);
                });

            });
        }

        /**
         * Deletes a given bookmark from the user list.
         *
         * @method
         * @param {express.Request} req The request object.
         * @param {express.Response} res The response object.
         * @param {function} next The next middleware.
         */
        public static remove(req: ExpressServerRequest, res: ExpressServerResponse, next: Function): void {
            if (!Utils.Session.isLogged(req)) {
                res.send(403);
                return;
            }

            var id = Utils.Session.currentUser(req);

            Models.User.findById(id, (err, user) => {
                if (err) {
                    next(err);
                    return;
                }

                var bookmarks = user.bookmarks || [];

                for (var i = 0; i < bookmarks.length; ++i) {
                    if (bookmarks[i].name === req.body.name && bookmarks[i].path === req.body.path) {
                        bookmarks.splice(i, 1);
                        break;
                    }
                }

                Models.User.findByIdAndUpdate(id, { bookmarks: bookmarks }, (err, result) => {
                    if (err) {
                        next(err);
                        return;
                    }

                    res.send(200);
                });

            });
        }
    }
}
