export interface OntologyResult {
  '@id': string;
  '@type': Array<string>;
  ontology: string;
  meta: {
    uri: string;
    label: string;
    comment?: string;
    definition?: string;
  };
  [key: string]: string | object | Array<object>;
}
export const resultPrefixes = {
  label: 'http://www.w3.org/2000/01/rdf-schema#label',
  prefLabel: 'http://www.w3.org/2004/02/skos/core#prefLabel',
  comment: 'http://www.w3.org/2000/01/rdf-schema#comment',
  definition: 'http://www.w3.org/2004/02/skos/core#definition',
};
