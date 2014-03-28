/// <reference path="definitions/references.d.ts"/>

/// <reference path="ui/panels/ipanel.ts"/>
/// <reference path="ui/panels/document-list.ts"/>
/// <reference path="ui/panels/document-type-list.ts"/>
/// <reference path="ui/panels/document-search.ts"/>
/// <reference path="ui/panels/home.ts"/>
/// <reference path="ui/panels/township-list.ts"/>
/// <reference path="ui/panels/document-viewer.ts"/>
/// <reference path="ui/panels/person-search.ts"/>
/// <reference path="ui/panels/person-list.ts"/>
/// <reference path="ui/panels/timeline.ts"/>
/// <reference path="repository.ts"/>

module Genovesa {
    /**
     * Handles the construction of panels.
     *
     * @class
     */
    export class PanelBuilder {
        private static typeMappings = {
            'DocumentSearch': UI.Panels.DocumentSearchPanel,
            'DocumentList': UI.Panels.DocumentListPanel,
            'DocumentTypeList': UI.Panels.DocumentTypeListPanel,
            'DocumentViewer': UI.Panels.DocumentViewerPanel,
            'Home': UI.Panels.HomePanel,
            'TownshipList': UI.Panels.TownshipListPanel,
            'PersonSearch': UI.Panels.PersonSearchPanel,
            'PersonList': UI.Panels.PersonListPanel,
            'Timeline': UI.Panels.TimelinePanel
        };

        private typeName: any = null;
        private constructorArgs: any[] = [];
        private populateArgs: any = null;

        public static of(type: string): PanelBuilder {
            if (PanelBuilder.typeMappings[type] === undefined) {
                throw new Error('Unknown type ' + type);
            }

            return new PanelBuilder(type);
        }

        constructor(typeName: string) {
            this.typeName = typeName;
        }

        public args(...args: any[]): PanelBuilder {
            this.constructorArgs = args;

            return this;
        }

        public populate(params: any): PanelBuilder {
            this.populateArgs = params;

            return this;
        }

        public build(callback: (panel: UI.Panels.IPanel) => any): void {
            switch (this.typeName) {
                case 'DocumentSearch':
                    // Loads document types and townships, then construct the panel
                    $.when(
                        Repository.of('DocumentType').all(),
                        Repository.of('Township').all()
                        ).then((documentTypes: Models.DocumentType[], townships: Models.Township[]) => {
                            callback(this.instantiate(documentTypes, townships));
                        });

                    break;


                case 'DocumentList':
                    // Populate the panel.
                    Repository.of('Document').where(this.populateArgs).then((documents: Models.Document[]) => {
                        callback(this.instantiate(documents));
                    });
                    break;


                case 'DocumentTypeList':
                    // Populate the panel.
                    Repository.of('DocumentType').all().then((documentTypes: Models.DocumentType[]) => {
                        callback(this.instantiate(documentTypes));
                    });
                    break;

                case 'DocumentViewer':
                    // Populate the panel.
                    Repository.of('Document').id(this.populateArgs.documentId).then((document: Models.Document) => {
                        if (this.populateArgs.annotationGroupId) {
                            Repository.of('AnnotationGroup').id(this.populateArgs.annotationGroupId).then((annotationGroup: Models.AnnotationGroup) => {
                                callback(this.instantiate(document, this.populateArgs.pageNumber, annotationGroup));
                            });
                        } else {
                            callback(this.instantiate(document, this.populateArgs.pageNumber));
                        }
                    });
                    break;


                case 'TownshipList':
                    // Populate the panel.
                    Repository.of('Township').all().then((townships: Models.Township[]) => {
                        callback(this.instantiate(townships));
                    });
                    break;


                case 'PersonList':
                    // Populate the panel.
                    Repository.of('Person').where(this.populateArgs).then((persons: Models.Person[]) => {
                        callback(this.instantiate(persons));
                    });
                    break;

                default:
                    callback(this.instantiate());
                    break;
            }
        }

        private instantiate(...additionalArgs: any[]): UI.Panels.IPanel {
            // Fetch the appropriate constructor.
            var constructor = PanelBuilder.typeMappings[this.typeName];

            // Bind the constructor to a null context (that will anyway be reset through new)
            // and the arguments that were supplied previously during the build phase.
            // Append any additional arguments created during the populate phase,
            // then call the bound constructor.
            var args = [null].concat(this.constructorArgs).concat(additionalArgs);

            return new (constructor.bind.apply(constructor, args));
        }
    }
}
