# Pronto

## Deployment

Clone the repo to your deployment environment and run `git pull`.

Separately, build the frontend:

```
cd frontend
yarn install
yarn build
```

and place the content of `fronted/dist/` in the root `data/` folder (e.g. with `mkdir -p ../data/frontend/html/ && mv dist/* $_`).

Finally, start the docker containers from the root `pronto/` folder using `docker-compose up -d`.

## Development

PRs that add more ontologies and improvements are welcome! :tada:
