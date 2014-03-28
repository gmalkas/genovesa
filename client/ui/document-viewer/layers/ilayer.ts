/// <reference path="../../../definitions/references.d.ts"/>
/// <reference path="../../iview.ts"/>

module Genovesa.UI.DocumentViewer.Layers {
    export interface ILayer extends IView {
        resize(width: number, height: number): void;
    }
}
