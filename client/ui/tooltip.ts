/// <reference path="../definitions/references.d.ts"/>
/// <reference path="../api/person.ts"/>

module Genovesa.UI {
    export class Tooltip {
        public static loadPersonTooltip(elemen, personId): void {
            var span = $(elemen).find('span');

            Genovesa.API.Person.get(personId, function (err, person) {
                if (err) {
                    span.html(err);
                } else {
                    console.log(person);
                    span.html($(Genovesa.Templates['timeline/tooltip'](person)));
                }

                var offset = $(elemen).offset();
                span.offset({ top: offset.top + 20, left: offset.left });
            });
        }
    }
}