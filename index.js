var restify = require('restify');
var axios = require('axios');
var qs = require('qs')

var server = restify.createServer();
server.use(restify.plugins.queryParser());

server.get('/predicate', async (req, res, next) => {
  try {
    const search = escape(req.query.search);

    let result = await axios.post('http://192.168.36.59:7200/repositories/ontologySearcher',
      qs.stringify({
        query: `
          PREFIX luc: <http://www.ontotext.com/owlim/lucene#>
          PREFIX dbo: <http://dbpedia.org/ontology/>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX dct: <http://purl.org/dc/terms/>
          PREFIX owl: <http://www.w3.org/2002/07/owl#>
          
          CONSTRUCT {
              ?preds	rdfs:label ?label ;
                  rdfs:comment ?comment ;
                  rdf:type rdf:Property ;
                  dct:source ?src . 
          } 
          WHERE { 
              {
                  BIND( rdfs:label as ?src )
                  ?preds	rdfs:label ?label ;
                          rdf:type rdf:Property .
          
                  ?label	luc:myIndex	"*${ search }*" .
          
                  OPTIONAL {
                      ?preds rdfs:comment ?comment .
                  }
              }
              UNION
              {
                  BIND( rdfs:comment as ?src )
                  
                  ?preds	rdfs:label ?label ;
                          rdf:type rdf:Property ;
                      rdfs:comment ?comment .
                  
                  ?comment luc:myIndex "*${ search }*" .
              }
          } 
        `
      }),
      {
        headers: { 'Accept': 'application/n-triples' }
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
    const search = escape(req.query.search);

    let result = await axios.post('http://192.168.36.59:7200/repositories/ontologySearcher',
      qs.stringify({
        query: `
          PREFIX owl: <http://www.w3.org/2002/07/owl#>
          PREFIX luc: <http://www.ontotext.com/owlim/lucene#>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX dct: <http://purl.org/dc/terms/>
          PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
          
          CONSTRUCT {
              ?s rdf:type ?type ;
                rdfs:label ?label ;
                rdfs:comment ?comment ;
                skos:definition ?definition ;
                dct:source ?src .
          }
          WHERE { 
              {
                  BIND( rdfs:label as ?src )
                  ?s rdfs:label ?label ;
                    rdf:type ?type .
                  
                  FILTER( ?type IN ( rdfs:Class, owl:Class ) ) .
                  
                  ?label luc:myIndex	"*${ search }*" .
          
                  OPTIONAL {
                      ?s rdfs:comment ?comment .
                  }
                  OPTIONAL {
                      ?s skos:definition ?definition .
                  }
              }
              UNION
              {
                  BIND( rdfs:comment as ?src )
                  
                  ?s      rdfs:label ?label ;
                          rdf:type ?type ;
                      rdfs:comment ?comment .
                  
                  FILTER( ?type IN ( rdfs:Class, owl:Class ) ) .
                  
                  ?comment luc:myIndex "*${ search }*" .
              }
          }        
        `
      }),
      {
        headers: { 'Accept': 'application/n-triples' }
      })

    res.send(result.data)

  } catch (_) {
    console.error('error in getting the triples')
    res.send('error in getting the triples')
  }

  next();
});

server.post('/foo', function (req, res, next) {
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