/// <reference path="../../definitions/references.d.ts"/>
/// <reference path="../../template-factory.ts"/>
/// <reference path="./form.ts"/>
/// <reference path="../../models/user.ts"/>
/// <reference path="../../session.ts"/>
/// <reference path="../../cookie.ts"/>

module Genovesa.UI.Forms {
    export class LoginForm extends Form {
        private _user: Genovesa.Models.User = null;
        private email: JQuery = null;
        private password: JQuery = null;
        private persist: JQuery = null;

        /** @var {JQuery} The actual HTML form */
        private form: JQuery = null;

        /** @var {JQuery} Underlying JQuery view */
        private _view = TemplateFactory.create('forms/login');

        constructor() {
            super();
            this.form = this.view.find('.login-form').first();
            this.email = this.form.find('#email');
            this.password = this.form.find('#password');
            this.persist = this.form.find('#persist');

            this.registerEventHandlers();
            this.ready();
        }

        public get view(): JQuery {
            return this._view;
        }

        /**
         * Sets the form's state to _ready: displays the submit button.
         */
        private ready(): void {
            var loginButton = TemplateFactory.create('forms/login-actions');
            loginButton.click(() => { this.login(); });
            this.form.find('.form-actions').empty();
            this.form.find('.form-actions').append(loginButton);
            this.form.find('#email').first().focus();

            var email = Cookie.getEmail();

            if (email !== '') {
                this.email.val(email);
                this.persist.attr('checked', 'checked');
            }
        }

        /**
         * Sets the form's state to processing: the user can't submit the form,
         * and an ajax-loader is displayed.
         */
        private processing(): void {
            this.form.find('.form-actions').empty();
            this.form.find('.form-actions').append(TemplateFactory.create('ajax-loader'));
        }

        private registerEventHandlers(): void {
            this.view.find('[data-action="close-dialog"]').click(() => {
                this.close();
            });

            this.view.find('[data-action="register"]').click(() => {
                this.resultAction = 'register';
                this.result = Form.Result.no;
            });

            this.view.find('#persist').click(() => {
                if (!this.persist.is(':checked')) {
                    Cookie.setEmail('');
                }
            });

            this.form.find('#password').keypress((e) => {
                if (e.which == 13) {
                    this.login();
                    return false;
                }
            });
        }

        /**
         * Submits the login form and acts according to the login result.
         */
        public login(): void {
            // Avoid the 400 errors because fields are empty.
            if (this.email.val() == '' || this.password.val() == '')
                return;

            this.processing();
            var data = this.form.serialize();

            Session.login(data, (error: any, user) => {
                if (error) {
                    this.displayErrors(error);
                    this.ready();
                    console.log(error);
                    return;
                }

                if (this.persist.is(':checked')) {
                    // We persist user's mail if he succeed to login.
                    Cookie.setEmail(this.email.val());
                }

                this._user = user;
                this.resultAction = 'login';
                this.result = Form.Result.yes;
            });
        }

        /**
         * Displays the errors.
         */
        public displayErrors(err): void {
            this.clearFormErrors();

            switch (err.code) {
                case 400:
                    this.addFormError('Veuillez remplir le formulaire.');
                    break;
                case 200:
                    this.addFormError(err.errors.application.message);
                    break;
                default:
                    this.addFormError(err.errors.application.message);
                    break;
            }
        }

        /**
         * Removes all displayed errors.
         */
        public clearFormErrors(): void {
            this.form.find('.errors').empty();
        }

        /**
         * Appends an error message to the form.
         * 
         * @param {String} message
         */
        public addFormError(message: string): void {
            this.form.find('.errors').append(message);
        }

        /**
         * Gets the logged user.
         *
         * @method
         * @ return {Genovesa.Models.User} The logged user, or null if login has been canceled.
         */
        public get user(): Genovesa.Models.User {
            return this._user;
        }
    }
}
