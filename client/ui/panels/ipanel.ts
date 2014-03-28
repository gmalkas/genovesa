/// <reference path="../../definitions/references.d.ts"/>
/// <reference path="../iview.ts"/>

module Genovesa.UI.Panels {
    /**
     * Base interface that all panels must extend.
     */
    export interface IPanel extends IView {
        /**
         * Toolbar of this panel.
         *
         * @return {JQuery} The toolbar of this panel.
         */
        toolbar: JQuery;

        /**
         * Called when the IPanel view is attached to the DOM.
         *
         * @method
         */
        attached: () => void;

        hasOpenedDocument(documentId: string): boolean;
    }
}
