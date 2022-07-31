// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment: any = {
  production: false,
  staging: false,
  configuration: "development",
  components: {
    API_JS: "http://localhost:4000/api/v1", // Node
    API_PY: "http://localhost:4010/stat/v1", // Python
    sentry: "",
    VIS_URL: "http://localhost:3000/page?id=",
  },
  firebaseConfig: {
    apiKey: "xx",
    authDomain: "xx",
    databaseURL: "xx",
    projectId: "xx",
    storageBucket: "xx",
    messagingSenderId: "xx",
    appId: "xx",
    measurementId: "xx",
  },
};
