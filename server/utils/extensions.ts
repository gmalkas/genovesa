/// <reference path="../definitions/references.d.ts"/> 

module Extensions {
    /*
     * TODO: replace this with interface redefinition when the compiler's bug is fixed.
     * Goal: RegExp.escape
     */
    function escapeRegExp(str: string): string {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    }

    export function makeRegExp(str: string): RegExp {
        return new RegExp(escapeRegExp(str), 'i');
    }
}
