/// <reference path="../definitions/references.d.ts"/>
/// <reference path="base.ts"/>
/// <reference path="../utils/session.ts"/>
/// <reference path="../models/annotation-group.ts"/>
/// <reference path="../models/person.ts"/>
/// <reference path="../models/event.ts"/>

module Genovesa.Controllers {
    export class Events {
        public static find(req: ExpressServerRequest, res: ExpressServerResponse, next: Function): void {
            var query = Models.Event.find({});

            if (req.query.person) {
                query.where('participants.person', req.query.person);
            }

            Base.execFind(query, res, next);
        }

        public static findById(req: ExpressServerRequest, res: ExpressServerResponse, next: Function): void {
            var query = Models.Event.findById(req.params.id);

            Base.execFind(query, res, next);
        }
    }
}
