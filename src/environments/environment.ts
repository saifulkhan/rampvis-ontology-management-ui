// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  staging: false,
  configuration: 'development',
  components: {
    api: 'http://localhost:2000/api/v1',      // Node
    apiPy: 'http://localhost:3000/api-py/v1', // Python       
    sentry: ''
  },
  firebaseConfig: {
    apiKey: 'AIzaSyAlvl6-po-c5dp2HRToaARDWgfRjor9Lmc',
    authDomain: 'data-mining-7d9bf.firebaseapp.com',
    databaseURL: 'https://data-mining-7d9bf.firebaseio.com',
    projectId: 'data-mining-7d9bf',
    storageBucket: 'data-mining-7d9bf.appspot.com',
    messagingSenderId: '431207723497',
    appId: '1:431207723497:web:c328d72aab8082587a1b78',
    measurementId: 'G-FEFMQ1VJHW'
  }
};
