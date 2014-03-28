/// <reference path="jquery.d.ts"/>

interface UtilsStatic {
    escapeExpression: (data: string) => string;
}

interface HandlebarsStatic {
    // Handlebars namespace
    templates: { [index: string]: (args?) => string; };
    Utils: UtilsStatic;
    SafeString: (data: any) => any;
    registerHelper: any;
}

// Bugfix
declare var Handlebars: HandlebarsStatic;

interface JQuery {
    // Mousewheel library
    mousewheel: any;
}
