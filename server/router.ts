/// <reference path="definitions/references.d.ts"/>
/// <reference path="utils/session.ts"/>

// Import controllers.
/// <reference path="controllers/documents.ts"/>
/// <reference path="controllers/users.ts"/>
/// <reference path="controllers/annotation-groups.ts"/>
/// <reference path="controllers/persons.ts"/>
/// <reference path="controllers/document-types.ts"/>
/// <reference path="controllers/townships.ts"/>
/// <reference path="controllers/bookmarks.ts"/>
/// <reference path="controllers/events.ts"/>

module Genovesa {
    /**
     * Handles the creation of dynamic routes.
     *
     * @class
     */
    export class Router {
        /** @const {string} Root API URL. */
        private static apiRoot = '/api';

        /** @const {array} Array of dynamic routes definitions. */
        private static routes: any[][] = [
          // Annotation Groups.
          ['get', '/annotation-groups', Controllers.AnnotationGroups.find],
          ['get', '/annotation-groups/:id', Controllers.AnnotationGroups.findById],
          ['post', '/annotation-groups', Controllers.AnnotationGroups.create],
          ['put', '/annotation-groups/:id', Controllers.AnnotationGroups.update],
          ['delete', '/annotation-groups/:id', Controllers.AnnotationGroups.remove],

          // Bookmarks.
          ['post', '/bookmarks', Controllers.Bookmarks.add],
          ['get', '/bookmarks', Controllers.Bookmarks.all],
          ['delete', '/bookmarks', Controllers.Bookmarks.remove],


          // Document Types.
          ['get', '/document-types', Controllers.DocumentTypes.find],
          ['get', '/document-types/:id', Controllers.DocumentTypes.findById],

          // Documents.
          ['get', '/documents', Controllers.Documents.find],
          ['get', '/documents/:id', Controllers.Documents.findById],

          // Persons.
          ['get', '/persons', Controllers.Persons.find],
          ['get', '/persons/:id', Controllers.Persons.findById],
          ['post', '/persons', Controllers.Persons.create],

          // Townships.
          ['get', '/townships', Controllers.Townships.find],
          ['get', '/townships/:id', Controllers.Townships.findById],

          // Events
          ['get', '/events', Controllers.Events.find],
          ['get', '/events/:id', Controllers.Events.findById],

          // Users.
          ['post', '/users', Controllers.Users.create],
          ['get', '/users/session', Controllers.Users.session],
          ['post', '/users/login', Controllers.Users.login],
          ['post', '/users/logout', Controllers.Users.logout],
          ['get', '/users/:id', Controllers.Users.findById]
        ];

        /** @const {array} Array of routes that are not filtered when filtering is enabled. */
        private static dmzRoutes = ['/users', '/users/login', '/users/logout'];

        /**
         * Registers all dynamic routes.
         *
         * @method
         * @param {object} app The ExpressJS app on which the routes will be registered.
         */
        public static setupRoutes(app: Express): void {
            // Lookup between HTTP verbs and the ExpressJS app methods.
            // Method context is bound to app.
            var methodHandlers: { [index: string]: Handler; } = {
                'all': app.all.bind(app),
                'get': app.get.bind(app),
                'post': app.post.bind(app),
                'put': app.put.bind(app),
                'delete': app.del.bind(app)
            };

            // Call the appropriate ExpressJS method on every route definition.
            Router.routes.map(routeParams => {
                // Create a simple route object for readability.
                var route: any = {
                    method: methodHandlers[routeParams[0]],
                    // Prepend API root path to URL.
                    'url': Router.apiRoot + routeParams[1],
                    'handler': routeParams[2]
                };

                // Effectively register the route.
                route.method(route.url, route.handler);
            });

            // This route adds the source map header for genovesa.min.js.
            app.get('/js/genovesa.min.js', (req: ExpressServerRequest, res: ExpressServerResponse, next?: Function) => {
                res.set('X-SourceMap', '/js/genovesa.min.js.map');
                next();
            });
        }

        /**
         * Basic middleware that filters all requests when user authentication is required.
         *
         * @method
         * @param {express.Request} req The request object.
         * @param {express.Response} res The response object.
         * @param {function} next The next middleware. 
         */
        private static authenticationFilter(req: ExpressServerRequest, res: ExpressServerResponse, next?: Function): void {
            // If the user is logged, no filter is applied.
            if (req.session && req.session.user.isLogged) {
                next();
                return;
            }

            // If the route is in the DMZ, proceed anyway.
            if (Router.dmzRoutes.indexOf(req.path) >= 0) {
                next();
                return;
            }

            // Otherwise 403.
            res.send(403);
        }

        /**
         * Basic middleware that blocks all cross-site request forgery (CSRF) attacks.
         *
         * @method
         * @param {express.Request} req The request object.
         * @param {express.Response} res The response object.
         * @param {function} next The next middleware. 
         */
        private static csrfGuard(req: ExpressServerRequest, res: ExpressServerResponse, next?: Function): void {
            // Ignore CSRF check if user is not logged or request doesn't change state.
            if (!Utils.Session.isLogged(req) || ['GET', 'HEAD', 'OPTIONS'].indexOf(req.method) >= 0) {
                next();
                return;
            }

            // This is the token supplied in the request.
            var expectedToken = req.session.user._csrfToken;
            // This is the token as it *should* be supplied in the request.
            var effectiveToken = Utils.Session.getCsrfToken(req);

            // If both token don't match, it's a CSRF attack.
            if (effectiveToken !== expectedToken) {
                // TODO: log csrf attempt
                // TODO: fix chain send/next
                console.log("CSRF attempt");
                console.log("Expected token : " + expectedToken);
                console.log("Effective token : " + effectiveToken);

                res.send(403);
                return;
            }

            // If tokens do match, generate the next token in the chain.
            req.session.user._csrfToken = Utils.Session.computeNextToken(effectiveToken);

            // And proceed to the next middleware.
            next();
        }

        /**
         * Returns a middleware function, bound to this object, given its name.
         *
         * @method
         * @param {string} middlewareName The name of the middleware to return.
         * @return {Handler} The middleware.
         */
        public static middleware(middlewareName: string): Handler {
            switch (middlewareName) {
                case 'authentication-filter':
                    return Router.authenticationFilter.bind(Router);

                case 'csrf-guard':
                    return Router.csrfGuard.bind(Router);

                default:
                    throw new Error('Middleware does not exist');
                    return;
            }
        }
    }
}
