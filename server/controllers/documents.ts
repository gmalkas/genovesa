/// <reference path="../definitions/references.d.ts"/>
/// <reference path="base.ts"/>
/// <reference path="../models/document.ts"/>

module Genovesa.Controllers {
    // TODO: doc
    export class Documents {
        public static find(req: ExpressServerRequest, res: ExpressServerResponse, next: Function): void {
            // Start with empty criteria set.
            var query = Models.Document.find({});

            // Filter by reference (if present).
            if (req.query.reference) {
                query.where('reference', Extensions.makeRegExp(req.query.reference));
            }

            // Filter by township (if present).
            if (req.query.townships) {
                query.where('township').in(req.query.townships);
            }

            // If both fromYear and toYear are present, return all documents that fit in the range [fromYear, toYear].
            if (req.query.fromYear && req.query.toYear) {
                query.where('fromYear').gte(req.query.fromYear);
                query.where('toYear').lte(req.query.toYear);
            } else {
                // Otherwise return all documents whose time range contain fromYear (if present).
                if (req.query.fromYear) {
                    query.where('fromYear').lte(req.query.fromYear);
                    query.where('toYear').gte(req.query.fromYear);
                }

                // Do the same thing with toYear (if present).
                if (req.query.toYear) {
                    query.where('fromYear').lte(req.query.toYear);
                    query.where('toYear').gte(req.query.toYear);
                }
            }

            // Filter by document type (if present).
            if (req.query.documentTypes) {
                query.where('documentTypes').in(req.query.documentTypes);
            }

            // Filter by collection type (if present).
            if (req.query.collectionType) {
                query.where('collectionType', Extensions.makeRegExp(req.query.collectionType));
            }

            // Order by first year, ascending.
            query.sort('fromYear');

            // Run the query.
            Base.execFind(query, res, next);
        }

        public static findById(req: ExpressServerRequest, res: ExpressServerResponse, next: Function): void {
            var query = Models.Document.findById(req.params.id);

            // Run the query.
            Base.execFind(query, res, next);
        }
    }
}
