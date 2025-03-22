this.workbox = this.workbox || {};
this.workbox.googleAnalytics = (function (exports,Plugin_mjs,cacheNames_mjs,Route_mjs,Router_mjs,NetworkFirst_mjs,NetworkOnly_mjs) {
     'use strict';

     try {
       self.workbox.v['workbox:google-analytics:3.6.3'] = 1;
     } catch (e) {} // eslint-disable-line

     /*
      Copyright 2017 Google Inc. All Rights Reserved.
      Licensed under the Apache License, Version 2.0 (the "License");
      you may not use this file except in compliance with the License.
      You may obtain a copy of the License at

          http://www.apache.org/licenses/LICENSE-2.0

      Unless required by applicable law or agreed to in writing, software
      distributed under the License is distributed on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
      See the License for the specific language governing permissions and
      limitations under the License.
     */

     const QUEUE_NAME = 'workbox-google-analytics';
     const MAX_RETENTION_TIME = 60 * 48; // Two days in minutes
     const GOOGLE_ANALYTICS_HOST = 'www.google-analytics.com';
     const GTM_HOST = 'www.googletagmanager.com';
     const ANALYTICS_JS_PATH = '/analytics.js';
     const GTAG_JS_PATH = '/gtag/js';

     // This RegExp matches all known Measurement Protocol single-hit collect
     // endpoints. Most of the time the default path (/collect) is used, but
     // occasionally an experimental endpoint is used when testing new features,
     // (e.g. /r/collect or /j/collect)
     const COLLECT_PATHS_REGEX = /^\/(\w+\/)?collect/;

     /*
      Copyright 2017 Google Inc. All Rights Reserved.
      Licensed under the Apache License, Version 2.0 (the "License");
      you may not use this file except in compliance with the License.
      You may obtain a copy of the License at

          http://www.apache.org/licenses/LICENSE-2.0

      Unless required by applicable law or agreed to in writing, software
      distributed under the License is distributed on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
      See the License for the specific language governing permissions and
      limitations under the License.
     */

     /**
      * Promisifies the FileReader API to await a text response from a Blob.
      *
      * @param {Blob} blob
      * @return {Promise<string>}
      *
      * @private
      */
     const getTextFromBlob = (() => {
       var _ref = babelHelpers.asyncToGenerator(function* (blob) {
         // This usage of `return await new Promise...` is intentional to work around
         // a bug in the transpiled/minified output.
         // See https://github.com/GoogleChrome/workbox/issues/1186
         return yield new Promise(function (resolve, reject) {
           const reader = new FileReader();
           reader.onloadend = function () {
             return resolve(reader.result);
           };
           reader.onerror = function () {
             return reject(reader.error);
           };
           reader.readAsText(blob);
         });
       });

       return function getTextFromBlob(_x) {
         return _ref.apply(this, arguments