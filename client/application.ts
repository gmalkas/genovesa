/// <reference path="definitions/references.d.ts"/>

/// <reference path="path.ts"/>

/// <reference path="template-factory.ts"/>
/// <reference path="panel-builder.ts"/>

/// <reference path="ui/breadcrumbs.ts"/>
/// <reference path="ui/panel-host.ts"/>
/// <reference path="ui/form-host.ts"/>
/// <reference path="ui/user-menu.ts"/>
/// <reference path="ui/bookmarks-menu.ts"/>
/// <reference path="ui/persons-menu.ts"/>

/// <reference path="session.ts"/>

module Genovesa {
    /**
     * This is the main client-side program.
     *
     * @class
     */
    export class Application {
        /** @var {JQuery} Root view of the application. */
        private view = TemplateFactory.create('application');

        /** @var {UI.Breadcrumbs} Breadcrumbs component. */
        private breadcrumbs = new UI.Breadcrumbs();

        /** @var {UI.PanelHost} Component that handles forms. */
        private formHost = new UI.FormHost();

        /** @var {UI.UserMenu} UserMenu component. */
        private userMenu: UI.UserMenu = null;

        /** @var {UI.PanelHost} Component that handles panels. */
        private panelHost = new UI.PanelHost();

        /** @var {UI.BookmarksMenu} Component that displays user's bookmarks. */
        private bookmarksMenu = new UI.BookmarksMenu();

        /** @var {UI.PersonsMenu} Component that displays a menu item to the user's persons. */
        private personsMenu = new UI.PersonsMenu();

        /** @var {JQuery} Notification shown during AJAX requests. */
        private ajaxNotification = TemplateFactory.create('notification', { content: 'Chargement...', loader: true });

        /** @var {string} Current client URL of the application. */
        private currentUrl: string = null;

        /**
         * Initializes a new instance of the Application class.
         *
         * @constructor
         */
        constructor() {
            // TODO: clean this!
            /*window.onerror = errorMessage => {
                this.ajaxNotification.fadeOut(150);

                var errorNotification = TemplateFactory.create('notification', { content: 'Une erreur est survenue. Veuillez réessayer.' });
                errorNotification.hide();

                this.view.append(errorNotification);
                errorNotification.fadeIn(150);

                setTimeout(() => {
                    errorNotification.fadeOut(150).promise().then(() => {
                        errorNotification.detach();
                    });
                }, 5000);

                return false;
            };*/

            // Preload cache.
            this.preloadCache();

            // Initialize subcomponents.
            this.initializeComponents();

            // Initialize client routes.
            this.initializeRoutes();

            // Load current session.
            Session.load(() => { });

            // Clear the body and replace its contents with our root view.
            $('body').empty().append(this.view);
        }

        /**
         * Runs some common API queries to fill up the Repository with frequently requested data.
         *
         * @method
         */
        private preloadCache(): void {
            // Preload document types.
            Repository.of('DocumentType').all();

            // Preload townships.
            Repository.of('Township').all();
        }

        /**
         * Initializes the subcomponents of the view.
         *
         * @method
         */
        private initializeComponents(): void {
            this.initializeAjaxNotification();
            this.initializeBreadcrumbs();
            this.initializePanelHost();
            this.initializeUserMenu();
            this.initializeFormHost();
            this.initializeBookmarksMenu();
            this.initializePersonsMenu();
        }

        /**
         * Initializes the ajax notification.
         *
         * @method
         */
        private initializeAjaxNotification(): void {
            // Attach event handlers.
            // We want to show a notification when an AJAX request starts
            // and hide it when all AJAX requests have stopped.
            $(document).ajaxStart(() => {
                this.ajaxNotification.fadeIn(150);
            }).ajaxStop(() => {
                this.ajaxNotification.fadeOut(150);
            });

            // Insert notification (initially hidden).
            this.ajaxNotification.hide();
            this.view.append(this.ajaxNotification);
        }

        /**
         * Initializes the breadcrumbs.
         *
         * @method
         */
        private initializeBreadcrumbs(): void {
            // Store some common breadcrumbs in the breadcrumbs cache for later reuse.
            this.breadcrumbs.cache('Home', new UI.Crumb('Accueil', 'application-home', '#!/home'));
            this.breadcrumbs.cache('DocumentSearch', new UI.Crumb('Recherche de documents', 'magnifier', '#!/documents/by/query'));
            this.breadcrumbs.cache('DocumentTypeList', new UI.Crumb('Types de documents', 'book', '#!/documents/by/type'));
            this.breadcrumbs.cache('PersonSearch', new UI.Crumb('Individus', 'user-silhouette', '#!/persons/by/query'));
            this.breadcrumbs.cache('TownshipList', new UI.Crumb('Communes', 'home', '#!/documents/by/township'));

            // Replace breadcrumbs placeholder in view with the actual breadcrumbs.
            this.view.find('#breadcrumbs').replaceWith(this.breadcrumbs.view);
        }

