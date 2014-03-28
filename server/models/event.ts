/// <reference path="../definitions/references.d.ts"/>
/// <reference path="model-helpers.ts"/>

module Genovesa.Models {
    var mongoose = require('mongoose');

    var eventSchema = new mongoose.Schema({

      annotationGroup: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'AnnotationGroup' },
      participants: [{ person: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Person' }, role: String }],
      type: String
    });

    export var Event = mongoose.model('Event', eventSchema);
}

