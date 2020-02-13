#!/bin/bash

set -e # exit on error

scriptDir=$(dirname -- "$(readlink -f -- "$BASH_SOURCE")")

cd frontend

git checkout master
git pull

yarn build

rsync -av dist/* "$scriptDir/api/data/frontend/html/"

cd $scriptDir


# Only works for Docker >= 18.09
# export DOCKER_HOST="ssh://root@192.168.36.230:2022"

docker-compose -H "ssh://root@192.168.36.230:2022" up -d -V