        /**
         * Initializes the panel host component.
         *
         * @method
         */
        private initializePanelHost(): void {
            // Replace panel host placeholder in view with the actual panel host.
            this.view.find('#panel-host').replaceWith(this.panelHost.view);
        }

        /**
         * Initializes the user-menu component.
         *
         * @method
         */
        private initializeUserMenu(): void {
            // Replace user menu placeholder in view with the actual user menu.
            this.userMenu = new UI.UserMenu(this.formHost);
            this.view.find('#user-menu').replaceWith(this.userMenu.view);
        }

        /**
         * Initializes the form host component.
         *
         * @method
         */
        private initializeFormHost(): void {
            // Replace form host placeholder in view with the actual form host.
            this.view.find('#form-host').replaceWith(this.formHost.view);
        }

        /**
         * Initializes the bookmarks menu component.
         *
         * @method
         */
        private initializeBookmarksMenu(): void {
            // Replace form host placeholder in view with the actual form host.
            this.view.find('#bookmarks-menu').replaceWith(this.bookmarksMenu.view);
        }

        /**
         * Initializes the persons menu component.
         *
         * @method
         */
        private initializePersonsMenu(): void {
            this.view.find('#persons-menu').replaceWith(this.personsMenu.view);
        }

        /**
         * Initializes the application's routes.
         *
         * @method
         */
        private initializeRoutes() {
            // Root URL.
            Path.root('#!/home');

            // Document search.
            Path.map('#!/documents/by/query(/:query)(/:documentId)(/:pageNumber)(/:annotationGroupId)').to(params => {
                this.routeOfDocumentSearch(params.query, params.documentId, params.pageNumber, params.annotationGroupId);
            });

            // Document types.
            Path.map('#!/documents/by/type(/:documentTypeId)(/:documentId)(/:pageNumber)(/:annotationGroupId)').to(params => {
                this.routeOfDocumentsByType(params.documentTypeId, params.documentId, params.pageNumber, params.annotationGroupId);
            });

            // Townships
            Path.map('#!/documents/by/township(/:townshipId)(/:documentId)(/:pageNumber)(/:annotationGroupId)').to(params => {
                this.routeOfDocumentsByTownship(params.townshipId, params.documentId, params.pageNumber, params.annotationGroupId);
            });

            // Document by ID.
            Path.map('#!/documents/by/id/:id(/:pageNumber)(/:annotationGroupId)').to(params => {
                this.routeOfDocumentById(params.id, params.pageNumber, params.annotationGroupId);
            });

            // Home.
            Path.map('#!/home').to(() => {
                // Display breadcrumbs.
                this.breadcrumbs.clear();
                this.breadcrumbs.appendCached('Home');

                PanelBuilder.of('Home').build(panel => {
                    this.panelHost.panel = panel;
                });
            });

            // Timeline.
            Path.map('#!/persons/by/id/:id').to(params => {
                this.routeOfTimelineById(params.id);
            });

            // Persons
            Path.map('#!/persons/by/query(/:query)(/:personId)').to(params => {
                this.routeOfPersonSearch(params.query, params.personId);
            });

            // My persons
            Path.map('#!/persons/by/owner(/:personId)').to(params => {
                this.routeOfMyPersons(params.personId);
            });

            // Enable routing.
            Path.listen();
        }

        private routeOfDocumentSearch(query?: string, documentId?: string, pageNumber?: number, annotationGroupId?: string): void {
            if (this.stayOnDocument(documentId, pageNumber, annotationGroupId)) {
              return;
            }

            // Display breadcrumbs.
            this.breadcrumbs.clear();
            this.breadcrumbs.appendCached('Home');
            this.breadcrumbs.appendCached('DocumentSearch');

            // No query was given, display the search form.
            if (query === undefined) {
                PanelBuilder.of('DocumentSearch').build(panel => {
                    this.panelHost.panel = panel;
                });

                return;
            }

            // A query was given, display the according breadcrumb.
            this.breadcrumbs.append(new UI.Crumb('Résultats', 'document-view-thumbnail', '#!/documents/by/query/' + query));

            // No document ID was given, display the search results.
            if (documentId === undefined) {
                PanelBuilder.of('DocumentList').args('#!/documents/by/query/' + query).populate(JSON.parse(atob(decodeURIComponent(query)))).build(panel => {
                    this.panelHost.panel = panel;
                });

                return;
            }

            // Otherwise display the document.
            this.createDocumentViewer('#!/documents/by/query/ ' + query, documentId, pageNumber, annotationGroupId);
        }

