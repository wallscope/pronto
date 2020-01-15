## For local development

Set an environment variable in `.env` called `TRIPLESTORE` which points to a graph DB instance, then:

```
yarn start
```

## Run via Docker-compose

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
