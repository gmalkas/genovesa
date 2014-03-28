/// <reference path="definitions/references.d.ts"/>
/// <reference path="api.ts"/>

/// <reference path="models/imodel.ts"/>
/// <reference path="models/annotation.ts"/>
/// <reference path="models/annotation-group.ts"/>
/// <reference path="models/document.ts"/>
/// <reference path="models/document-type.ts"/>
/// <reference path="models/event.ts"/>
/// <reference path="models/page.ts"/>
/// <reference path="models/user.ts"/>
/// <reference path="models/township.ts"/>

module Genovesa {
    export class Repository {
        // TODO make this generic.
        private static typeMappings = {
            'Annotation': {
                type: Models.Annotation,
                url: '/annotations'
            },
            'AnnotationGroup': {
                type: Models.AnnotationGroup,
                url: '/annotation-groups'
            },
            'Document': {
                type: Models.Document,
                url: '/documents'
            },
            'DocumentType': {
                type: Models.DocumentType,
                url: '/document-types'
            },
            'Person': {
                type: Models.Person,
                url: '/persons'
            },
            'Township': {
                type: Models.Township,
                url: '/townships'
            },
            'Event': {
                type: Models.Event,
                url: '/events'
            },
            'User': {
                type: Models.User,
                url: '/users'
            }
        };

        private static cachableTypes = [
            'Document',
            'DocumentType',
            'Township'
        ];

        private static idCache: { [index: string]: Models.IModel; } = {};
        private static allCache: { [index: string]: Models.IModel[]; } = {};

        public static isCachable(typeName: string): boolean {
            return Repository.cachableTypes.indexOf(typeName) >= 0;
        }

        public static fetchSingle(id: string): Models.IModel {
            return Repository.idCache[id];
        }

        public static fetchAll(typeName: string): Models.IModel[] {
            return Repository.allCache[typeName];
        }

        public static storeSingle(typeName: string, model: Models.IModel): void {
            if (Repository.isCachable(typeName)) {
                Repository.idCache[model.id] = model;
            }
        }

        public static storeAll(typeName: string, models: Models.IModel[]): void {
            if (Repository.isCachable(typeName)) {
                Repository.allCache[typeName] = models;
            }
        }

        public static of(typeName: string) {
            var typeMapping = Repository.typeMappings[typeName];

            if (typeMapping === undefined) {
                throw 'Invalid argument typeName: ' + typeName;
            }

            return new RepositoryQuery(typeName, typeMapping.type, typeMapping.url);
        }
    }

    export class RepositoryQuery {
        private typeName: string = null;
        private type: any = null;
        private url: string = null;

        constructor(typeName: string, type: any, url: string) {
            this.typeName = typeName;
            this.type = type;
            this.url = url;
        }

        public id(id: string): JQueryPromise<any> {
            // Promise of a result.
            var promise: JQueryPromise<any> = null;

            // Get object from cache (if it exists).
            var cachedResult = Repository.fetchSingle(id);

            if (cachedResult === undefined) {
                // If the object is not in cache, we have to fetch it from the server.
                // We chain the AJAX promise with the model builder promise.
                // This gives us a promise that will return the fully built object when it completes.
                promise = API.get(this.url + '/' + id, {}).then(raw => {
                    return this.buildModel(raw);
                });
            } else {
                // If the object is in cache, simply create a dummy deferred and resolve
                // it immediately, returning its promise. This will effectively call
                // any subsequently attached handlers right away.
                promise = $.Deferred().resolve(cachedResult).promise();
            }

            return promise;
        }

        public all(): JQueryPromise<any> {
            // Promise of a result.
            var promise: JQueryPromise<any> = null;

            // Get objects from cache (if they exist).
            var cachedResult = Repository.fetchAll(this.typeName);

            if (cachedResult === undefined) {
                promise = this.where({}).then(results => {
                    Repository.storeAll(this.typeName, results);

                    return results;
                });
            } else {
                promise = $.Deferred().resolve(cachedResult).promise();
            }

            return promise;
        }

        public where(query: any): JQueryPromise<any> {
            // First we make a call to the API and get an AJAX promise.
            return API.get(this.url, query).then((results: string[]) => {
                var promises: JQueryPromise<any>[] = [];

                // For each element in the result array returned by the API,
                // we ask the model builder to promise us to convert the raw element into a model.
                // All promises are appended in order to an array.
                results.forEach(result => {
                    promises.push(this.buildModel(result));
                });

                // We return that array of to-be-fulfilled promises.
                return promises;
            }).then((promises: JQueryPromise<any>[]) => {
                // Then, we build a single promise that means:
                // "I promise that, at some point, all the previous promises will be fulfilled".
                return $.when.apply($, promises);
            }).then((...results: any[]) => {
                // When that last "master" promise is complete, it gets passed as arguments all the results
                // of all previous promises. We convert the arguments object to an array and promise to return it.
                return results;
            });
        }

