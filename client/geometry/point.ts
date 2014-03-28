module Genovesa.Geometry {
    export class Point {
        public x: number;

        public y: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        public plus(point: Point): Point {
            return new Point(this.x + point.x, this.y + point.y);
        }

        public minus(point: Point): Point {
            return new Point(this.x - point.x, this.y - point.y);
        }
    }
}