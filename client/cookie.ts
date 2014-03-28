module Genovesa {
    /**
     * Manages cookies in genovesa's client.
     *
     * @class 
     */
    export class Cookie {

        /**
         * Adds a new cookie.
         *
         * @method
         * @static
         * @param {String} name The name of the cookie.
         * @param {String} value The value of the cookie.
         * @param {Date} date The expiration date of the cookie.
         */
        public static add(name: string, value: string, date: Date = null): void {
            var expires = (date !== null) ? date.toUTCString() : '';

            document.cookie = name + "=" + value + "; expires=" + expires + "; path=/";
        }
        
        /**
         * Gets the value of a cookie.
         *
         * @method
         * @static
         * @param {String} name The name of the cookie.
         * @return The value of the named cookie. 
         */
        public static get(name: string): string {
            var nameEQ = name + "=";

            var ca = document.cookie.split(';');

            for (var i = 0; i < ca.length; ++i) {
                var c = ca[i];

                while (c.charAt(0) == ' ') {
                    c = c.substring(1, c.length);
                }

                if (c.indexOf(nameEQ) == 0) {
                    return c.substring(nameEQ.length, c.length);
                }
            }

            return null;
        }

        /**
         * Sets the email of the user in case he checked 'remember me' in the login form.
         *
         * @method
         * @static
         * @param {String} value The email of the newly signed user.
         */
        public static setEmail(value: string): void {
            // Note: this will be deprecated in 2020
            Cookie.add('email', value, new Date(2020, 1));
        }

        /** 
         * Gets the email of the last user.
         *
         * @method
         * @return {String} The email of the last user that checked 'remember me' in the login form.
         */
        public static getEmail(): string {
            return Cookie.get('email');
        }
    }
}