        private stayOnDocument(documentId: string, pageNumber: number, annotationGroupId: string): boolean {
            // If there is already a document viewer open on this document
            if (this.panelHost.panel && this.panelHost.panel.hasOpenedDocument(documentId)) {
                if (pageNumber) {
                    (<UI.Panels.DocumentViewerPanel>this.panelHost.panel).openPage(pageNumber);

                      console.log(annotationGroupId);
                    if (annotationGroupId) {
                        Repository.of('AnnotationGroup').id(annotationGroupId).then(annotationGroup => {
                            (<UI.Panels.DocumentViewerPanel>this.panelHost.panel).openAnnotationGroup(annotationGroup);
                        });

                        return true;
                    }

                    return true;
                }
            }

            return false;

        }

        private routeOfDocumentById(documentId: string, pageNumber?: number, annotationGroupId?: string) {
            if (this.stayOnDocument(documentId, pageNumber, annotationGroupId)) {
              return;
            }

            // Display breadcrumbs.
            this.breadcrumbs.clear();
            this.breadcrumbs.appendCached('Home');

            // create the document viewer.
            this.createDocumentViewer('#!/documents/by/id/ ' + documentId, documentId, pageNumber, annotationGroupId);
        }

        private routeOfDocumentsByType(documentTypeId?: string, documentId?: string, pageNumber?: number, annotationGroupId?: string): void {
            if (this.stayOnDocument(documentId, pageNumber, annotationGroupId)) {
              return;
            }

            // Display breadcrumbs.
            this.breadcrumbs.clear();
            this.breadcrumbs.appendCached('Home');
            this.breadcrumbs.appendCached('DocumentTypeList');

            // No document type ID was given, display all document types.
            if (documentTypeId === undefined) {
                PanelBuilder.of('DocumentTypeList').build(panel => {
                    this.panelHost.panel = panel;
                });

                return;
            }

            // A document type ID was given, display the according breadcrumb.
            if (this.breadcrumbs.cached(documentTypeId)) {
                // Display from internal cache if possible.
                this.breadcrumbs.appendCached(documentTypeId);
            } else {
                // Otherwise build it.
                Repository.of('DocumentType').id(documentTypeId).then((documentType: Models.DocumentType) => {
                    this.breadcrumbs.cache(documentTypeId, new UI.Crumb(documentType.name, 'document-view-thumbnail', '#!/documents/by/type/' + documentTypeId));
                    this.breadcrumbs.appendCached(documentTypeId);
                });
            }

            // No document ID was given, display all documents.
            if (documentId === undefined) {
                PanelBuilder.of('DocumentList').args('#!/documents/by/type/' + documentTypeId).populate({ documentTypes: [documentTypeId] }).build(panel => {
                    this.panelHost.panel = panel;
                });

                return;
            }

            // Otherwise create the document viewer.
            this.createDocumentViewer('#!/documents/by/type/ ' + documentTypeId, documentId, pageNumber, annotationGroupId);
        }

        private routeOfDocumentsByTownship(townshipId?: string, documentId?: string, pageNumber?: number, annotationGroupId?: string): void {
            if (this.stayOnDocument(documentId, pageNumber, annotationGroupId)) {
              return;
            }

            // Display breadcrumbs.
            this.breadcrumbs.clear();
            this.breadcrumbs.appendCached('Home');
            this.breadcrumbs.appendCached('TownshipList');

            // No township ID was given, display all townships.
            if (townshipId === undefined) {
                PanelBuilder.of('TownshipList').build(panel => {
                    this.panelHost.panel = panel;
                });

                return;
            }

            // A township ID was given, display the according breadcrumb.
            if (this.breadcrumbs.cached(townshipId)) {
                // Display from internal cache if possible.
                this.breadcrumbs.appendCached(townshipId);
            } else {
                // Otherwise build it.
                Repository.of('Township').id(townshipId).then((township: Models.Township) => {
                    this.breadcrumbs.cache(townshipId, new UI.Crumb(township.name, 'document-view-thumbnail', '#!/documents/by/township/' + townshipId));
                    this.breadcrumbs.appendCached(townshipId);
                });
            }

            // No document ID was given, display all documents.
            if (documentId === undefined) {
                PanelBuilder.of('DocumentList').args('#!/documents/by/township/' + townshipId).populate({ township: townshipId }).build(panel => {
                    this.panelHost.panel = panel;
                });

                return;
            }

            // Otherwise create the document viewer.
            this.createDocumentViewer('#!/documents/by/township/' + townshipId, documentId, pageNumber, annotationGroupId);
        }