        /**
         * Save an already existing object and all its references.
         *
         * @method
         * @param {Object} model The model you want to save.
         * @return {JQueryPromise}
         */
        public save(model): JQueryPromise<any> {
            // Deferred object.
            var defer = $.Deferred();

            var promises: JQueryPromise<any>[] = [];

            switch (this.typeName) {
                case 'AnnotationGroup':
                    var group = <Models.AnnotationGroup>model;

                    promises.push(API.update(this.url + '/' + group.id, { annotationGroup: group.raw }));

                    break;

            }

            // Wait for all promises to be fulfilled.
            $.when.apply($, promises).then(() => {
                Repository.storeSingle(this.typeName, model);
                defer.resolve(model);
            });

            return defer.promise();
        }

        public create(model?): JQueryPromise<any> {
            switch (this.typeName) {
                case 'AnnotationGroup':
                    var group = <Models.AnnotationGroup>model;

                    return API.post(this.url, { annotationGroup: group.raw }).then(() => {
                        return model;
                    });

                    break;

                case 'Person':
                    return API.post(this.url).then((result) => {
                        return new Models.Person(result);
                    });

                    break;
            }
        }

        public destroy(model): JQueryPromise<any> {
            switch (this.typeName) {
                case 'AnnotationGroup':
                    var group = <Models.AnnotationGroup>model;
                    return API.destroy(this.url  + '/' + group.id);
                    break;
            }
        }

        public buildModel(raw): JQueryPromise<any> {
            // Build the model from raw data.
            var model = new this.type(raw);

            // Deferred object.
            var defer = $.Deferred();

            // Promises that have to be fulfilled for each field of the model.
            var promises: JQueryPromise<any>[] = [];

            // TODO: doc
            switch (this.typeName) {
                //#region AnnotationGroup

                case 'AnnotationGroup':
                    // Alias model as its most specific type for convenience.
                    var group = <Models.AnnotationGroup>model;

                    // Populate document.
                    promises.push(Repository.of('Document').id(group.raw.document).then((document: Models.Document) => {
                        group.document = document;
                    }));

                    // // Populate owner.
                    promises.push(Repository.of('User').id(group.raw.owner).then((owner: Models.User) => {
                        group.owner = owner;
                    }));

                    // Populate annotations.
                    // TODO fix this
                    // group.raw.annotations.forEach((rawAnnotation: { annotation: string; role: string; }) => {
                    //     promises.push(Repository.of('Annotation').id(rawAnnotation.annotation).then((annotation: Models.Annotation) => {
                    //         group.annotations.push({
                    //             annotation: annotation,
                    //             role: rawAnnotation.role
                    //         });
                    //     }));
                    // });

                    break;

                //#endregion

                //#region Annotation

                case 'Annotation':
                    // Alias model as its most specific type for convenience.
                    var annotation = <Models.Annotation>model;

                    // Populate group.
                    promises.push(Repository.of('AnnotationGroup').id(annotation.raw.group).then((group: Models.AnnotationGroup) => {
                        annotation.group = group;
                    }));

                    // Populate person.
                    promises.push(Repository.of('Person').id(annotation.raw.person).then((person: Models.Person) => {
                        annotation.person = person;
                    }));

                    break;

                //#endregion

                //#region Document

                case 'Document':
                    // Alias model as its most specific type for convenience.
                    var document = <Models.Document>model;

                    // Populate township.
                    promises.push(Repository.of('Township').id(document.raw.township).then((township: Models.Township) => {
                        document.township = township;
                    }));

                    // Populate document types.
                    document.raw.documentTypes.forEach((documentType: string) => {
                        promises.push(Repository.of('DocumentType').id(documentType).then((documentType: Models.DocumentType) => {
                            document.documentTypes.push(documentType);
                        }));
                    });
                    break;

                //#endregion

                //#region Person

                case 'Person':
                    // Alias model as its most specific type for convenience.
                    var person = <Models.Person>model;
                    person.attributes = person.raw.attributes;

                    person.attributes.forEach(attr => {
                        attr.references.forEach(ref => {
                            promises.push(Repository.of('AnnotationGroup').id(ref.annotationGroup).then((annotationGroup: Models.AnnotationGroup) => {
                                ref.annotationGroup = annotationGroup;
                            }));
                        });
                    });

                    // Populate events
                    promises.push(Repository.of('Event').where({ person: person.id }).then((events) => {
                        person.events = events;
                    }));

                    break;

                //#endregion


                case 'Event':
                    // Alias model as its most specific type for convenience.
                    var event = <Models.Event>model;

                    // Populate annotation group.
                    promises.push(Repository.of('AnnotationGroup').id(event.raw.annotationGroup).then((annotationGroup: Models.AnnotationGroup) => {
                        event.annotationGroup = annotationGroup;
                    }));

                    break;

            }

            // Wait for all promises to be fulfilled.
            $.when.apply($, promises).then(() => {
                Repository.storeSingle(this.typeName, model);
                defer.resolve(model);
            });

            return defer.promise();
        }
    }
}
