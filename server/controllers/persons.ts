/// <reference path="../definitions/references.d.ts"/>
/// <reference path="base.ts"/>
/// <reference path="../utils/session.ts"/>
/// <reference path="../models/person.ts"/>

module Genovesa.Controllers {
    // TODO: doc
    export class Persons {
        public static find(req: ExpressServerRequest, res: ExpressServerResponse, next: Function): void {
            // Start with empty criteria set.
            var query = Models.Person.find({});

            if (req.query.attributes) {
                var queries = [];
                req.query.attributes.forEach(attribute => {
                    queries.push({ 'attributes': { $elemMatch: { key: attribute.key, 'references.value': attribute.value }} });
                });

                query.and(queries);
            }

            if (req.query.owner) {
                query.where('owner', req.query.owner);
            }

            // Run the query.
            Base.execFind(query, res, next);
        }

        public static findById(req: ExpressServerRequest, res: ExpressServerResponse, next: Function): void {
            var query = Models.Person.findById(req.params.id);

            // Run the query.
            Base.execFind(query, res, next);
        }

        public static create(req: ExpressServerRequest, res: ExpressServerResponse, next: Function): void {
            if (!Utils.Session.isLogged(req)) {
                res.send(401);
                return;
            }

            Base.execSave(new Models.Person({ owner: Utils.Session.currentUser(req) }), res, next);
        }
    }
}
