export interface OntologyResult {
  uri: string;
  label: string;
  comment?: string;
  definition?: string;
  [key: string]: string | undefined;
}
export const resultPrefixes = {
  label: 'http://www.w3.org/2000/01/rdf-schema#label',
  comment: 'http://www.w3.org/2000/01/rdf-schema#comment',
  definition: 'http://www.w3.org/2004/02/skos/core#definition',
};
