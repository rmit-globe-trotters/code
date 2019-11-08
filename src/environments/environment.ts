// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyDfgxgPhFch5u1QvHeh9Q310nLdNIkZ16Y',
    authDomain: 'globe-trotters.firebaseapp.com',
    databaseURL: 'https://globe-trotters.firebaseio.com',
    projectId: 'globe-trotters',
    storageBucket: 'globe-trotters.appspot.com',
    messagingSenderId: '736938984677',
    appId: '1:736938984677:web:9c278035abbf7ba4c2c00c',
    measurementId: 'G-P9TY90J788'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error'; // Included with Angular CLI.
