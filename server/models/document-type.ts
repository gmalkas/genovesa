/// <reference path="../definitions/references.d.ts"/>

module Genovesa.Models {
    var mongoose = require('mongoose');

    // TODO: doc
    var documentTypeSchema = new mongoose.Schema({
        /**
         * Type of document.
         * For example: "birth", "death", ...
         */
        type: { type: String, required: true, unique: true },

        /**
         * Localized name of the document type.
         * For example: "naissance", "décès", ...
         */
        name: { type: String, required: true },
    });

    // DocumentTypes are never updated, versioning is not needed.
    documentTypeSchema.set('versionKey', false);

    export var DocumentType = mongoose.model('DocumentType', documentTypeSchema);
}
