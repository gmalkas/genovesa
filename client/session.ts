/// <reference path="definitions/references.d.ts"/>
/// <reference path="models/user.ts"/>
/// <reference path="api.ts"/>

module Genovesa {
    export class Session {
        
        /** @var {Genovesa.Models.User} The app's current user */
        // TODO fix accessibility
        public static currentUser: Models.User = null;

        /** @var { (user: Models.User): void; } An array of event handlers that will be called when the user log into his account. */
        private static onUserLoginHandlers: Function[] = [];

        /** @var { (user: Models.User): void; } An array of event handlers that will be called when the user log out. */
        private static onUserLogoutHandlers: Function[] = [];


        public static isLogged(): boolean {
            if (Session.currentUser) {
                return Session.currentUser.isLogged();
            }

            return false;
        }

        /**
         * Register a new user.
         *
         * @param {string} data A serialized form
         * @param {function} callback
         */
        public static register(data, callback: (errors: any, user: Models.User) => void) {
            Genovesa.API.post('/users', data).then((result) => {

                if (result.errors) {
                    callback(result, null);
                    return;
                }

                callback(null, new Models.User(result.user));
            });
        }

        /**
         * Tries to log in a user.
         *
         * @param {string} data A serialized form
         * @param {function} callback
         */
        public static login(data, callback: (error:any, user: Models.User) => void): void {
            Genovesa.API.post('/users/login', data).then((result) => {

                if (result.errors) {
                    callback(result, null);
                    return;
                }

                Session.currentUser = new Models.User(result.user, result._csrfToken);
                Session.currentUser.login();
                callback(null, Session.currentUser);

                // Notice everyone that an user logged into his account.
                for (var i = 0; i < Session.onUserLoginHandlers.length; ++i) {
                    Session.onUserLoginHandlers[i]();
                }
            });
        }

        public static load(callback: (error: any, user: Models.User) => void) {
            Genovesa.API.get('/users/session').then((result) => {
                
                if (result.errors) {
                    callback(result, null);
                    return;
                }
                
                if (result.user !== null) {
                    Session.currentUser = new Models.User(result.user, result._csrfToken);
                    Session.currentUser.login();

                    callback(null, Session.currentUser);

                    // Notice everyone that an user logged into his account.
                    for (var i = 0; i < Session.onUserLoginHandlers.length; ++i) {
                        Session.onUserLoginHandlers[i]();
                    }
                }
            });
        }

        /**
         * Logs out the current user.
         *
         * @param {Function} callback
         */
        public static logout(callback) {


            Genovesa.API.post('/users/logout').then((result) => {
                callback(result.errors);

                Session.currentUser = null;
                // Notice everyone that the user logged out.
                for (var i = 0; i < Session.onUserLogoutHandlers.length; ++i) {
                    Session.onUserLogoutHandlers[i]();
                }
            });
        }

        /**
         * Registers a new event handler.
         *
         * @method
         * @static
         * @param {Authentication.Event} eventType The event you want to handle.
         * @param {Function} handler The handler for this event.
         */
        public static registerHandler(eventType: string, handler: Function): void {
            switch (eventType) {
                case 'login':
                    Session.onUserLoginHandlers.push(handler);
                    break;
                case 'logout':
                    Session.onUserLogoutHandlers.push(handler);
                    break;
                default:
                    throw new Error('Unknown handler type');
                    break;
            }
        }
    }
}
