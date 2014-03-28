/// <reference path="../definitions/references.d.ts"/>
/// <reference path="township.ts"/>
/// <reference path="document-type.ts"/>
/// <reference path="page.ts"/>
/// <reference path="../errors/application.ts"/>
/// <reference path="../utils/extensions.ts"/>

module Genovesa.Models {
    var mongoose = require('mongoose');

    /**
     * Represents a Document.
     */
    var documentSchema = new mongoose.Schema({
        // Identifier (in French: "cote") of this Document.
        reference: { type: String, required: true },

        // Reference to the Township this Document concerns.
        township: { type: mongoose.Schema.Types.ObjectId, ref: 'Township', required: true, index: true },

        // First year covered by this Document.
        fromYear: { type: Number, required: true },

        // Last year covered by this Document.
        toYear: { type: Number, required: true },

        // Array of references to DocumentTypes present in this Document.
        documentTypes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DocumentType' }],

        /**
         * Type of collection of this Document.
         * For example: "town" (in French: "commune"), "graft" (in French: "greffe"), ...
         */
        collectionType: { type: String, required: false },

        pages: [Page]
    });

    // Documents are never updated, versioning is not needed.
    documentSchema.set('versionKey', false);

    export var Document = mongoose.model('Document', documentSchema);
}
