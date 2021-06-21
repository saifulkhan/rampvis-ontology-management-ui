# RAMPVIS ONTOLOGY MANAGEMENT

This is an Angular-based user interface for RAMPVIS operations, e.g., data and ontology management, propagation, etc. The key dependencies are,

- Node version 14.17.1
- Angular 12
- REST-API or backend server: https://github.com/ScottishCovidResponse/rampvis-api


## Getting Started

> Start the backend [server](https://github.com/ScottishCovidResponse/rampvis-api)

```bash
npm install
npx ng serve 
```

> Note. To access from local network add '--host 0.0.0.0'

Navigate to [localhost:4200](localhost:4200) to open the UI.


## Build

```bash
npx ng build --configuration production
```

## Notes

**Firebase**- The Firebase package versions in the `package.json` and in `src/firebase-messaging-sw.js` should be consistent.
