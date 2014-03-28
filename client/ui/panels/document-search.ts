/// <reference path="../../definitions/references.d.ts"/>
/// <reference path="document-list.ts"/>
/// <reference path="../../models/document.ts"/>
/// <reference path="../../models/township.ts"/>
/// <reference path="../../template-factory.ts"/>

module Genovesa.UI.Panels {
    export class DocumentSearchPanel implements IPanel {
        private _view: JQuery = null;

        private documentTypeLookupById: { [index: string]: Models.DocumentType; } = {};
        private townshipLookupByName: { [index: string]: Models.Township; } = {};

        constructor(documentTypes: Models.DocumentType[], townships: Models.Township[]) {
            // Create a lookup to access document types by ID.
            documentTypes.map(documentType => {
                this.documentTypeLookupById[documentType.id] = documentType;
            });

            // Create a lookup to access townships by name.
            townships.map(township => {
                this.townshipLookupByName[township.name] = township;
            });

            // Build the view.
            this._view = TemplateFactory.create('panels/document-search', {
                documentTypes: documentTypes,
                // FIXME In production replace this.TOWNSHIP_LIST with townships
                townships: this.TOWNSHIP_LIST
            });

            // Bind the button click event.
            this._view.find('[action="do-search"]').click(e => {
                e.preventDefault();

                if (this.tryValidate()) {
                    this.doSearch();
                }
            });
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

        public hasOpenedDocument(documentId: string) {
            return false;
        }

        //#endregion

        private get selectedTownship(): Models.Township {
            var townshipName = this._view.find('[name="township"]').first().val();

            return this.townshipLookupByName[townshipName] || null;
        }

        private get selectedDocumentTypes(): Models.DocumentType[] {
            var result = [];

            this._view.find('input[type=checkbox]:checked').each((k, v) => {
                result.push(this.documentTypeLookupById[$(v).attr('id')]);
            });

            return result;
        }

        private get selectedFromYear(): number {
            return this._view.find('[name="fromYear"]').val();
        }

        private get selectedToYear(): number {
            return this._view.find('[name="toYear"]').val();
        }

        private tryValidate(): boolean {
            if (this.selectedDocumentTypes.length < 1) {
                window.alert('Veuillez cocher au moins un type de document');

                return false;
            }

            if (this.selectedTownship === null) {
                window.alert('Cette commune n\'existe pas');

                return false;
            }

            return true;
        }

        private doSearch(): void {
            // Prepare the query.
            var query = {
                township: this.selectedTownship.id,
                fromYear: this.selectedFromYear,
                toYear: this.selectedToYear,
                documentTypes: this.selectedDocumentTypes.map(documentType => {
                    return documentType.id;
                })
            };
            
            // Navigate to the results.
            location.assign('#!/documents/by/query/' + encodeURIComponent(btoa(JSON.stringify(query))));
        }

        // REMOVE THIS IN PRODUCTION
        private TOWNSHIP_LIST = [
            "Acigné",
            "Amanlis",
            "Andouillé-Neuville",
            "Antrain",
            "Arbrissel",
            "Argentré-du-Plessis",
            "Aubigné",
            "Availles-sur-Seiche",
            "Baguer-Morvan",
            "Baguer-Pican",
            "Baillé",
            "Bain-de-Bretagne",
            "Bains-sur-Oust",
            "Bais",
            "Balazé",
            "Baulon",
            "La Baussaine",
            "La Bazouge-du-Désert",
            "Bazouges-la-Pérouse",
            "Beaucé",
            "Bécherel",
            "Bédée",
            "Betton",
            "Billé",
            "Bléruais",
            "Boisgervilly",
            "Boistrudan",
            "Bonnemain",
            "La Bosse-de-Bretagne",
            "La Bouëxière",
            "Bourgbarré",
            "Bourg-des-Comptes",
            "La Boussac",
            "Bovel",
            "Bréal-sous-Montfort",
            "Bréal-sous-Vitré",
            "Brécé",
            "Breteil",
            "Brie",
            "Brielles",
            "Broualan",
            "Bruc-sur-Aff",
            "Les Brulais",
            "Bruz",
            "Campel",
            "Cancale",
            "Cardroc",
            "Cesson-Sévigné",
            "Champeaux",
            "Chancé",
            "Chanteloup",
            "Chantepie",
            "La Chapelle-aux-Filtzméens",
            "La Chapelle-Bouëxic",
            "La Chapelle-Chaussée",
            "La Chapelle-de-Brain",
            "La Chapelle-des-Fougeretz",
            "La Chapelle-du-Lou",
            "La Chapelle-Erbrée",
            "La Chapelle-Janson",
            "La Chapelle-Saint-Aubert",
            "La Chapelle-Thouarault",
            "Chartres-de-Bretagne",
            "Chasné-sur-Illet",
            "Châteaubourg",
            "Châteaugiron",
            "Châteauneuf-d'Ille-et-Vilaine",
            "Le Châtellier",
            "Châtillon-en-Vendelais",
            "Chauvigné",
            "Chavagne",
            "Chelun",
            "Cherrueix",
            "Chevaigné",
            "Cintré",
            "Clayes",
            "Coësmes",
            "Coglès",
            "Comblessac",
            "Combourg",
            "Combourtillé",
            "Cornillé",
            "Corps-Nuds",
            "La Couyère",
            "Crevin",
            "Le Crouais",
            "Cuguen",
            "Dinard",
            "Dingé",
            "Dol-de-Bretagne",
            "Domagné",
            "Domalain",
            "La Dominelais",
            "Domloup",
            "Dompierre-du-Chemin",
            "Dourdain",
            "Drouges",
            "Eancé",
            "Epiniac",
            "Erbrée",
            "Ercé-en-Lamée",
            "Ercé-près-Liffré",
            "Essé",
            "Étrelles",
            "Feins",
            "Le Ferré",
            "Fleurigné",
            "La Fontenelle",
            "Forges-la-Forêt",
            "Fougères",
            "La Fresnais",
            "Gaël",
            "Gahard",
            "Gennes-sur-Seiche",
            "Gévezé",
            "Gosné",
            "La Gouesnière",
            "Goven",
            "Grand-Fougeray",
            "La Guerche-de-Bretagne",
            "Guichen",
            "Guignen",
            "Guipel",
            "Guipry",
            "Hédé-Bazouges",
            "L'Hermitage",
            "Hirel",
            "Iffendic",
            "Les Iffs",
            "Irodouër",
            "Janzé",
            "Javené",
            "Laignelet",
            "Laillé",
            "Lalleu",
            "Landavran",
            "Landéan",
            "Landujan",
            "Langan",
            "Langon",
            "Langouët",
            "Lanhélin",
            "Lanrigan",
            "Lassy",
            "Lécousse",
            "Lieuron",
            "Liffré",
            "Lillemer",
            "Livré-sur-Changeon",
            "Lohéac",
            "Longaulnay",
            "Le Loroux",
            "Le Lou-du-Lac",
            "Lourmais",
            "Loutehel",
            "Louvigné-de-Bais",
            "Louvigné-du-Désert",
            "Luitré",
            "Marcillé-Raoul",
            "Marcillé-Robert",
            "Marpiré",
            "Martigné-Ferchaud",
            "Maure-de-Bretagne",
            "Maxent",
            "Mecé",
            "Médréac",
            "Meillac",
            "Melesse",
            "Mellé",
            "Mernel",
            "Messac",
            "La Mézière",
            "Mézières-sur-Couesnon",
            "Miniac-Morvan",
            "Miniac-sous-Bécherel",
            "Le Minihic-sur-Rance",
            "Mondevert",
            "Montauban-de-Bretagne",
            "Montautour",
            "Mont-Dol",
            "Monterfil",
            "Montfort-sur-Meu",
            "Montgermont",
            "Monthault",
            "Montours",
            "Montreuil-des-Landes",
            "Montreuil-le-Gast",
            "Montreuil-sous-Pérouse",
            "Montreuil-sur-Ille",
            "Mordelles",
            "Mouazé",
            "Moulins",
            "Moussé",
            "Moutiers",
            "Muel",
            "La Noë-Blanche",
            "La Nouaye",
            "Nouvoitou",
            "Noyal-sous-Bazouges",
            "Noyal-Châtillon-sur-Seiche",
            "Noyal-sur-Vilaine",
            "Orgères",
            "Ossé",
            "Pacé",
            "Paimpont",
            "Pancé",
            "Parcé",
            "Parigné",
            "Parthenay-de-Bretagne",
            "Le Pertre",
            "Le Petit-Fougeray",
            "Pipriac",
            "Piré-sur-Seiche",
            "Pléchâtel",
            "Pleine-Fougères",
            "Plélan-le-Grand",
            "Plerguer",
            "Plesder",
            "Pleugueneuc",
            "Pleumeleuc",
            "Pleurtuit",
            "Pocé-les-Bois",
            "Poilley",
            "Poligné",
            "Pont-Péan",
            "Princé",
            "Québriac",
            "Quédillac",
            "Rannée",
            "Redon",
            "Renac",
            "Rennes",
            "",
            "",
            "Retiers",
            "Le Rheu",
            "La Richardais",
            "Rimou",
            "Romagné",
            "Romazy",
            "Romillé",
            "Roz-Landrieux",
            "Roz-sur-Couesnon",
            "Sains",
            "Saint-Armel",
            "Saint-Aubin-d'Aubigné",
            "Saint-Aubin-des-Landes",
            "Saint-Aubin-du-Cormier",
            "Saint-Aubin-du-Pavail",
            "Saint-Benoît-des-Ondes",
            "Saint-Briac-sur-Mer",
            "Saint-Brice-en-Coglès",
            "Saint-Brieuc-des-Iffs",
            "Saint-Broladre",
            "Saint-Christophe-des-Bois",
            "Saint-Christophe-de-Valains",
            "Saint-Coulomb",
            "Saint-Didier",
            "Saint-Domineuc",
            "Sainte-Anne-sur-Vilaine",
            "Sainte-Colombe",
            "Sainte-Marie",
            "Saint-Erblon",
            "Saint-Étienne-en-Coglès",
            "Saint-Ganton",
            "Saint-Georges-de-Chesné",
            "Saint-Georges-de-Gréhaigne",
            "Saint-Georges-de-Reintembault",
            "Saint-Germain-du-Pinel",
            "Saint-Germain-en-Coglès",
            "Saint-Germain-sur-Ille",
            "Saint-Gilles",
            "Saint-Gondran",
            "Saint-Gonlay",
            "Saint-Grégoire",
            "Saint-Guinoux",
            "Saint-Hilaire-des-Landes",
            "Saint-Jacques-de-la-Lande",
            "Saint-Jean-sur-Couesnon",
            "Saint-Jean-sur-Vilaine",
            "Saint-Jouan-des-Guérets",
            "Saint-Just",
            "Saint-Léger-des-Prés",
            "Saint-Lunaire",
            "Saint-Malo",
            "Saint-Malo-de-Phily",
            "Saint-Malon-sur-Mel",
            "Saint-Marcan",
            "Saint-Marc-le-Blanc",
            "Saint-Marc-sur-Couesnon",
            "Saint-Maugan",
            "Saint-Médard-sur-Ille",
            "Saint-Méen-le-Grand",
            "Saint-Méloir-des-Ondes",
            "Saint-M'Hervé",
            "Saint-M'Hervon",
            "Saint-Onen-la-Chapelle",
            "Saint-Ouen-des-Alleux",
            "Saint-Ouen-la-Rouërie",
            "Saint-Péran",
            "Saint-Père",
            "Saint-Pern",
            "Saint-Pierre-de-Plesguen",
            "Saint-Rémy-du-Plain",
            "Saint-Sauveur-des-Landes",
            "Saint-Séglin",
            "Saint-Senoux",
            "Saint-Suliac",
            "Saint-Sulpice-la-Forêt",
            "Saint-Sulpice-des-Landes",
            "Saint-Symphorien",
            "Saint-Thual",
            "Saint-Thurial",
            "Saint-Uniac",
            "Saulnières",
            "Le Sel-de-Bretagne",
            "La Selle-en-Coglès",
            "La Selle-en-Luitré",
            "La Selle-Guerchaise",
            "Sens-de-Bretagne",
            "Servon-sur-Vilaine",
            "Sixt-sur-Aff",
            "Sougéal",
            "Taillis",
            "Talensac",
            "Teillay",
            "Le Theil-de-Bretagne",
            "Thorigné-Fouillard",
            "Thourie",
            "Le Tiercent",
            "Tinténiac",
            "Torcé",
            "Trans-la-Forêt",
            "Treffendel",
            "Tremblay",
            "Trémeheuc",
            "Tresbœuf",
            "Tressé",
            "Trévérien",
            "Trimer",
            "Le Tronchet",
            "Val-d'Izé",
            "Vendel",
            "Vergéal",
            "Le Verger",
            "Vern-sur-Seiche",
            "Vezin-le-Coquet",
            "Vieux-Viel",
            "Vieux-Vy-sur-Couesnon",
            "Vignoc",
            "Villamée",
            "La Ville-ès-Nonais",
            "Visseiche",
            "Vitré",
            "Le Vivier-sur-Mer"
        ];
    }
}
