# About

This is a JavaScript and Angular-based application for RAMPVIS infrastructure management, e.g., data management, ontology management, semi-automatic propagation of visualisation, etc.

## Getting Started

### Prerequisites

- This is tested in Ubuntu 22.04
- Start the backend server; please visit https://github.com/ScottishCovidResponse/rampvis-api

### Start Development Instance

```bash
docker-compose up -d

# see log to check if the server has started
docker logs rampvis-ontology-ui --follow
```

Navigate to [localhost:4200](localhost:4200) to open the UI and login:

```bash
User: admin@test.com
Password: pass123
```

### Start Development Instance Locally

In order to start the UI server locally it require Node.js version 16.13.0+ installed in the local development machine.

Install dependencies and start.

```bash
npm install
npx ng serve
```

Navigate to [localhost:4200](localhost:4200) to open the UI and login:

```bash
User: admin@test.com
Password: pass123
```

## BibTeX

```bash
@article{Khan2022:IEEE-TVCG,,
   author = {Saiful Khan, Phong Nguyen, Alfie Abdul-Rahman, Benjamin Bach, Min Chen, Euan Freeman, and Cagatay Turkay},
   title = {Propagating Visual Designs to Numerous Plots and Dashboards},
   journal = {IEEE Transactions on Visualization and Computer Graphics},
   issue = {1},
   pages = {86-95},
   volume = {28},
   year = {2022},
   doi = {10.1109/TVCG.2021.3114828},
   arxiv = {https://arxiv.org/abs/2107.08882}
}
```

IEEE VIS 2021 [fast-forward video](https://www.youtube.com/watch?v=WVsrMdvjQlk&t=2s)

## Contact

URL: https://sites.google.com/view/rampvis/teams
Email: saiful.etc@gmail.com
