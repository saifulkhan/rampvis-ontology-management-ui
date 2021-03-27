# RAMPVIS ONTOLOGY MANAGEMENT

This is an Angular-based user interface for RAMPVIS ontology management and operations.

## Getting Started

Key dependencies:

- Node version 14.15.4
- Angular 11+
- REST-API or backend server: https://github.com/ScottishCovidResponse/rampvis-api

Start development instance:
```
npm install
```

Start using development environment 

```bash
npx ng serve --host 0.0.0.0

```

Start using production environment 

```bash
npx ng serve -c production
```

Navigate to [localhost:4200](localhost:4200) to open the UI.


# Build

```bash
# TO CHECK
 npx ng build --prod --aot=false --build-optimizer=false --base-href /onto
```

# Notes

- **Firebase**- The Firebase package versions in the `package.json` and in `src/firebase-messaging-sw.js` should be consistent.