        private routeOfPersonSearch(query?: string, personId?: string): void {
            // Display breadcrumbs.
            this.breadcrumbs.clear();
            this.breadcrumbs.appendCached('Home');
            this.breadcrumbs.appendCached('PersonSearch');

            // No query was given, display the search form.
            if (query === undefined) {
                PanelBuilder.of('PersonSearch').build(panel => {
                    this.panelHost.panel = panel;
                });

                return;
            }

            // A query was given, display the according breadcrumb.
            this.breadcrumbs.append(new UI.Crumb('Résultats', 'document-view-thumbnail', '#!/persons/by/query/' + query));

            // No person ID was given, display the search results.
            if (personId === undefined) {
                PanelBuilder.of('PersonList').args('#!/persons/by/query/' + query).populate(JSON.parse(atob(decodeURIComponent(query)))).build(panel => {
                    this.panelHost.panel = panel;
                });

                return;
            }

            // Otherwise display the document.
            this.createTimeline('#!/persons/by/query/ ' + query, personId);
        }

        private routeOfMyPersons(personId: string) {
            // Display breadcrumbs.
            this.breadcrumbs.clear();
            this.breadcrumbs.appendCached('Home');
            this.breadcrumbs.append(new UI.Crumb('Mes individus', 'user-silhouette', '#!/persons/by/owner'));

            // If there is no ID, displays every person owner by the user
            if (personId === undefined) {
              PanelBuilder.of('PersonList').args('#!/persons/by/owner').populate({ owner: Session.currentUser.id }).build(panel => {
                  this.panelHost.panel = panel;
              });

              return;
            }

            // If there is an ID, display the timeline
            this.createTimeline('#!/persons/by/owner', personId);             
        }

        private routeOfTimelineById(personId: string) {
            // Display breadcrumbs.
            this.breadcrumbs.clear();
            this.breadcrumbs.appendCached('Home');
            this.breadcrumbs.appendCached('PersonSearch');

            // TODO: fetch a real person.
            /**
            Repository.of('Person').id(personId).then((person: Models.Person) => {


                // Check weither the person timeline has been already opened and the breacrumb is cached. 
                if (this.breadcrumbs.cached(personId)) {
                    // Display from internal cache if possible.
                    this.breadcrumbs.appendCached(personId);
                } else {
                    // Otherwise build it.
                    this.breadcrumbs.cache(personId, new UI.Crumb(person.name, 'document-view-thumbnail', '#!/persons/by/id/' + personId));
                    this.breadcrumbs.appendCached(personId);                                   
                    
                }
            });
            */

            var person = new Models.Person({});

            this.breadcrumbs.cache(personId, new UI.Crumb('John Doe', 'user-silhouette', '#!/persons/by/id/' + personId));
            this.breadcrumbs.appendCached(personId);

            PanelBuilder.of('Timeline').args(person).build(panel => {
                this.panelHost.panel = panel;
            });
        }

        private createDocumentViewer(baseUrl: string, documentId: string, pageNumber = 0, annotationGroupId?: string): void {
            Repository.of('Document').id(documentId).then((document: Models.Document) => {
                // Display the according breadcrumb.
                // Note that we do not cache the crumb.
                // This is because a document can be accessed from several locations.
                this.breadcrumbs.append(new UI.Crumb(document.reference, 'folder-horizontal', baseUrl + '/' + documentId));
            });

            // Build the actual document viewer.
            PanelBuilder.of('DocumentViewer').populate({ documentId: documentId, pageNumber: pageNumber, annotationGroupId: annotationGroupId }).build(panel => {
                this.panelHost.panel = panel;
            });
        }

        private createTimeline(baseUrl: string, personId): void {
            // Fetch the person and build the timeline
            Repository.of('Person').id(personId).then((person: Models.Person) => {
                PanelBuilder.of('Timeline').args(person).build(panel => {
                    this.panelHost.panel = panel;
                });

                // Display the according breadcrumb.
                // Note that we do not cache the crumb.
                // This is because a person can be accessed from several locations.
                this.breadcrumbs.append(new UI.Crumb(person.fullname, 'user-silhouette', baseUrl + '/' + personId));
            });
        }
    }
}
