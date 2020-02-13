# Pronto

Pronto allows developers to search for **concepts** and **predicates** among a number of ontologies, originally selected from the prefix.cc user-curated list "popular", along with some others. The results are ordered by relevance and can be inspected, which drastically reduces the time spent searching ontologies manually.

## Getting Started

Check out this [demo](https://pronto.wallscope.co.uk/) to see Pronto in action.

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
Give examples
```

### Installing

A step by step series of examples that tell you how to get a development env running

Say what the step will be

```
Give the example
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

## Deployment

Clone the repo to your deployment environment and run `git pull`.

Separately, build the frontend:

```
cd frontend
yarn install
yarn build
```

and place the content of `fronted/dist/` in the root `data/` folder (e.g. with `mkdir -p ../data/frontend/html/ && mv dist/* $_`).

Finally, start the docker containers from the root `pronto/` folder using `docker-compose up -d`.

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
