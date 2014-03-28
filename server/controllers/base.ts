/// <reference path='../definitions/references.d.ts'/>
/// <reference path="../utils/extensions.ts"/>

module Genovesa.Controllers {
    /**
     * Provides basic error handling methods for controllers.
     *
     * @class
     */
    export class Base {
        public static execFind(query, res: ExpressServerResponse, next: Function): void {
            // Run the query.
            query.exec((err, result) => {
                if (err) {
                    next(err);
                    return;
                }

                // If no result was found, 404.
                if (!result) {
                    res.send(404);
                    return;
                }

                res.send(200, result);
            });
        }

        public static execSave(model: any, res: ExpressServerResponse, next: Function): void {
            model.save((err, result) => {
                if (err) {
                    next(err);
                    return;
                }

                console.log(result);
                res.send(200, result);
            });
        }

        /**
         * TODO: doc
         */
        public static parseError(err) {
            if (err.name) {
                switch (err.name) {
                    case 'ValidationError':
                        return Base._parseMongooseError(err);
                    case 'MongoError':
                        return Base._parseMongoError(err);
                    case 'ApplicationError':
                        return Base._parseApplicationError(err);
                    default: break;
                };
            }

            return { code: 500, err: err };
        }

        /**
         * TODO: doc
         */
        private static _parseMongooseError(err) {
            var errors = {};

            Object.keys(err.errors).forEach(function (key) {
                errors[key] = {};
                errors[key].type = err.errors[key].type;

                switch (err.errors[key].type) {
                    case 'required':
                        errors[key].message = 'Ce champ est requis.';
                        break;
                    case 'confirmation':
                        errors[key].message = 'La confirmation ne correspond pas.';
                        break;
                    default:
                        break;
                }
            });

            return { code: 200, errors: errors };
        }

        /**
         * Parse MongoDB errors. This version only
         * parse duplicate key errors.
         *
         * @param [Error] err
         * @author Gabriel Malkas
         */
        private static _parseMongoError(err) {
            if (err.code == 11000) {
                var params = /\$(\w*)_/.exec(err.err);
                var error = {};
                error[params[1]] = {
                    message: 'Already-in-use',
                    type: 'unique'
                };

                return { code: 200, errors: error };
            }

            return { code: 500 };
        }

        /**
         * TODO: doc
         */
        private static _parseApplicationError(err) {
            var error: { type?: string; message?: string; } = {};
            error.type = err.type;

            switch (err.type) {
                case 'wrongPassword':
                    error.message = 'Mot de passe incorrect.';
                    break;
                case 'unknownUser':
                    error.message = 'Utilisateur inexistant.';
                    break;
                case 'unknownTownship':
                    error.message = 'Commune inexistante.';
                    break;
                case 'unvalidatedAccount':
                    error.message = 'Votre compte utilisateur n\'est pas encore valide.';
                    break;
                default:
                    break;
            };

            return { code: 200, errors: { application: error } };
        }
    }
}
