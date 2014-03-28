/// <reference path="../definitions/references.d.ts"/>
/// <reference path="base.ts"/>
/// <reference path="../utils/session.ts"/>
/// <reference path="../models/user.ts"/>
/// <reference path="../configuration.ts"/>

module Genovesa.Controllers {
    // TODO: doc
    export class Users {
        public static findById(req: ExpressServerRequest, res: ExpressServerResponse, next: Function): void {
            var query = Models.User.findById(req.params.id);

            // Run the query.
            Base.execFind(query, res, next);
        }

        /**
         * Returns the current user session if there is one.
         *
         * @param {ExpressJS.Request} req
         * @param {ExpressJS.Response} res
         */
        public static session(req, res) {
            if (req.signedCookies.userid || req.session.userid) {
                var id = req.signedCookies.userid || req.session.userid;

                Models.User.findOne({ _id: id }).exec(function (err, user) {
                    if (err) {
                        req.session.destroy(function () {
                            res.clearCookie('userid');
                            res.json(400, { code: 400, errors: err });
                        });
                        return;
                    }

                    if (!req.session.userid) {
                        req.session.regenerate(function () {
                            req.session.logged = true;
                            req.session.userid = user.id;
                            // Let's generate a root token.
                            req.session._csrfToken = Utils.Session.generateRootToken();


                            res.json(200, { code: 200, user: user, _csrfToken: req.session._csrfToken });
                        });
                    } else {
                        res.json(200, { code: 200, user: user });
                    }

                });

            } else {
                res.json(200, { code: 200, user: null });
            }
        }

        /**
         * Creates a new user.
         *
         * @param {ExpressJS.Request} req
         * @param {ExpressJS.Response} res
         */
        public static create(req, res) {
            var user = new Models.User(req.body.user);

            if (Configuration.global()) {
                user.validated = !Configuration.global().setting('manual_account_validation');
            } else {
                user.validated = true;
            }

            user.bookmarks = [];

            user.save(function (err) {
                if (err) {
                    var response = Controllers.Base.parseError(err);
                    res.json(response.code, response);
                    return;
                }

                res.json(201, { code: 201, user: user });
            });
        }

        /**
         * Creates a new session for a given user.
         * May create a cookie to persist the session.
         *
         * @param [ExpressJS.Request] req
         * @param [ExpressJS.Response] res
         */
        public static login(req, res) {
            if (!Users._hasLoginParams(req.body)) {
                res.json(400, { code: 400 });
            } else {
                Models.User.authenticate(req.body.user.email, req.body.user.password, function (err, user) {
                    if (err) {
                        res.json(Controllers.Base.parseError(err));
                    } else {
                        if (req.body.persist == 'on') {
                            // Create a persistent session.
                            res.cookie('userid', user.id, { expires: new Date(Date.now() + 7200000), signed: true, httpOnly: true });
                        }

                        req.session.regenerate(function () {
                            req.session.logged = true;
                            req.session.userid = user.id;

                            // Let's generate a root token.
                            req.session._csrfToken = Utils.Session.generateRootToken();

                            res.json(200, { code: 200, user: user, _csrfToken: req.session._csrfToken });
                        });
                    }
                });
            }
        }

        /**
         * Clears the current session.
         *
         * @param [ExpressJS.Request] req
         * @param [ExpressJS.Response] res
         */
        public static logout(req, res) {
            res.clearCookie('userid');
            req.session.destroy(function () {
                res.json({ code: 200 });
            });
        }

        /**
         * Checks all the parameters are defined.
         * DOES NOT run validation on the params.
         */
        private static _hasLoginParams(params) {
            return params.user && params.user.email && params.user.password;
        }
    }
}
