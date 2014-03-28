/// <reference path="definitions/references.d.ts"/>

module Genovesa {
    export class API {
        private static apiRoot = '/api';

        /**
         * Fetches the given resource with some parameters synchronously.
         * 
         * @param {String} resource
         * @param {String} data
         * @returns {String} the fetched data or an error
         * @author Gabriel Malkas
         */
        public static getSynch(url: string, data?: any, dataType: string = 'json') {
            var rcv;

            $.ajax({
                dataType: dataType,
                url: this.apiRoot + url,
                data: data,
                async: false,
                error: API.requestError,
                success: response => {
                    rcv = response;
                }
            });

            return rcv;
        }

        public static get(url: string, data?: any, dataType: string = 'json'): JQueryPromise<any> {
            return API.request('GET', url, data, dataType);
        }

        public static post(url: string, data?: any, dataType: string = 'json'): JQueryPromise<any> {
            return API.request('POST', url, data, dataType);
        }

        public static update(url: string, data?: any, dataType: string = 'json'): JQueryPromise<any> {
            return API.request('PUT', url, data, dataType);
        }

        public static destroy(url: string, data?: any, dataType: string = 'json'): JQueryPromise<any> {
            return API.request('DELETE', url, data, dataType);
        }

        private static request(type: string, url: string, data?: any, dataType: string = 'json'): JQueryPromise<any> {
            if (data === undefined) {
                data = {};
            }

            // FIXME!!
            data = API.handleCsrfToken(data);

            return $.ajax({
                type: type,
                url: API.apiRoot + url,
                data: data,
                dataType: dataType,
                error: API.requestError,
                success: (json, textStatus, jqXHR) => {
                    return json;
                }
            });
        }

        private static requestError(xhr, statusText, thrownError) {
            throw new Error(xhr + ':' + statusText + ':' + thrownError);
        }

        private static handleCsrfToken(data) {
            /*if (data === undefined || data === null) {
                data = {};
            }

            // Let's check if we need csrf token.
            var currentUser = Genovesa.Authentication._currentUser;

            if (currentUser && currentUser.isLoggedIn()) {
                // Add the token in the request body.
                if (typeof (data) == 'string') {
                    data += '&_csrfToken=' + currentUser.getCsrfToken();
                } else {
                    data._csrfToken = currentUser.getCsrfToken();
                }

                // Compute the token for the next request.
                currentUser.computeNextToken();
            }*/

            return data;
        }
    }
}
