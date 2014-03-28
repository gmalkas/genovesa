/// <reference path="../definitions/references.d.ts"/>
/// <reference path="base.ts"/>
/// <reference path="../utils/session.ts"/>
/// <reference path="../models/annotation-group.ts"/>
/// <reference path="../models/person.ts"/>
/// <reference path="../models/event.ts"/>

module Genovesa.Controllers {
    export class AnnotationGroups {
        public static find(req: ExpressServerRequest, res: ExpressServerResponse, next: Function): void {
            var query = Models.AnnotationGroup.find({});

            if (req.query.document) {
                query.where('document', req.query.document);
            }

            if (req.query.pageNumber) {
                query.where('pageNumber', req.query.pageNumber);
            }

            query.sort('owner');

            Base.execFind(query, res, next);
        }

        public static findById(req: ExpressServerRequest, res: ExpressServerResponse, next: Function): void {
            var query = Models.AnnotationGroup.findById(req.params.id);

            Base.execFind(query, res, next);
        }

        public static create(req: ExpressServerRequest, res: ExpressServerResponse, next: Function): void {
            if (!Utils.Session.isLogged(req)) {
                res.send(401);
                return;
            }

            if (!req.body.annotationGroup) {
                res.send(400);
                return;
            }

            var annotationGroup = new Models.AnnotationGroup(req.body.annotationGroup);
            annotationGroup.owner = Utils.Session.currentUser(req);

            annotationGroup.save((err, result) => {
                if (err) {
                    next(err);
                    return;
                }

                // HACK
                // we do slice(0) otherwise result.annotations is empty after this
                AnnotationGroups.addAttributes(result, result.annotations.slice(0), () => {
                    AnnotationGroups.buildEvent(result._id, result, err => {
                        if (err) {
                            next(err);
                            return;
                        }

                        res.json(200);
                    });
                });
            });
        }

        public static update(req: ExpressServerRequest, res: ExpressServerResponse, next: Function): void {
            if (!req.params.id || !req.body.annotationGroup) {
                res.send(400);
                return;
            }

            Models.AnnotationGroup.findById(req.params.id).exec((err, annotationGroup) => {
                if (!annotationGroup || err) {
                    next(err);
                    return;
                }

                if (annotationGroup.owner != Utils.Session.currentUser(req)) {
                    res.send(403);
                    return;
                }

                // Merge original annotations and new annotations, then mark each annotation
                // to differentiate between removed, new and updated annotations.
                // Returns an array of { annotation: Models.Annotation, mark: String }
                var markAnnotations = (originalAnnotations, newAnnotations) => {
                    return originalAnnotations.concat(newAnnotations).map((annotation) => {
                        // We consider the annotation is a new one
                        var mark = 'new';

                        if (annotation._id) {
                            // If it has an id though, it is either updated or removed
                            // as it already was in the collection
                            if (newAnnotations.map((a) => { return a._id; }).indexOf(annotation._id) == -1) {
                                // If the annotation is not in the new array, it has been removed
                                mark = 'removed';
                            } else {
                                // Otherwise, it has been updated
                                mark = 'updated';
                            }
                        }
                            
                        return { annotation: annotation, mark: mark };
                    });
                };

                var annotations = markAnnotations(annotationGroup.annotations, req.body.annotationGroup.annotations);

                // We update the annotation group
                Models.AnnotationGroup.update({ _id: annotationGroup._id }, req.body.annotationGroup, (err) => {
                    if (err) {
                        next(err);
                        return;
                    }

                    var filterByMark = (mark) => {
                        return (element) => { return element.mark == mark; };
                    };

                    // We update the corresponding persons' attributes
                    // First, we add attributes for the new annotations
                    AnnotationGroups.addAttributes(annotationGroup, annotations.filter(filterByMark('new')).map((a) => { return a.annotation; }), (err) => {
                        if (err) {
                            next(err);
                            return;
                        }

                        // Then we remove attributes from the deleted annotations
                        AnnotationGroups.removeAttributes(annotationGroup, annotations.filter(filterByMark('removed')).map((a) => { return a.annotation; }), (err) => {
                            if (err) {
                                next(err);
                                return;
                            }

                            // Finally, we remove attributes that might have been changed by updates
                            // and we add new ones from the updated annotations.
                            // Since we really don't care about attributes' ID, this is not a problem
                            // and is much simpler that trying to update specific attributes in
                            // order to keep their IDs.
                            var updatedAnnotations = annotations.filter(filterByMark('updated')).map((a) => { return a.annotation; });

                            var originalAnnotations = updatedAnnotations.filter((element) => {
                                return annotationGroup.annotations.indexOf(element) > -1;
                            });

                            var newAnnotations = updatedAnnotations.filter((element) => {
                                return req.body.annotationGroup.annotations.indexOf(element) > -1;
                            });

                            AnnotationGroups.removeAttributes(annotationGroup, originalAnnotations, (err) => {
                                if (err) {
                                    next(err);
                                    return;
                                }

                                AnnotationGroups.addAttributes(annotationGroup, newAnnotations, (err) => {
                                    if (err) {
                                        next(err);
                                        return;
                                    }

                                    AnnotationGroups.buildEvent(annotationGroup._id, req.body.annotationGroup, err => {
                                        if (err) {
                                            next(err);
                                            return;
                                        }

                                        res.json(200);
                                      });
                                });
                            });
                        });
                    });

                    res.json(200);
                });

            });
        }

