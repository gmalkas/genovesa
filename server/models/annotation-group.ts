/// <reference path="../definitions/references.d.ts"/>
/// <reference path="annotation.ts"/>
/// <reference path="tag.ts"/>

module Genovesa.Models {
    var mongoose = require('mongoose');

    // TODO: doc
    var annotationGroupSchema = new mongoose.Schema({
        /**
         * Reference to the Document on which this AnnotationGroup appears.
         */
        document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },

        /**
         * Number of the page  on which this AnnotationGroup appears.
        */
        pageNumber: { type: Number, required: true },

        /**
         * Reference to the User who created and owns this AnnotationGroup.
         */
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

        /**
         * Coordinates of this AnnotationGroup on the Page.
         */
        position: {
            x: { type: Number, required: true },
            y: { type: Number, required: true }
        },

        /**
         * Area covered by this AnnotationGroup on the Page.
         */
        size: {
            width: { type: Number, required: true },
            height: { type: Number, required: true },
        },

        /**
         * Array of annotations, with a custom validation.
         */
        annotations: { type: [Annotation], validate: { validator: (annotations) => { 
            // Makes sure we only have a max of one annotation per person in this group
            
            // We extract each annotation's ID
            var personIds = annotations.map((annotation) => { return annotation.person });

            // We filter the IDs to keep only unique values
            var uniqueIds = personIds.filter((annotationId, index, self) => { return self.indexOf(annotationId) === index; });

            // We make sure both the original array of annotations and the new filtered one have the same length
            return annotations.length === uniqueIds.length;
        }, msg: 'It is not possible to create multiple annotations for the same person'}},

        /**
         * Tags describing the context of this AnnotationGroup.
         * For example: date, place, type of event (birth, death, ...).
         */
        tags: [Tag]
    });

    export var AnnotationGroup = mongoose.model('AnnotationGroup', annotationGroupSchema);
}
