/// <reference path="definitions/references.d.ts"/>
/// <reference path="server.ts"/>
/// <reference path="configuration.ts"/>

module Genovesa {
    /**
     * This is the main server-side program.
     *
     * @class
     */
    export class Application {
        /**
         * Initializes a new instance of the Application class.
         *
         * @constructor
         * @param {string} configPath The path to the configuration file.
         */
        constructor(configPath: string) {
            // Install error handler.
            // This error handler exits on uncaught exceptions.
            // TODO: real error handlers + logger (winston for example)
            // TODO: base this setting on config
            process.on('uncaughtException', err => {
                console.log(err.stack);
                process.exit(1);
            });

            // Load configuration.
            var config = new Configuration(configPath);

            // Run the server.
            var server = new Server(config);
            console.log('Server running.');
            server.run();
        }
    }
}

new Genovesa.Application('config.json');
