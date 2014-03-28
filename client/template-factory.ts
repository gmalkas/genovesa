/// <reference path="definitions/references.d.ts"/>

module Genovesa {
    /**
     * Handles the creation of JQuery objects from templates.
     *
     * @class
     */
    export class TemplateFactory {
        /**
         * Creates a JQuery object from a template name.
         *
         * @method
         * @param {string} templateName The template name.
         * @param {object} templateArgs The object that will be substituted in the template.
         * @return {JQuery} The resulting JQuery object.
         */
        public static create(templateName: string, templateArgs?: any): JQuery {
            var template = Handlebars.templates[templateName];

            if (template === undefined) {
                throw 'Template ' + templateName + ' does not exist.';
            }

            // Construct the template.
            return $(template(templateArgs));
        }
    }
}