        public static remove(req: ExpressServerRequest, res: ExpressServerResponse, next: Function): void {
            if (!req.params.id) {
                res.send(400);
                return;
            }

            Models.AnnotationGroup.findById(req.params.id).exec((err, annotationGroup) => {
                if (!annotationGroup || err) {
                    next(err);
                    return;
                }

                if (annotationGroup.owner != Utils.Session.currentUser(req)) {
                    res.send(403);
                    return;
                }

                Models.AnnotationGroup.remove({ _id: req.params.id }, (err) => {
                    if (err) {
                        next(err);
                        return;
                    }
                    console.log('coucou');

                    AnnotationGroups.removeAttributes(annotationGroup, annotationGroup.annotations.slice(0), () => {
                        console.log(annotationGroup);
                        AnnotationGroups.removeEvents(annotationGroup._id, err => {
                            if (err) {
                                next(err);
                                return;
                            }

                            res.json(200);
                        });
                    });

                });

           });

        }

        /**
         * CPS-style function that ensures that after a modification to an annotation group, related
         * persons' attributes are created.
         *
         * FIXME Should make sure updated persons belong to the current user
         *
         */
        private static addAttributes(annotationGroup, annotations: any[], callback: Function): void {
            if (annotations.length == 0) {
                // There is no annotation left, we're done
                callback();
                return;
            }

            // For the next annotation
            var annotation = annotations.shift();

            Models.Person.findById(annotation.person).exec((err, person) => {
                if (!person || err) {
                    callback(err);
                    return;
                }

                // Pushes every tag of a given annotation to the corresponding person's attributes
                var pushTag = (tags) => {
                    if (!tags || tags.length == 0) {
                        AnnotationGroups.addAttributes(annotationGroup, annotations, callback);
                        return;
                    }

                    var tag = tags.shift();

                    if (person.attributes.map((attribute) => { return attribute.key; }).indexOf(tag.key) > -1) {
                        // If the person already has some value for this tag, we push the new value
                        Models.Person.update({ _id: person._id, 'attributes.key': tag.key }, { $push: { 'attributes.$.references': { value: tag.value, annotationGroup: annotationGroup._id } } }, (err) => {
                            if (err) {
                                callback(err);
                                return;
                            }

                            pushTag(tags);
                        });
                    } else {
                         // Otherwise, we add a new entry for the key with the given value and annotation group
                        Models.Person.update({ _id: person._id }, { $push: { attributes: { key: tag.key, references: [{ value: tag.value, annotationGroup: annotationGroup._id }] } } }, (err) => {
                            if (err) {
                                callback(err);
                                return;
                            }

                            pushTag(tags);
                        });
                    }
                };

                pushTag(annotation.tags);
            }); 
        }

        /**
         * Removes related attributes to the given annotations.
         *
         * FIXME Should remove items from 'attributes' if the corresponding references array is empty after deleting annotations.
         *
         */
        private static removeAttributes(annotationGroup, annotations: any[], callback: Function): void {
            if (annotations.length == 0) {
                callback();
                return;
            }

            var annotation = annotations.shift();

            var removeValue = (tags) => {
                if (!tags || tags.length == 0) {
                    AnnotationGroups.removeAttributes(annotationGroup, annotations, callback);
                    return;
                }

                var tag = tags.shift();

                Models.Person.update({ _id: annotation.person, 'attributes.key': tag.key }, { $pull: { 'attributes.$.references': { annotationGroup: annotationGroup._id } } }, (err, nb, raw) => {
                    if (err) {
                        callback(err);
                        return;
                    }

                    removeValue(tags);
                });
            };

            removeValue(annotation.tags);

        }

        private static buildEvent(id, newAnnotationGroup, callback): void {
            if (newAnnotationGroup.tags && newAnnotationGroup.tags.indexOf('type') < 0) {
                callback();
            }

            Models.Event.remove({ annotationGroup: id }, err => {
                if (err) {
                    callback(err);
                    return;
                }

                var event = {
                  annotationGroup: id,
                  type: newAnnotationGroup.tags['type'],
                  participants: newAnnotationGroup.annotations.map(annotation => {
                      return {
                          person: annotation.person,
                          role: annotation.role
                      };
                  })
                };

                new Models.Event(event).save(callback);
            });
        }
        
        private static removeEvents(annotationGroup, callback): void {
            Models.Event.remove({ annotationGroup: annotationGroup._id }, err => {
                callback(err);
            });
        }
    }
}
