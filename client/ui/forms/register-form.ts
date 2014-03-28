/// <reference path="../../definitions/references.d.ts"/>
/// <reference path="../../session.ts"/>
/// <reference path="./form.ts"/>
/// <reference path="../../template-factory.ts"/>

module Genovesa.UI.Forms {

    /**
     *  Create a new register form.
     *
     * @class
     */
    export class RegisterForm extends Form {

        private _user: Genovesa.Models.User = null;

        private form: JQuery = null;
        private errors: JQuery = null;

        /** @var {JQuery} Underlying JQuery view */
        private _view = TemplateFactory.create('forms/register');

        constructor() {
            super();

            this.form = this._view.find('.register-form').first();
            this.errors = this.form.find('.errors').first();
            this.registerEventHandlers();
            this.ready();
        }

        /**
         * @method
         * @override
         */
        public get view(): JQuery {
            return this._view;
        }


        /**
         * Setup the initiale state of the register form.
         *
         * @method
         */
        private ready(): void {
            var registerButton = TemplateFactory.create('forms/register-actions');
            registerButton.click(() => { this.proceedRegister(); });

            this.form.find('.form-actions').empty();
            this.form.find('.form-actions').append(registerButton);
            this.form.find('#name').first().focus();
        }

        /**
         * Register all user events to the form handlers.
         *
         * @method
         */
        private registerEventHandlers(): void {
            this._view.find('[data-action="close-dialog"]').click(() => {
                this.close();
            });
            this._view.find('[data-action="login"]').click(() => {
                this.resultAction = 'login';
                this.result = Form.Result.no;
            });
        }

        /**
         * Try to register a new user from the form values.
         * Start with a client-side validation, then a remote one.
         * Print the registration errors if needed.
         *
         * @method 
         */
        private proceedRegister(): void {
            this.clearFormErrors();

            if (this.localValidation()) {
                this.remoteValidation();
            }
        }

        /**
         * Clean all printed errors.
        
         * @method
         */
        private clearFormErrors(): void {
            this.errors.empty();
            this.form.find('input').removeClass('invalid');
        }

        /**
         * Do the client-side validation of the form.
         *
         * @method
         */
        private localValidation(): boolean {
            var result = true;
            var name = $('[name=user\\[name\\]]');
            var email = $('[name=user\\[email\\]]');
            var password = $('[name=user\\[password\\]]');
            var password_confirmation = $('[name=user\\[passwordConfirmation\\]]');

            if (!/^\w{5,30}$/g.test(name.val())) {
                this.errors.append('<li>Votre identifiant doit être d\'une taille comprise entre 5 et 30 caractères et ne doit contenir que des lettres ou des chiffres</li>');
                name.addClass('invalid');

                result = false;
            }

            var email_regexp = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", "g");

            if (!email_regexp.test(email.val())) {
                this.errors.append('<li>Votre adresse électronique est invalide</li>');
                email.addClass('invalid');

                result = false;
            }

            if (password.val().length < 5 || password.val().length > 50) {
                this.errors.append('<li>Votre mot de passe doit être d\'une taille comprise entre 5 et 50 caractères</li>');
                password.addClass('invalid');

                result = false;
            }

            if (password.val() != password_confirmation.val()) {
                this.errors.append('<li>Confirmation du mot de passe invalide. Veuillez recompléter les champs ci-dessus.</li>');
                password_confirmation.addClass('invalid');

                result = false;
            }

            return result;
        }

        /**
         * Register the user server-side.
         *
         * @method
         */
        private remoteValidation(): void {
            var data = this.form.serialize();
            Session.register(data, (err: any, user: Genovesa.Models.User) => {
                
                if (err) {
                    for (var index in err.errors) {
                        if (err.errors[index].message == 'Already-in-use') {
                            this.errors.append($('<li>').append('Cette adresse email existe déjà dans notre base de données'));
                        } else {
                            this.errors.append($('<li>').append(err.errors[index].message));
                        }
                    }
                    return;
                }                

                this._user = user;
                this.resultAction = 'registered';
                this.result = Form.Result.yes;
            });
        }

        /**
         * Gets the registered user.
         *
         * @method
         * @ return {Genovesa.Models.User} The registered user, or null if the register step has been canceled.
         */
        public get user(): Genovesa.Models.User {
            return this._user;
        }
    }
}
