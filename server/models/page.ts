/// <reference path="../definitions/references.d.ts"/>

module Genovesa.Models {
    var mongoose = require('mongoose');

    // TODO: doc
    export var Page = new mongoose.Schema({
        // Position of this Page in the Document.
        number: { type: Number, min: 0 },

        // Path to the image of this Page on storage media.
        imagePath: { type: String, required: true },
    });
}
