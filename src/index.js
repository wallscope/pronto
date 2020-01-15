require('dotenv').config();
const restify = require('restify');
const axios = require('axios');
const qs = require('qs');
const queries = require('./queries');

const server = restify.createServer();
server.use(restify.plugins.queryParser());

const getFromDb = async (queryFunction, req, res, next) => {
  try {
    const search = escape(req.query.search);
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
    console.error('error in getting the triples: ', e);
    res.send('error in getting the triples: ', e);
  }

  next();
};

server.get('/api/predicate', async (req, res, next) => {
  await getFromDb(queries.predQuery, req, res, next);
});

server.get('/api/type', async (req, res, next) => {
  await getFromDb(queries.typeQuery, req, res, next);
});

server.listen(5050, function() {
  console.log('%s listening at %s', server.name, server.url);
});
