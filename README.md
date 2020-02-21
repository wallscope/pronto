# Pronto

Pronto allows developers to search for **concepts** and **predicates** among a number of ontologies, originally selected from the prefix.cc user-curated list "popular", along with some others. The results are ordered by relevance and can be inspected, which drastically reduces the time spent searching ontologies manually.

## Getting Started

Check out this [demo](https://pronto.wallscope.co.uk/) to see Pronto in action.

The instructions below will get you a copy of the project up and running on your local machine for development and testing purposes. See the deployment section for notes on how to deploy the project on a live system.

### Prerequisites

- Node.js
- Yarn (or swap yarn commands with npm)

### Installing

1. Clone the repo with `git clone git@github.com:wallscope/pronto.git`
2. From different terminal instances, run the commands `yarn install && yarn start` in the folders `frontend/` and `api/`

## Deployment

Clone the repo to your deployment environment and build the frontend:

```
cd frontend
yarn install
yarn build
```

### Docker

The quickest way to deploy Pronto is through Docker.
First, place the content of `fronted/dist/` in the folder `data/`, contained in the root folder. From the `frontend/` folder run:

```
mkdir -p ../data/frontend/html/ && rsync -a dist/* $_
```

Then, you can start the docker containers from the `pronto/` root folder using:

```
docker-compose up -d
```

## Add More Ontologies to the Graph

`To be completed`

Update the Lucene index running this query in the database:

```
PREFIX luc: <http://www.ontotext.com/owlim/lucene#>
INSERT DATA { luc:myIndex luc:createIndex "true" . }
```

## Contributing

PRs are welcome! :tada: Please open an issue first to discuss what you would like to change.

## Built With

- [Semantic UI](https://semantic-ui.com/) - UI framework
- [Restify](http://restify.com/) - Node.js REST server based on Express

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [releases on this repository](https://github.com/wallscope/pronto/releases).

## Authors

- **Francesco Belvedere** - _Ideator and creator_ - [Wallscope](https://wallscope.co.uk/)

See also the list of [contributors](https://github.com/wallscope/pronto/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

### Available ontologies

- rdf
- rdfs
- foaf
- schema
- geo
- dbo
- dbp
- owl
- skos
- xsd
- vcard
- dcat
- dc
- dcterms
- madsrdf
- bflc
