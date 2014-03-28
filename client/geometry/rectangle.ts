/// <reference path="./point.ts"/>
/// <reference path="./size.ts"/>

module Genovesa.Geometry {
    export class Rectangle {
        public x: number      = null;
        public y: number      = null;
        public width: number  = null;
        public height: number = null;

        constructor(position: Point, size: Size);
        constructor(x: number, y: number, width: number, height: number);

        /**
         * Note: this constructor shouldn't be use as in.
         */
        constructor(param1: any, param2: any, param3: any = null, param4: any = null) {
            if (param3 === null && param4 === null) {
                // If we use the constructor with a position and a size.
                var position = <Point>param1;
                var size     = <Size>param2;

                this.x      = position.x;
                this.y      = position.y;
                this.width  = size.width;
                this.height = size.height;
            } else {
                this.x      = <number>param1;
                this.y      = <number>param2;
                this.width  = <number>param3;
                this.height = <number>param4;
            }
        }
    }
}
