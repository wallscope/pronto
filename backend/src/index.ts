require('dotenv').config();
import restify from 'restify';
// import sqlite3 from 'sqlite3';
import queries from './queries';
import { search, prepareIndex } from './search';

prepareIndex();

const server = restify.createServer();
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser({ mapParams: false }));

// const feedbackDb = new sqlite3.Database('./feedback.db', err => {
//   if (err) {
//     console.error(err.message);
//   }
// });
// server.post('/api/feedback', async (req, res, next) => {
//   try {
//     feedbackDb.serialize(() => {
//       feedbackDb.run(queries.createFeedbackDb);
//       feedbackDb.run('INSERT INTO Feedback (comment) VALUES(?)', req.body.feedback);
//     });
//     res.send(200);
//   } catch (e) {
//     console.error(e);
//     res.send(e);
//   }
//   next();
// });

server.get('/api/:queryType', async (req, res, next) => {
  try {
    const queryType = escape(req.params.queryType);
    if (queryType !== 'predicate' && queryType !== 'type')
      throw Error('Search term not defined');
    const searchQuery = escape(req.query.search);
    if (!searchQuery) throw Error('Search term not defined');

    const searchRes = await search(queryType, searchQuery);
    res.send(searchRes);
  } catch (e) {
    console.error('error in getting the triples: ', e.message);
    res.send(500, `error in getting the triples: ${e}`);
  }
  next();
});
// server.get('/api/type', async (req, res, next) => {
//   await getFromDb(queries.typeQuery, req, res, next);
// });

server.listen(5050, () => {
  console.log('%s listening at %s', server.name, server.url);
});
