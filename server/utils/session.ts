/// <reference path="../definitions/references.d.ts"/>

module Genovesa.Utils {
    /**
     * Helper for session management.
     *
     * @class
     */
    export class Session {
        /**
         * Check wether an user is logged or not. 
         * 
         * @method
         * @param {express.Request} req The request object.
         * @returns true if the sender of the http request is a logged user.
         */
        public static isLogged(req: ExpressServerRequest): boolean {
            return req.session && req.session.user.isLogged;
        }

        /**
         * Gets the id of the current user.
         *
         * @method
         * @param {express.Request} req The request object.
         * @returns The user id if the sender of the http request is a logged user, otherwise null.
         */
        public static currentUser(req: ExpressServerRequest) {
            if (Session.isLogged(req)) {
                return req.session.user.id;
            } else {
                return null;
            }
        }

        /**
         * Get the csrf token, if present, in the request.
         * Start to check in the request body, then is the request query following by the request header 'x-csrf-token'.
         *
         * @method
         * @param {express.Request} req the request object.
         * @returns the csrf token, if present, in the request.
         */
        public static getCsrfToken(req: ExpressServerRequest): number {
            return (req.body && req.body._csrfToken)
              || (req.query && req.query._csrfToken)
              || (req.header('x-csrf-token'));
        }

        /**
         * Generate a root token that will be use in transactions.
         *
         * @method
         * @returns the generated token.
         */
        public static generateRootToken(): number {
            return Math.floor((1 + Math.random()) * 0x10000);
        }

        /**
         * Compute the next token according to the present one.
         *
         * @method
         * @param the current token.
         * @returns the next token according to the present one.
         */
        public static computeNextToken(token: number): number {
            return (token + (token * 0x100) + 0xB00B) % 0x10000;
        }
    }
}
