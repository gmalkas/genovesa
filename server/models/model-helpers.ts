/// <reference path="../definitions/references.d.ts"/>

module Genovesa.Models {
    // TODO: doc
    // Must be checked for nested types.
    export function createSearchQuery(schema, model, data) {
        var query = model.find({});

        for (var attr in data) {
            if (schema.path(attr) && schema.path(attr).options.searchEnable) {
                query.where(attr).equals(data[attr]);
            }
        };

        return query;
    }
}
