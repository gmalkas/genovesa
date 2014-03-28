/// <reference path="../definitions/references.d.ts"/>

module Genovesa.UI {
    /**
     * Base interface that all displayable elements must implement.
     */
    export interface IView {
        /** @var {JQuery} Underlying JQuery view. */
        view: JQuery;
    }
}
