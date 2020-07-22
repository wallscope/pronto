import Vue from 'vue';
import { OntologyResult, resultPrefixes } from '@/types';

export function getPrefixShort(s: string, invertedPrefixes: { [root: string]: string }) {
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

const getEnglishValue = (array: Array<{ '@value': string; '@language'?: string }>) => {
  if (!Array.isArray(array)) return '';
  return array.find(lObj => {
    // If no language tag is specified, return the first result (should be the only one)
    if (!lObj['@language']) return true;
    // otherwise return the english one
    else if (lObj['@language'] === 'en') return true;
  })?.['@value'];
};

export function addMetaData(results: Array<OntologyResult>) {
  return results.map((entity: any) => {
    return {
      ...entity,
      // meta is used for easier manipulation to display
      meta: {
        uri: entity['@id'],
        label: getEnglishValue(
          entity[resultPrefixes.label] || entity[resultPrefixes.prefLabel],
        ),
        comment: getEnglishValue(entity[resultPrefixes.comment]),
        definition: getEnglishValue(entity[resultPrefixes.definition]),
      },
    };
  });
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
