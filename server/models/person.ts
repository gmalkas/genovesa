/// <reference path="../definitions/references.d.ts"/>
/// <reference path="model-helpers.ts"/>

module Genovesa.Models {
    var mongoose = require('mongoose');

    var personSchema = new mongoose.Schema({

        /**
         * Attributes are a compilation of every annotation made about a specific person.
         * Since the same attribute (defined by its key) can have several values
         * (a name can have different spellings for example), we attach to each key
         * a list of its values and an ID to the annotation group containing this value.
         */
        attributes: [{ key: { type: String, required: true }, references: [ { value: { type: String, required: true }, annotationGroup: {type: mongoose.Schema.Types.ObjectId, required: true } } ]}],

        /**
         * The user's ID that owns this person.
         */
        owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
    });

    export var Person = mongoose.model('Person', personSchema, 'persons');
}
