import stringToStream from 'string-to-stream';
import rdf from 'rdf-ext';
import prefixes from './prefixes';

import { Parser, Store, Quad_Object } from 'n3';

import { NamedNode, Stream } from 'rdf-js';
import { Readable } from 'stream';
// import { loadDatasetStream } from './loadDataset';

export async function loadDatasetStream(prefix: string) {
  return stringToStream((await import(`../ontologies/${prefix}.nq`)).default);
}

interface VocabulariesOptions {
  only?: string[] | null;
  factory?: typeof rdf;
}

interface VocabulariesDatasetOptions extends VocabulariesOptions {
  stream?: false;
}

interface VocabulariesStreamOptions extends VocabulariesOptions {
  stream: true;
}

// export async function vocabularies(options?: VocabulariesDatasetOptions): Promise<Datasets>;

// export async function vocabularies(
//   options: VocabulariesStreamOptions,
// ): Promise<Stream & Readable>;

export async function vocabularies(
  options: VocabulariesDatasetOptions | VocabulariesStreamOptions = {},
) {
  const { only = null, factory = rdf, stream = false } = options;
  let selectedPrefixes: string[] = [];

  if (!!only && Array.isArray(only)) {
    only.forEach((prefix: string) => {
      if (prefix in prefixes) {
        selectedPrefixes.push(prefix);
      } else {
        console.warn(`unknown prefix '${prefix}'`);
      }
    });
  }
  if (!selectedPrefixes.length) {
    selectedPrefixes = Object.keys(prefixes);
  }

  const promises = selectedPrefixes.map(prefix =>
    loadFile(prefix, { customSelection: !!only, factory }),
  );
  const datasets = await Promise.all(promises);

  if (stream !== false) {
    let combinedDataset = factory.dataset();
    datasets.forEach(dataset => {
      if (dataset && dataset.size) {
        combinedDataset = combinedDataset.merge(dataset);
      }
    });
    return combinedDataset.toStream();
  }

  const result: Datasets = {};
  datasets.forEach((dataset, i) => {
    if (dataset && dataset.size) {
      result[selectedPrefixes[i]] = dataset;
    }
  });
  return result;
}

interface LoadFileOptions {
  customSelection?: boolean;
  factory: typeof rdf;
}
export async function loadFile(prefix: string, { customSelection, factory }: LoadFileOptions) {
  const readStream = await loadDatasetStream(prefix);
  const quadStream = new Parser().parse(readStream);
  return factory
    .dataset()
    .import(quadStream)
    .catch(() => {
      if (customSelection) {
        console.warn(`unavailable prefix '${prefix}'`);
      }
    });
}
