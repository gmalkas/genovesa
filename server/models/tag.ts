/// <reference path="../definitions/references.d.ts"/>

module Genovesa.Models {
    var mongoose = require('mongoose');

    /**
     * Represents a simple key-pair value.
     *
     * IMPORTANT NOTE:
     * We export the schema, not the model!
     * We do not need a Tag model, since it's a subdocument of
     * other documents.
     */
    export var Tag = new mongoose.Schema({
        // Describes the type of information carried by this Tag.
        key: { type: String, required: true },

        // Information carried by this Tag.
        value: { type: String, required: true }
    });
}
