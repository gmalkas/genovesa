/// <reference path="../definitions/references.d.ts"/>

module Genovesa.Models {
    var mongoose = require('mongoose');

    /**
     * Represents a Township.
     */
    var townshipSchema = new mongoose.Schema({
        // Postal code of this Township.
        postalCode: { type: Number, required: true, unique: true },

        // Name of this Township.
        name: { type: String, required: true },

        // Department this Township belongs to.
        department: { type: String, required: true }
    });

    // Townships are never updated, versioning is not needed.
    townshipSchema.set('versionKey', false);

    // Export the model.
    export var Township = mongoose.model('Township', townshipSchema);
}
