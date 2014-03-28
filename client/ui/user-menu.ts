/// <reference path="../definitions/references.d.ts"/>
/// <reference path="iview.ts"/>
/// <reference path="./forms/login-form.ts"/>
/// <reference path="./forms/register-form.ts"/>
/// <reference path="../template-factory.ts"/>
/// <reference path="../session.ts"/>
/// <reference path="./form-host.ts"/>

module Genovesa.UI {
    export class UserMenu implements IView {
        /** @var {JQuery} Underlying JQuery view. */
        private _view = TemplateFactory.create('user-menu');

        /** @var {FormHost} The form host that will be use to display the login and register forms. */
        private formHost: FormHost = null;
        
        /**
         * Creates an instance of UserMenu
         *
         * @constructor
         * @param {FomrHost} formHost The form host that will be use to display the login and register forms.
         */
        constructor(formHost: FormHost) {
            this.guest();
            this.formHost = formHost;

            // The user menu change according to the user state.
            Session.registerHandler('login', () => { this.logged(); });
            Session.registerHandler('logout', () => { this.guest(); });
        }

        public get view(): JQuery {
            return this._view;
        }

        /**
         * Sets the user menu to the 'guest' state: provides a button
         * to display the login form.
         */
        private guest(): void {
            var loginButton = TemplateFactory.create('user-menu/guest');
            loginButton.click(this.showLoginForm.bind(this).animationBound());

            this.view.empty();
            this.view.append(loginButton);
        }

        /**
         * Show the login form.
         *
         * @method
         * @param {JQueryEventObject} [e] An event data.
         */
        public showLoginForm(e?: JQueryEventObject): void {
            if (e) {
                e.preventDefault();
            }

            var form = new Forms.LoginForm();

            form.bind('end', () => {
                switch (form.result) {
                    case Forms.Form.Result.yes:
                        // No need to check the resultAction, as the only action that result as yes is 'login'.
                        this.showLoginWelcome(form.user);
                        break;
                    case Forms.Form.Result.no:
                        // No need to check the resultAction, as the only action that result as no is 'register'.
                        this.showRegisterForm();
                        break;
                    // default case is made by the close button
                }
            });

            this.formHost.showForm(form);
        }

        /**
         * Show the register form.
         *
         * @method
         * @param {JQueryEventObject} [e] An event data.
         */
        public showRegisterForm(e?: JQueryEventObject): void {
            if (e) {
                e.preventDefault();
            }

            var form = new Forms.RegisterForm();

            form.bind('end', () => {
                switch (form.result) {
                    case Forms.Form.Result.yes:
                        this.showRegisterSuccessForm(form.user);
                        break;
                    case Forms.Form.Result.no:
                        this.showLoginForm();
                        break;
                }
            });

            this.formHost.showForm(form);
        }

        /**
         * Show the register success form.
         *
         * @method
         * @param {Object} [e] An event data (non-used).
         */
        public showRegisterSuccessForm(user: Models.User): void {
            var notification = TemplateFactory.create('notification', {
                loader: false,
                content: 'Inscription réussie. Vous pouvez désormais vous connecter.'
            });

            notification.hide();
            this._view.append(notification);
            notification.fadeIn(150);

            setTimeout(() => {
                notification.fadeOut(150, () => {
                    notification.detach();
                });
            }, 5000);
        }

        /**
         * Sets the menu's state to logged-in with the given user.
         * Provides a logout button.
         *
         * @param {Genovesa.Models.User} user
         */
        public showLoginWelcome(user: Genovesa.Models.User): void {
            var notification = TemplateFactory.create('notification', {
                loader: false,
                content: 'Vous êtes désormais connecté en tant que ' + user.name + '.'
            });

            notification.hide();
            this._view.append(notification);
            notification.fadeIn(150);

            setTimeout(() => {
                notification.fadeOut(150, () => {
                    notification.detach();
                });
            }, 5000);
        }

        /**
         * Displays the user menu as logged.
         *
         * @method
         */
        public logged(): void {
            this.view.empty();
            this.view.append(TemplateFactory.create('user-menu/user'));
            this.view.find('[data-action=logout]').click((e) => {
                this.logout();
            });
        }

        /**
         * Logs the user out and resets the menu's state to guest.
         */
        public logout(): void {
            Genovesa.Session.logout((err) => {
                if (err) {
                    console.log(err);
                }

                var notification = TemplateFactory.create('notification', {
                    loader: false,
                    content: 'Vous êtes désormais déconnecté.'
                });

                notification.hide();
                this._view.append(notification);
                notification.fadeIn(150);

                setTimeout(() => {
                    notification.fadeOut(150, () => {
                        notification.detach();
                    });
                }, 5000);
            });
        }
    }
}
