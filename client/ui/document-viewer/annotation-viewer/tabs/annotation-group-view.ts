/// <reference path="../../../../definitions/references.d.ts"/>
/// <reference path="../../../../models/annotation-group.ts"/>

module Genovesa.UI.DocumentViewer.AnnotationViewer.Tabs {
    export class AnnotationGroupView {

        private annotationGroup: Models.AnnotationGroup = null;

        constructor(annotationGroup: Models.AnnotationGroup) {
            this.annotationGroup = annotationGroup;
        }

        public get title(): string {
            var types = this.annotationGroup.tags.filter(t => { return t.key == 'Type'; });
            if (types.length > 0) {
                return types[0].value;
            }

            return 'Événement inconnu';
        }

        public get author(): string {
            return this.annotationGroup.owner.data.name;
        }

        public get id(): string {
            return this.annotationGroup.id;
        }

        public get tags(): any[] {
            return this.annotationGroup.tags;
        }

        public get annotations(): any[] {
            return this.annotationGroup.annotations; 
        }
    }
}
