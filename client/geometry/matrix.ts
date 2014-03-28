/// <reference path="../definitions/references.d.ts"/>
/// <reference path="point.ts"/>

module Genovesa.Geometry {
    export class Matrix {
        private m: number[] = [];

        constructor() {
            this.identity();
        }

        public identity(): void {
            this.m = [1, 0, 0, 1, 0, 0];
        }

        public translate(offset: Point): void {
            this.m[4] += this.m[0] * offset.x + this.m[2] * offset.y;
            this.m[5] += this.m[1] * offset.x + this.m[3] * offset.y;
        }

        public rotate(angle: number): void {
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);

            var m11 = this.m[0] * cos + this.m[2] * sin;
            var m12 = this.m[1] * cos + this.m[3] * sin;
            var m21 = this.m[0] * -sin + this.m[2] * cos;
            var m22 = this.m[1] * -sin + this.m[3] * cos;

            this.m[0] = m11;
            this.m[1] = m12;
            this.m[2] = m21;
            this.m[3] = m22;
        }

        public scale(factor: number): void {
            this.m[0] *= factor;
            this.m[1] *= factor;
            this.m[2] *= factor;
            this.m[3] *= factor;
        }

        public inverse(): Matrix {
            var inv = new Matrix();

            var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
            inv.m[0] = this.m[3] * d;
            inv.m[1] = -this.m[1] * d;
            inv.m[2] = -this.m[2] * d;
            inv.m[3] = this.m[0] * d;
            inv.m[4] = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
            inv.m[5] = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);

            return inv;
        }

        public transform(point: Point) {
            return new Point(
                point.x * this.m[0] + point.y * this.m[2] + this.m[4],
                point.x * this.m[1] + point.y * this.m[3] + this.m[5]
            );
        }
    }
}
