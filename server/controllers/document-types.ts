/// <reference path="../definitions/references.d.ts"/>
/// <reference path="base.ts"/>
/// <reference path="../models/document-type.ts"/>

module Genovesa.Controllers {
    // TODO: doc
    export class DocumentTypes {
        public static find(req: ExpressServerRequest, res: ExpressServerResponse, next: Function): void {
            var query = Models.DocumentType.find({});

            // Filter by type (if present).
            if (req.params.type) {
                query.where('type', Extensions.makeRegExp(req.params.type));
            }

            // Filter by name (if present).
            if (req.params.name) {
                query.where('name', Extensions.makeRegExp(req.params.name));
            }

            // Run the query.
            Base.execFind(query, res, next);
        }

        public static findById(req: ExpressServerRequest, res: ExpressServerResponse, next: Function): void {
            var query = Models.DocumentType.findById(req.params.id);

            // Run the query.
            Base.execFind(query, res, next);
        }
    }
}
