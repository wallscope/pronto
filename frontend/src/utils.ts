import Vue from 'vue';

export const prefixes = {
  as: 'http://www.w3.org/ns/activitystreams#',
  bflc: 'http://id.loc.gov/ontologies/bflc/',
  cc: 'http://creativecommons.org/ns#',
  cnt: 'http://www.w3.org/2011/content#',
  csvw: 'http://www.w3.org/ns/csvw#',
  dbo: 'http://dbpedia.org/ontology/',
  dc11: 'http://purl.org/dc/elements/1.1/',
  dcat: 'http://www.w3.org/ns/dcat#',
  dcterms: 'http://purl.org/dc/terms/',
  dqv: 'http://www.w3.org/ns/dqv#',
  dtype: 'http://www.linkedmodel.org/schema/dtype#',
  duv: 'http://www.w3.org/ns/duv#',
  foaf: 'http://xmlns.com/foaf/0.1/',
  frbr: 'http://purl.org/vocab/frbr/core#',
  geo: 'http://www.opengis.net/ont/geosparql#',
  geof: 'http://www.opengis.net/def/function/geosparql/',
  geor: 'http://www.opengis.net/def/rule/geosparql/',
  gn: 'http://www.geonames.org/ontology#',
  gr: 'http://purl.org/goodrelations/v1#',
  grddl: 'http://www.w3.org/2003/g/data-view#',
  gtfs: 'http://vocab.gtfs.org/terms#',
  http: 'http://www.w3.org/2011/http#',
  hydra: 'http://www.w3.org/ns/hydra/core#',
  ical: 'http://www.w3.org/2002/12/cal/icaltzd#',
  ldp: 'http://www.w3.org/ns/ldp#',
  lvont: 'http://lexvo.org/ontology#',
  ma: 'http://www.w3.org/ns/ma-ont#',
  madsrdf: 'http://www.loc.gov/mads/rdf/v1#',
  oa: 'http://www.w3.org/ns/oa#',
  og: 'http://ogp.me/ns#',
  org: 'http://www.w3.org/ns/org#',
  ov: 'http://open.vocab.org/terms/',
  owl: 'http://www.w3.org/2002/07/owl#',
  prov: 'http://www.w3.org/ns/prov#',
  qb: 'http://purl.org/linked-data/cube#',
  qudt: 'http://qudt.org/schema/qudt/',
  qudtv: 'http://qudt.org/vocab/qudt/',
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdau: 'http://rdaregistry.info/Elements/u/',
  rdfa: 'http://www.w3.org/ns/rdfa#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  rr: 'http://www.w3.org/ns/r2rml#',
  rss: 'http://purl.org/rss/1.0/',
  sem: 'http://semanticweb.cs.vu.nl/2009/11/sem/',
  schema: 'http://schema.org/',
  sd: 'http://www.w3.org/ns/sparql-service-description#',
  sdmx: 'http://purl.org/linked-data/sdmx#',
  sh: 'http://www.w3.org/ns/shacl#',
  sioc: 'http://rdfs.org/sioc/ns#',
  skos: 'http://www.w3.org/2004/02/skos/core#',
  skosxl: 'http://www.w3.org/2008/05/skos-xl#',
  sosa: 'http://www.w3.org/ns/sosa/',
  ssn: 'http://www.w3.org/ns/ssn/',
  time: 'http://www.w3.org/2006/time#',
  vaem: 'http://www.linkedmodel.org/schema/vaem#',
  vann: 'http://purl.org/vocab/vann/',
  vcard: 'http://www.w3.org/2006/vcard/ns#',
  void: 'http://rdfs.org/ns/void#',
  vs: 'http://www.w3.org/2003/06/sw-vocab-status/ns#',
  wdrs: 'http://www.w3.org/2007/05/powder-s#',
  wgs: 'http://www.w3.org/2003/01/geo/wgs84_pos#',
  xhv: 'http://www.w3.org/1999/xhtml/vocab#',
  xkos: 'http://rdf-vocabulary.ddialliance.org/xkos#',
  xsd: 'http://www.w3.org/2001/XMLSchema#',
};

/** Create an object that has URIs as keys and short prefix as value */
export const invertedPrefixes = Object.entries(prefixes).reduce((acc, entry) => {
  const [key, value] = entry;
  acc[value] = key;
  return acc;
}, {} as { [root: string]: string });

export function getPrefixShort(s: string) {
  try {
    const re = s.match(/(\/|#)(?:.(?!\/|#))+$/);
    if (!re) return s;
    const [root, prop] = [s.slice(0, re['index']! + 1), s.slice(re['index']! + 1)];
    if (!invertedPrefixes[root]) return s;
    return `${invertedPrefixes[root]}:${prop}`;
  } catch {
    return s;
  }
}

export async function copyToClipboard(text: string) {
  try {
    await copyToClipboardInternals(text);
    Vue.toasted.show('copied to clipboard');
  } catch (_) {
    Vue.toasted.show('could not copy (browser might be incompatible)');
  }
}
export function copyToClipboardInternals(text: string) {
  if (window.clipboardData && window.clipboardData.setData) {
    // IE specific code path to prevent textarea being shown while dialog is visible.
    return window.clipboardData.setData('Text', text);
  }

  if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
    const textarea = document.createElement('textarea');
    textarea.textContent = text;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in MS Edge.
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand('copy'); // Security exception may be thrown by some browsers.
    } catch (ex) {
      // @ts-ignore
      throw Error('Copy to clipboard failed.', ex);
    } finally {
      document.body.removeChild(textarea);
    }
  }
}
