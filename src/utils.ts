import Vue from 'vue';

export const prefixes = {
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  owl: 'http://www.w3.org/2002/07/owl#',
  a: 'http://proton.semanticweb.org/protonsys#',
  dct: 'http://purl.org/dc/terms/',
  skos: 'http://www.w3.org/2004/02/skos/core#',
  madsrdf: 'http://www.loc.gov/mads/rdf/v1#',
  dc: 'http://purl.org/dc/elements/1.1/',
  vs: 'http://www.w3.org/2003/06/sw-vocab-status/ns#',
  foaf: 'http://xmlns.com/foaf/0.1/',
  schema: 'http://schema.org/',
  wdrs: 'http://www.w3.org/2007/05/powder-s#',
  cc: 'http://creativecommons.org/ns#',
  vann: 'http://purl.org/vocab/vann/',
  ov: 'http://open.vocab.org/terms/',
  grddl: 'http://www.w3.org/2003/g/data-view#',
  prov: 'http://www.w3.org/ns/prov#',
  vcard: 'http://www.w3.org/2006/vcard/ns#',
};

export const navigateToExternal = (url: string) => {
  // TODO: Persist results if user navigates away and goes back to the website
  window.open(url, '_blank');
};

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
