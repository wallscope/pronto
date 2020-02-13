### Deployment

Clone the repo to your deployment environment and run `git pull`.

Separately, build the frontend:

```
cd frontend
git checkout master
git pull
yarn build
```

and place the content of the fronted `dist` folder in the root `data/` folder (e.g. with `rsync -av dist/\* "../data/frontend/html/"`).

Finally, start the docker containers using `docker-compose up -d`.
