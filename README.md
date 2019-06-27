## For local development
```
TRIPLESTORE="http://192.168.36.230:5070/repositories/ontologySearcher" nodemon index.js
```
! Make sure to select the right endpoint from `utils.js` for development or deployment !

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
