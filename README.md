# Pronto

Pronto allows developers to search for **concepts** and **predicates** among a number of ontologies, originally selected from the prefix.cc user-curated list "popular", along with some others. The results are ordered by relevance and can be inspected, which drastically reduces the time spent searching ontologies manually.

## Getting Started

Check out this [demo](https://pronto.wallscope.co.uk/) to see Pronto in action.

The instructions below will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

- Vue-cli for the frontend. Install with `yarn global add @vue/cli`.

### Installing

1. Clone the repo with `git clone git@github.com:wallscope/pronto.git`
2. Run the command `yarn install && yarn start` in both the folders `frontend/` and `api/`

### Add More Ontologies to the Graph

## Deployment

Clone the repo to your deployment environment and build the frontend:

```
cd frontend
yarn install
yarn build
```

Then, place the content of `fronted/dist/` in the root `data/` folder. From the `frontend/` folder run:

```
mkdir -p ../data/frontend/html/ && mv dist/* $_
```

A quick way to deploy Pronto is through Docker. Once the above steps are completed, you can start the docker containers from the root `pronto/` folder using `docker-compose up -d`.

## Contributing

PRs are welcome! Please open an issue first to discuss what you would like to change :tada:

## Built With

- [Fomantic UI](https://fomantic-ui.com/) (fork of Semantic UI) - UI framework
- [Restify](http://restify.com/) - Node.js REST server based on Express

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [releases on this repository](https://github.com/wallscope/pronto/releases).

## Authors

- **Francesco Belvedere** - _Initial work_ - [Wallscope](https://wallscope.co.uk/)

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
