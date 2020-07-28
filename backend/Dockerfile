FROM node:12-alpine as build

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

# To ensure that all of the application files are owned by the non-root node user, 
# including the contents of the node_modules directory, switch the user to node
USER node

RUN npm install

COPY --chown=node:node . .

RUN npm run build

RUN npm prune --production

# Necessary since typescript does not keep json files that are not imported with es6
COPY ./src/rdf-ontologies/ontologies ./build/rdf-ontologies/ontologies



FROM node:12-alpine as production

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

COPY --chown=node:node --from=build /home/node/app/node_modules/ ./node_modules/

# copy the application code with the appropriate permissions to the application directory on the container
COPY --chown=node:node --from=build /home/node/app/build/ ./ 

EXPOSE 5050

CMD [ "npx", "nodemon", "index.js" ]