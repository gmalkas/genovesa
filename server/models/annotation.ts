/// <reference path="../definitions/references.d.ts"/>
/// <reference path="tag.ts"/>

module Genovesa.Models {
    var mongoose = require('mongoose');

    // TODO: doc
    /*
     * IMPORTANT NOTE:
     * We export the schema, not the model!
     * We do not need an Annotation model, since it's a subdocument of
     * AnnotationGroup.
     */
    export var Annotation = new mongoose.Schema({
        /**
         * Role associated with the annotation (for example: concerned, father, mother, ...).
         */
        role: { type: String },

        /**
         * Reference to the Person described by this Annotation.
         */
        person: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true },

        /**
         * Tags composing this Annotation.
         */
        tags: [Tag]
    });
}
