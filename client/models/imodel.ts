/// <reference path="../definitions/references.d.ts"/>

module Genovesa.Models {
    /**
     * Base interface that all Models must implement.
     */
    export interface IModel {
        /**
         * Raw object representation of this IModel.
         */
        raw: any;

        /**
         * Unique identifier of this IModel.
         */
        id: string;
    }
}
