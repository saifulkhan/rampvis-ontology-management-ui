export const environment: any = {
    production: true,
    staging: false,
    configuration: 'production',
    components: {
        API_JS: 'http://vis.scrc.uk/api/v1', // Node
        API_PY: 'http://vis.scrc.uk/stat/v1', // Python
        sentry: '',
        VIS_URL: 'http://vis.scrc.uk/page?id=',
    },
    firebaseConfig: {
        apiKey: 'xx',
        authDomain: 'xx',
        databaseURL: 'xx',
        projectId: 'xx',
        storageBucket: 'xx',
        messagingSenderId: 'xx',
        appId: 'xx',
        measurementId: 'xx',
    },
};
