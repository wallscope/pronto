// TODO: on startup, save and import indexes to localstorage/indexeddb
import Fuse from 'fuse.js';
import jsonld from 'jsonld';
// import jsonld from './rdf-ontologies/ontologies/schema.json';
import { importNqFromPrefix } from './rdf-ontologies/loadDataset';
import { JsonLdArray, JsonLdObj } from 'jsonld/jsonld-spec';

/** Add the comment and label keys without a dot in the name to enable Fuse to search them */
const prepareData = (ontology: Array<object>) => {
  return ontology.map((obj: any) => {
    return {
      ...obj,
      comment: obj['http://www.w3.org/2000/01/rdf-schema#comment'],
      label: obj['http://www.w3.org/2000/01/rdf-schema#label'],
    };
  });
};

const fuseOptions: Fuse.IFuseOptions<unknown> = {
  includeScore: true,
  distance: 1000,
  // keys to search in
  keys: [
    {
      name: '@id',
      weight: 0.1,
    },
    {
      name: '@type',
      weight: 1,
    },
    {
      name: 'label.@value',
      weight: 1,
    },
    {
      name: 'comment.@value',
      weight: 0.5,
    },
  ],
};

let fuse: Fuse<unknown, Fuse.IFuseOptions<unknown>> | null = null;
export const prepareIndex = async () => {
  let jsonLdData: JsonLdArray | null = null;
  try {
    const file1 = await importNqFromPrefix('schema');
    const file2 = await importNqFromPrefix('vcard');
    const file = `${file1}${file2}`;

    const jsonLdOntologies = (await jsonld.fromRDF(file as any, {
      format: 'application/n-quads',
    })) as Array<{
      '@id': string; // ontology uri
      '@graph': Array<JsonLdObj>; // ontology triples
    }>;

    const flatData = jsonLdOntologies.flatMap(o => prepareData(o['@graph']));
    console.log('preparedData', flatData);

    // Create the Fuse index
    const myIndex = Fuse.createIndex(
      ['@id', '@type', 'label.@value', 'comment.@value'],
      flatData,
    );

    fuse = new Fuse(flatData, fuseOptions, myIndex);
  } catch (e) {
    console.log(e);
  }
};

export const search = (searchType: 'predicate' | 'type', searchWord: string) => {
  const formattedSearchType = searchType === 'predicate' ? 'Property$' : 'Class$';

  if (!fuse) return;
  console.log('custom search', fuse);
  return fuse.search({
    $and: [
      { '@type': formattedSearchType },
      { $or: [{ 'label.@value': searchWord }, { 'comment.@value': searchWord }] },
    ],
  });
};

// function tryParseJSON(jsonString: unknown) {
//   console.log('jsonString', typeof jsonString);
//   if (typeof jsonString !== 'string') return false;

//   try {
//     const o = JSON.parse(jsonString);
//     if (o && typeof o === 'object') {
//       return o;
//     }
//   } catch (e) {
//     // do nothing
//   }

//   return false;
// }

// // new tests
// let globalFuse: Fuse<unknown, Fuse.IFuseOptions<unknown>> | null = null;

// export const loadOntology = (ontology: unknown) => {
//   // Check if valid json
//   const jsonData = tryParseJSON(ontology);
//   console.log('jsonData', jsonData);
//   if (!jsonData) {
//     // TODO: implement non-json ontology parsing
//     console.log('not valid json data');
//     return;
//   }

//   // Prepare data - Add property names without a dot to enable Fuse to search them
//   const preparedData = jsonData.map((obj: any) => {
//     return {
//       ...obj,
//       comment: obj['http://www.w3.org/2000/01/rdf-schema#comment'],
//       label: obj['http://www.w3.org/2000/01/rdf-schema#label'],
//     };
//   });
//   globalFuse = new Fuse(preparedData, options);
// };
