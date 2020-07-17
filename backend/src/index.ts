require('dotenv').config();
import restify from 'restify';
import sqlite3 from 'sqlite3';
import { search, prepareIndex } from './search';
import { RequestParamError } from './utils/errors';
import prefixes from './rdf-ontologies/prefixes';

// SETUP
prepareIndex();

const server = restify.createServer();
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser({ mapParams: false }));

const feedbackDb = new sqlite3.Database('./feedback.db', err => {
  if (err) {
    console.error(err.message);
  }
});
const createFeedbackTable = `
  CREATE TABLE IF NOT EXISTS Feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment TEXT NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
  );
`;

// ROUTES
server.get('/api/:searchType', async (req, res, next) => {
  try {
    const searchType = req.params.searchType;
    if (searchType !== 'predicate' && searchType !== 'type')
      throw new RequestParamError('Search term not defined');
    const searchQuery = req.query.search;
    if (!searchQuery) throw new RequestParamError('Search term not defined');
    const ontologies = req.query.ontologies;
    if (!Array.isArray(ontologies) || !ontologies.length)
      throw new RequestParamError('No ontology was selected');

    const searchRes = await search({ searchType, searchQuery, ontologies });
    res.send(searchRes);
  } catch (e) {
    if (e instanceof RequestParamError) res.send(400, e.message);
    else res.send(500, e.message);
  }
  next();
});
server.get('/api/ontology-list', async (req, res, next) => {
  try {
    res.send(prefixes);
  } catch (e) {
    res.send(500, e.message);
  }
  next();
});

server.post('/api/feedback', async (req, res, next) => {
  try {
    feedbackDb.serialize(() => {
      feedbackDb.run(createFeedbackTable);
      feedbackDb.run('INSERT INTO Feedback (comment) VALUES(?)', req.body.feedback);
    });
    res.send(200);
  } catch (e) {
    console.error(e);
    res.send(e);
  }
  next();
});

server.listen(5050, () => {
  console.log('%s listening at %s', server.name, server.url);
});
