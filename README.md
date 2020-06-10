# Pronto

Pronto is an open-source ontology search engine. It provides fuzzy search capabilities across a number of popular ontologies, originally selected from the [prefix.cc](https://prefix.cc/) user-curated "popular" list, along with others picked by Wallscope. The results are ordered by relevance and can be inspected, which drastically reduces the time spent searching ontologies manually.

## Getting Started

Check out this [demo](https://pronto.wallscope.co.uk/) to see Pronto in action.

The instructions below will get you a copy of the project up and running on your local machine for development and testing purposes. See the deployment section for notes on how to deploy the project on a live system.

First of all, clone the repo with `git clone git@github.com:wallscope/pronto.git`

### Prerequisites

- Node.js
- Yarn (or swap yarn commands with npm)
- Docker

## Development

To develop with Docker (recommended), run the command:

```
docker-compose up -d --build
```

To develop the individual parts of the stack, from different terminal instances run the commands `yarn install && yarn start` in the folders `frontend/` and `api/`. You will still need to run the database component separately.

## Deployment

### Docker

The quickest way to deploy Pronto is through Docker and its Compose tool.
From the root folder `pronto/` run:

```
docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml up --build
```

## Available Ontologies

- rdf: http://www.w3.org/1999/02/22-rdf-syntax-ns#
- rdfs: http://www.w3.org/2000/01/rdf-schema#
- owl: http://www.w3.org/2002/07/owl#
- dct: http://purl.org/dc/terms/
- skos: http://www.w3.org/2004/02/skos/core#
- madsrdf: http://www.loc.gov/mads/rdf/v1#
- dc: http://purl.org/dc/elements/1.1/
- vs: http://www.w3.org/2003/06/sw-vocab-status/ns#
- foaf: http://xmlns.com/foaf/0.1/
- schema: http://schema.org/
- wdrs: http://www.w3.org/2007/05/powder-s#
- cc: http://creativecommons.org/ns#
- vann: http://purl.org/vocab/vann/
- ov: http://open.vocab.org/terms/
- grddl: http://www.w3.org/2003/g/data-view#
- prov: http://www.w3.org/ns/prov#
- vcard: http://www.w3.org/2006/vcard/ns#
- bflc: http://id.loc.gov/ontologies/bflc/
- dbo: http://dbpedia.org/ontology/
- geosparql: http://www.opengis.net/ont/geosparql#
- sioc: http://rdfs.org/sioc/ns#
- dcat: http://www.w3.org/ns/dcat

### Add More Ontologies to the Graph

If you are running the project through Docker, you can access the database server on localhost on port `5070`.
Import more ontologies from the **Import** tab, then from the SPARQL tab update the Lucene index running this query in the database:

```
PREFIX luc: <http://www.ontotext.com/owlim/lucene#>
INSERT DATA { luc:myIndex luc:createIndex "true" . }
```

> If adding an ontology that you think will help other people, consider creating a pull request.

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
