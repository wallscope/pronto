## For local development

Set an environment variable in `.env` called `TRIPLESTORE` which points to a graph DB instance
(default is at http://192.168.36.230:5070/repositories/ontologySearcher).

Run with:

```
yarn start
```

## Run via Docker-compose

To relaunch all the components of the app in one go, use docker compose:

```
docker-compose up -d
```

## Start single Docker container

```
docker run --name ontology-searcher-api -p 5050:5050  -d wallscope/ontology-searcher-api
```

## Info

- API is on port 5050
- GraphDB is on port 5070
- Front-end is on port 5080
