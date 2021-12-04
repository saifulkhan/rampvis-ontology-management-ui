# RAMPVIS Ontology Management & Propagation UI

This is an Angular-based user interface for RAMPVIS operations, e.g., data and ontology management, propagation, etc. The key dependencies are,

- Node version 16.13.0
- Angular 12
- REST-API or backend server: https://github.com/ScottishCovidResponse/rampvis-api

## Getting Started

> Start the backend [server](https://github.com/ScottishCovidResponse/rampvis-api) first.

Install dependent packages and start the UI server,

```bash
npm install
npx ng serve
```

> Note. To access from local network add '--host 0.0.0.0'

Navigate to [localhost:4200](localhost:4200) to open the UI.

## BibTeX

```sh
@ARTICLE{Khan2021:IEEE-TVCG,
  author= {Khan, Saiful and Nguyen, Phong H. and Abdul-Rahman, Alfie and Bach, Benjamin and Chen, Min and Freeman, Euan and Turkay, Cagatay},
  title= {Propagating Visual Designs to Numerous Plots and Dashboards},
  journal= {IEEE Transactions on Visualization and Computer Graphics},
  year={2021},
  doi={10.1109/TVCG.2021.3114828}}
```

IEEE VIS 2021 Conference: [fast-forward](https://www.youtube.com/watch?v=WVsrMdvjQlk&t=2s) & [main presentation](https://www.youtube.com/watch?v=w2FoWyMrAYM&t=4s)
