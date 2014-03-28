/// <reference path="../../../geometry/point.ts"/>

module Genovesa.UI.DocumentViewer.Tools {
    export interface ITool {
        initialize(position: Geometry.Point): void;
        drag(position: Geometry.Point): void;
        drop(position: Geometry.Point): void;
    }
}

