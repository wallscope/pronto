require('dotenv').config();
const restify = require('restify');
const axios = require('axios');
const qs = require('qs');
const sqlite3 = require('sqlite3').verbose();
const queries = require('./queries');

const server = restify.createServer();
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser({ mapParams: false }));

const feedbackDb = new sqlite3.Database('./feedback.db', err => {
  if (err) {
    console.error(err.message);
  }
});

const getFromDb = async (queryFunction, req, res, next) => {
  try {
    const search = escape(req.query.search);
    if (!search) throw Error('Search term not defined');
    const result = await axios.post(
      process.env.TRIPLESTORE,
      qs.stringify({
        query: queryFunction(search),
      }),
      {
        headers: { Accept: 'application/n-triples' },
      },
    );
    res.send(result.data);
  } catch (e) {
    console.error('error in getting the triples: ', e.message);
    res.send(`error in getting the triples: ${e}`);
  }
  next();
};

server.get('/api/predicate', async (req, res, next) => {
  await getFromDb(queries.predQuery, req, res, next);
});
server.get('/api/type', async (req, res, next) => {
  await getFromDb(queries.typeQuery, req, res, next);
});

server.post('/api/feedback', async (req, res, next) => {
  try {
    feedbackDb.serialize(() => {
      feedbackDb.run(queries.createFeedbackDb);
      feedbackDb.run('INSERT INTO Feedback (comment) VALUES(?)', req.body.feedback);
    });
    res.send(200);
  } catch (e) {
    console.error(e);
    res.send(e);
  }
  next();
});

server.listen(5050, function() {
  console.log('%s listening at %s', server.name, server.url);
});
