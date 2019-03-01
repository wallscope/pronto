var restify = require('restify');
var axios = require('axios');
var qs = require('qs')

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = restify.createServer();
server.use(restify.plugins.queryParser());

server.get('/predicate', async (req, res, next) => {
  try {
    const search = req.query.search;

    let result = await axios.post('http://192.168.36.59:7200/repositories/ontologySearcher', 
      qs.stringify({
        query: `
        PREFIX luc: <http://www.ontotext.com/owlim/lucene#>
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        
        CONSTRUCT {
          ?preds	rdfs:label ?label ;
                rdfs:comment ?comment ;
                rdfs:type ?type .
        } 
        WHERE { 
          ?preds	rdfs:label ?label ;
                   rdf:type ?type .
          ?label	luc:myIndex	"*${ search }*" .
            
            OPTIONAL {
              ?preds rdfs:comment ?comment .
            }
        } 
        `
        }),
        { headers: { 'Accept': 'application/n-triples' }
      })
      
    res.send(result.data)

  } catch (_) {
    console.error('error in getting the triples')
    res.send('error in getting the triples')
  }
  
  next();
});

server.get('/type', async (req, res, next) => {
  // TODO: the search word is only searched in the label. It should be searched also in the comment and definition
  try {
    const search = req.query.search;

    let result = await axios.post('http://192.168.36.59:7200/repositories/ontologySearcher', 
      qs.stringify({
        query: `
          PREFIX owl: <http://www.w3.org/2002/07/owl#>
          PREFIX luc: <http://www.ontotext.com/owlim/lucene#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

          CONSTRUCT {
              ?s rdf:type owl:Class ;
                rdfs:label ?label ;
                rdfs:comment ?comment ;
                skos:definition ?definition .
          }
          WHERE { 
              ?s rdf:type owl:Class ;
                rdfs:label ?label .
              ?label luc:myIndex	"${ search }" .
              
              OPTIONAL {
                ?s rdfs:comment ?comment .
              }
              OPTIONAL {
                ?s skos:definition ?definition .
              }
          }
        `
        }),
        { headers: { 'Accept': 'application/n-triples' }
      })
      
    res.send(result.data)

  } catch (_) {
    console.error('error in getting the triples')
    res.send('error in getting the triples')
  }
  
  next();
});

server.post('/foo',  function (req, res, next) {
    req.someData = 'foo';
    return next();
  },
  function (req, res, next) {
    res.send(req.someData);
    return next();
  }
);



// server.all('/*', function(req, res, next) {
//   // CORS headers
//   res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//   // Set custom headers for CORS
//   res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
//   if (req.method == 'OPTIONS') {
//     res.status(200).end();
//   } else {
//     next();
//   }
// });



server.listen(8082, function () {
  console.log('%s listening at %s', server.name, server.url);
});