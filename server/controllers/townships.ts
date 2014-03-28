/// <reference path="../definitions/references.d.ts"/>
/// <reference path="base.ts"/>
/// <reference path="../models/township.ts"/>

module Genovesa.Controllers {
    /**
     * Controller for Township API queries.
     *
     * @class
     */
    export class Townships {
        /**
         * Returns Townships matching a set of criteria.
         * If no criterion is passed, all Townships in the database are returned.
         * Available criteria:
         *   - postalCode: integer
         *   - name: string
         *   - department: string
         *
         * @method
         * @param {express.Request} req The request object.
         * @param {express.Response} res The response object.
         * @param {function} next The next middleware.
         */
        public static find(req: ExpressServerRequest, res: ExpressServerResponse, next: Function): void {
            // Start with empty criteria set.
            var query = Models.Township.find({});

            // Filter by postalCode (if present).
            if (req.query.postalCode) {
                query.where('postalCode', req.query.postalCode);
            }

            // Filter by name (if present).
            // This is not an exact filter: it's a regular expression that checks
            // if Township.name *contains* query.name, similar to the SQL LIKE statement.
            if (req.query.name) {
                query.where('name', Extensions.makeRegExp(req.query.name));
            }

            // Filter by department (if present).
            // This is not an exact filter: it's a regular expression that checks
            // if Township.department *contains* query.department, similar to the SQL LIKE statement.
            if (req.query.department) {
                query.where('department', Extensions.makeRegExp(req.query.department));
            }

            // Run the query.
            Base.execFind(query, res, next);
        }

        /**
         * Returns the township whose ID is passed in the query parameters.
         *
         * @method
         * @param {express.Request} req The request object.
         * @param {express.Response} res The response object.
         * @param {function} next The next middleware.
         */
        public static findById(req: ExpressServerRequest, res: ExpressServerResponse, next: Function): void {
            var query = Models.Township.findById(req.params.id);

            // Run the query.
            Base.execFind(query, res, next);
        }
    }
}
