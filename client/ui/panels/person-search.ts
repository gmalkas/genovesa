/// <reference path="../../definitions/references.d.ts"/>
/// <reference path="document-list.ts"/>
/// <reference path="../../models/document.ts"/>
/// <reference path="../../models/township.ts"/>
/// <reference path="../../template-factory.ts"/>

module Genovesa.UI.Panels {
    export class PersonSearchPanel implements IPanel {
        private _view: JQuery = null;
        private criteriaCount = 0;

        constructor() {
            // Build the view.
            this._view = TemplateFactory.create('panels/person-search');

            // Bind the button click event.
            this._view.find('[data-action="do-search"]').click(e => {
                e.preventDefault();

                this.doSearch();
            });

            this._view.find('[data-action="add-criteria"]').click(e => {
                this.addCriteria();
            });

            this.addCriteria(false);
        }

        //#region IPanel members.

        public get view(): JQuery {
            return this._view;
        }

        public get toolbar(): JQuery {
            return null;
        }

        public attached(): void {
        }

        public hasOpenedDocument(documentId): boolean {
            return false;
        }
        //#endregion

        private addCriteria(removable = true): void {
            this.criteriaCount++;
            var newCriteria = {
                removable: removable,
                id: this.criteriaCount
            };
            var field = TemplateFactory.create('panels/person-search-criteria', newCriteria);
            field.find('[data-action="remove-criteria"]').click(e => {
                this._view.find('[data-criteria="' + $(e.target).data('criteria') + '"]').remove();
            });
            this._view.find('.criterias').append(field);
        }

        private doSearch(): void {
            // Prepare the query.
            var query = {
                attributes: []
            };

            // Loop through the available criterias
            this._view.find('p[data-criteria]').each((index, element) => {
                var criteria = {
                    key: '',
                    value: ''
                };

                var field = this._view.find('[data-criteria="' + $(element).data('criteria') + '"]').first();

                criteria.key = field.find('[data-field="key"]').first().val();
                criteria.value = field.find('[data-field="value"]').first().val();

                query.attributes.push(criteria);
            });

            // Navigate to the results.
            location.assign('#!/persons/by/query/' + encodeURIComponent(btoa(JSON.stringify(query))));
        }
    }
}

