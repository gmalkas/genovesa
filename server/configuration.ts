/// <reference path="definitions/references.d.ts"/>

module Genovesa {
    /**
     * Holds configuration settings for the application.
     *
     * @class
     */
    export class Configuration {
        // TODO: avoid this global state
        private static globalConfiguration: Configuration = null;

        /** @var {object} Key-value pairs representing the settings. */
        private settings: { [index: string]: any; } = {};

        /**
         * Initializes a new instance of the Configuration class.
         *
         * @constructor
         * @param {string} path Path to the configuration file.
         */
        constructor(path: string) {
            var fs = require('fs');

            var err, data = fs.readFileSync(path, 'utf8');

            if (err) {
                throw new Error(err);
            }

            try {
                this.settings = JSON.parse(data);
            } catch (err) {
                throw new Error(err);
            }

            Configuration.globalConfiguration = this;
        }

        /**
         * Returns the value of a given setting.
         *
         * @method
         * @param {string} key The setting name.
         * @return {object} The setting's value.
         */
        public setting(key: string): any {
            // Throw when attempting to read an undefined setting.
            if (this.settings[key] === undefined) {
                throw new Error('Setting <' + key + '> does not exist.');
            }

            return this.settings[key];
        }

        public static global(): Configuration {
            // TODO: avoid this global configuration state
            return Configuration.globalConfiguration;
        }
    }
}
