// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { initializeApp } from "firebase/app";

export const environment = {
  firebase: {
    projectId: 'workonit-238d0',
    appId: '1:703316977461:web:f449a10e44125a8764ce7c',
    databaseURL: 'https://workonit-238d0-default-rtdb.asia-southeast1.firebasedatabase.app',
    storageBucket: 'workonit-238d0.appspot.com',
    apiKey: 'AIzaSyAgAcBu0PrL-JJjKkjMpCHW3lzC49nji74',
    authDomain: 'workonit-238d0.firebaseapp.com',
    messagingSenderId: '703316977461',
  },
  production: false
};
const app = initializeApp(environment.firebase);
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
