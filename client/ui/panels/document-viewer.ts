/// <reference path="../../definitions/references.d.ts"/>
/// <reference path="ipanel.ts"/>
/// <reference path="../../session.ts"/>
/// <reference path="../../repository.ts"/>
/// <reference path="../../geometry/rectangle.ts"/>
/// <reference path="../../models/document.ts"/>
/// <reference path="../../models/annotation-group.ts"/>
/// <reference path="../../models/page.ts"/>
/// <reference path="../document-viewer/visualizer.ts"/>
/// <reference path="../document-viewer/annotation-viewer/annotation-viewer.ts"/>
/// <reference path="../document-viewer/toolbar.ts"/>

/// <reference path="../../repository.ts"/>

module Genovesa.UI.Panels {
    /**
     * The Document Viewer displays a document and provides
     * tools to annotate pages, zoom in/out, etc.
     *
     * @constructor
     * @param {Genovesa.Models.Document} doc
     */
    export class DocumentViewerPanel implements IPanel {
        private _view = TemplateFactory.create('panels/document-viewer');
        private _toolbar = new DocumentViewer.Toolbar();

        private document: Models.Document = null;
        private visualizer = new DocumentViewer.Visualizer();
        private annotationViewer: DocumentViewer.AnnotationViewer.AnnotationViewer2 = null;

        private _pageNumber: number = 0;

        constructor(document: Models.Document, pageNumber: number = 0, annotationGroup?: Models.AnnotationGroup) {
            this.document = document;

            // Displays tabs to see existing annotations and create new ones
            this.annotationViewer = new DocumentViewer.AnnotationViewer.AnnotationViewer2(document);

            // Call setter
            this.pageNumber = pageNumber;

            if (annotationGroup) {
                this.openAnnotationGroup(annotationGroup);
            }

            this.registerEventHandlers();

            // Displays the document
            this._view.append(this.visualizer.view);
            this._view.append(this.annotationViewer.view);
            
        }

        //#region IPanel members.

        public hasOpenedDocument(documentId): boolean {
            return this.document.id == documentId;
        }

        public get view(): JQuery {
            return this._view;
        }

        public get toolbar(): JQuery {
            return this._toolbar.view;
        }

        public attached(): void {
            this.visualizer.resize(this.visualizer.view.width(), this.visualizer.view.height());
        }

        //#endregion

        public openAnnotationGroup(annotationGroup: Models.AnnotationGroup) {
            this.pageNumber = annotationGroup.pageNumber;
            this.annotationViewer.openAnnotationGroup(annotationGroup);
        }

        public openPage(pageNumber: number) {
            this.pageNumber = pageNumber;
        }

        private get pageNumber(): number {
            return this._pageNumber;
        }

        private set pageNumber(value: number) {
            if (value < 0) {
                value = 0;
            }

            if (value >= this.document.pages.length) {
                value = this.document.pages.length - 1;
            }

            this._pageNumber = value;
            this.displayPage(this.currentPage);
        }

        private get currentPage(): Models.Page {
            return this.document.pages[this._pageNumber];
        }

        /**
         * Add some event handlers for the toolbar and annotation board.
         */
        private registerEventHandlers(): void {
            // When the users has selected a new area to create a
            // new annotation group, we diplay a new tab with a form
            // !TODO Find the type of rectangle.
            this.visualizer.bind('annotation-group-area-selected', (rectangle: Geometry.Rectangle) => {
                this.annotationViewer.goToNewAnnotationGroup();
            });

            this.annotationViewer.bind('show-annotation-group', group => {
                // this.visualizer.drawAnnotation(new Geometry.Rectangle(group.position, group.size));
            });

            this.annotationViewer.bind('clear-annotation-group', () => {
                this.visualizer.clearAnnotation();
            });

            this.annotationViewer.bind('submit-annotation-group', (details: any) => {
                if (this.currentPage === null) {
                    throw new Error('Aucune page disponible');
                }

                var rect = this.visualizer.getRectangle();

                var group = new Models.AnnotationGroup({
                    owner: Session.currentUser.id,
                    document: this.document.id,
                    pageNumber: this.pageNumber,
                    position: {
                        x: rect.x,
                        y: rect.y,
                    },
                    size: {
                        width: rect.width,
                        height: rect.height,
                    },
                    annotations: details.annotations,
                    tags: details.tags
                });

                
                var promises: JQueryPromise<any>[] = [];

                group.raw.annotations.forEach(annotation => {
                    if (annotation.person === 'new') {
                        promises.push(Repository.of('Person').create().then(person => {
                              annotation.person = person.id;
                        }));
                    }
                });


                // Wait for all promises to be fulfilled.
                $.when.apply($, promises).then(() => {
                    var process = () => {
                        this.annotationViewer.closeNewAnnotationGroup();
                        this.annotationViewer.openPage(this.currentPage);
                        this.visualizer.clearSelection();
                    }

                    if (details._id) {
                        // If the group already has an ID, we need to update it
                        Repository.of('AnnotationGroup').save(group).then(process);
                    } else {
                        // There is no ID, we need to create a new one
                        Repository.of('AnnotationGroup').create(group).then(process);
                    }
                });
            });

            // TODO doc

            // If the user cancels the annotation group creation,
            // we need to clear the current selection.
            var annotationViewerEvents = {
                'cancel-annotation-group-creation': this.visualizer.clearSelection.bind(this.visualizer),
                'start-annotation-group-creation': this.visualizer.selectTool.bind(this.visualizer, 'annotation')
            }

            for (var e in annotationViewerEvents) {
                this.annotationViewer.bind(e, annotationViewerEvents[e]);
            }

            var selfEvents = {
                'go-first': this.first,
                'go-last': this.last,
                'go-previous': this.previous,
                'go-next': this.next,
            };

            for (var e in selfEvents) {
                this._toolbar.bind(e, selfEvents[e].bind(this));
            }

            var visualizerEvents = {
                'rotate-left': this.visualizer.rotate.bind(this.visualizer, -90),
                'rotate-right': this.visualizer.rotate.bind(this.visualizer, 90),
                'choose-zoom': this.visualizer.selectTool.bind(this.visualizer, 'zoom'),
                'choose-move': this.visualizer.selectTool.bind(this.visualizer, 'move'),
                'adjust': this.visualizer.adjust.bind(this.visualizer)
            };

            for (var e in visualizerEvents) {
                this._toolbar.bind(e, visualizerEvents[e]);
            }
        }

        /**
         * Displays a given page in the visualizer.
         *
         * @param {Genovesa.Models.Page}
         */
        private displayPage(page: Models.Page): void {
            var updateVisualizer = (image: any) => {
                this.visualizer.changeImage(image);
            };
            
            //page.lowResolutionImage.then(updateVisualizer);
            page.highResolutionImage.then(updateVisualizer);
            this.annotationViewer.openPage(page);
        }

        /**
         * Displays the first page of the document.
         */
        private first(): void {
            this.pageNumber = 0;
        }

        /**
         * Displays the last page of the document.
         */
        private last(): void {
            this.pageNumber = this.document.pages.length - 1;
        }

        /**
         * Displays the next page of the document if one is available.
         */
        private next(): void {
            this.pageNumber++;
        }

        /**
         * Displays the previous page of the document if available.
         */
        private previous(): void {
            this.pageNumber--;
        }
    }
}
