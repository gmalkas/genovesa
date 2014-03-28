/// <reference path="definitions/references.d.ts"/>
/// <reference path="configuration.ts"/>
/// <reference path="router.ts"/>

module Genovesa {
    /**
     * Genovesa's server class.
     *
     * @class
     */
    export class Server {
        /** @var {Configuration} Configuration object. */
        private config: Configuration = null;

        /** @var {Express} ExpressJS app. */
        private app: Express = null;

        /** @var {object} Mongoose connection. */
        private db = null;

        /**
         * Initializes a new instance of the Server class.
         *
         * @constructor
         * @param {Configuration} config The Server's configuration.
         */
        constructor(config: Configuration) {
            this.config = config;
            this.connectDatabase();
            this.setupServer();
        }

        /**
         * Establishes the database connection.
         *
         * @method
         */
        private connectDatabase(): void {
            var mongoose = require('mongoose');

            // Attempt connecting to the database.
            mongoose.connect(this.config.setting('database'));

            // Save connection and install error handler.
            // TODO: base this setting on config
            this.db = mongoose.connection;
            this.db.on('error', console.error.bind(console, 'Connection error:'));
        }

        /**
         * Configures the underlying ExpressJS server.
         *
         * @method
         */
        private setupServer(): void {
            var express = require('express');

            this.app = express();

            // TODO: base this setting on config
            this.app.use(express.logger('dev'));
            this.app.use(express.favicon());
            this.app.use(express.bodyParser());
            this.app.use(express.methodOverride());
            // FIXME: Need to read the secret token from a file
            // that's not in the repository
            // TODO: base this setting on config
            this.app.use(express.cookieParser('secret'));
            this.app.use(express.session());

            // Use gzip if specified.
            if (this.config.setting('enable_compress')) {
                this.app.use(express.compress());
            }

            // Install authentication filter if specified.
            if (this.config.setting('authentication_required')) {
                this.app.use(Router.middleware('authentication-filter'));
            }

            // Install CSRF guard if specified.
            if (this.config.setting('enabled_csrf_guard')) {
                this.app.use(Router.middleware('csrf-guard'));
            }

            // Install dynamic routes.
            Router.setupRoutes(this.app);

            // Install static routes.
            this.app.use(express.static(process.cwd() + '/public'));

            // TODO: remove this in production
            this.app.use(express.static(process.cwd() + '/'));

            // TODO: replace this with custom error handler
            this.app.use(express.errorHandler());
        }

        /**
         * Starts the server, making it accept incoming connections.
         *
         * @method
         */
        public run(): void {
            this.app.listen(this.config.setting('port'));
        }
    }
}
