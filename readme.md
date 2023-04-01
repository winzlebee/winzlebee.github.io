## Win Holzapfel personal website

This repository contains my website, with a gitlab actions configuration to compile dynamic parts into static HTML. Currently the only dynamic part is the blog website

## Deployment

The deployment file is `.github/workflows/static-deploy.yml`. It simply compiles the hugo website under `blog/` into `home/` then deploys the resulting pages