import Vue from 'vue';

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
