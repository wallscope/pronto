## For local development

Run with:

```
yarn start
```

## To deploy

```
cd /home/pronto/
git pull
docker-compose up -d    # relaunch all the components of the app in one go
```

## Start single Docker container

```
docker run --name pronto-api -p 5050:5050  -d wallscope/pronto
```

## Info

- API runs on port 5050
- GraphDB runs on port 5070
- Front-end runs on port 5080
