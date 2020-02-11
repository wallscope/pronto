const predQuery = searchTerm =>
  `
    PREFIX luc: <http://www.ontotext.com/owlim/lucene#>
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>

    CONSTRUCT {
        ?preds 	dct:source ?src ;
            ?otherPreds ?otherObjs .
    } 
    WHERE { 
        {
            BIND( rdfs:label as ?src )
            ?preds	rdfs:label ?label ;
                    rdf:type  rdf:Property ;
                    ?otherPreds ?otherObjs .

            ?label	luc:myIndex	"*${searchTerm}*" .

            FILTER(langMatches(lang(?label), "EN") || lang(?label) = '' )

            OPTIONAL {
                ?preds rdfs:comment ?comment .
                FILTER(langMatches(lang(?comment), "EN") || lang(?comment) = '' )
            }
        }
        UNION
        {
            BIND( rdfs:comment as ?src )

            ?preds	rdfs:label ?label ;
                    rdfs:comment ?comment ;
                    rdf:type  rdf:Property ;
                    ?otherPreds ?otherObjs .

            ?comment luc:myIndex "*${searchTerm}*" .

            FILTER(langMatches(lang(?label), "EN") || lang(?label) = '' )
            FILTER(langMatches(lang(?comment), "EN") || lang(?comment) = '' )
        }
    }
  `;

const typeQuery = searchTerm =>
  `
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX luc: <http://www.ontotext.com/owlim/lucene#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    
    CONSTRUCT {
        ?s  dct:source ?src ;
            ?otherPreds ?otherObjs .
    }
    WHERE { 
        {
            BIND( rdfs:label as ?src )
            ?s  rdfs:label ?label ;
                rdf:type ?type ;
                ?otherPreds ?otherObjs .
    
            FILTER( ?type IN ( rdfs:Class, owl:Class ) )
            FILTER(langMatches(lang(?label), "EN") || lang(?label) = '' )
    
            ?label luc:myIndex	"*${searchTerm}*" .
    
            OPTIONAL {
                ?s rdfs:comment ?comment .
                FILTER(langMatches(lang(?comment), "EN") || lang(?comment) = '' )
            }
            OPTIONAL {
                ?s skos:definition ?definition .
                FILTER(langMatches(lang(?definition), "EN") || lang(?definition) = '' )
            }
        }
        UNION
        {
            BIND( rdfs:comment as ?src )
    
            ?s  rdfs:label ?label ;
                rdf:type ?type ;
                rdfs:comment ?comment ;
                ?otherPreds ?otherObjs .
    
            FILTER( ?type IN ( rdfs:Class, owl:Class ) )
            FILTER(langMatches(lang(?label), "EN") || lang(?label) = '' )
            FILTER(langMatches(lang(?comment), "EN") || lang(?comment) = '' )
    
            ?comment luc:myIndex "*${searchTerm}*" .
        }
    }
  `;

module.exports = {
  predQuery,
  typeQuery,
};
