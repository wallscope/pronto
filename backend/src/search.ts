// TODO: on startup, save and import indexes to localstorage/indexeddb
import Fuse from 'fuse.js';
import prefixes from './rdf-ontologies/prefixes';
import { importNqFromPrefix } from './rdf-ontologies/loadDataset';
import { JsonLdObj } from 'jsonld/jsonld-spec';

/** Add the comment and label keys without a dot in the name to enable Fuse to search them */
const prepareData = (ontology: {
  '@id': string; // ontology uri
  '@graph': Array<JsonLdObj>; // ontology triples
}) => {

  return ontology['@graph'].map((obj: any) => {
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
      weight: 0.5,
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

const mergedOntologies = async () => {
  const promises = Object.keys(prefixes).map(
    async p =>
      JSON.parse(await importNqFromPrefix(p)) as {
        '@id': string; // ontology uri
        '@graph': Array<JsonLdObj>; // ontology triples
      },
  );
  const ontologies = await Promise.all(promises);
  console.log('onto loaded');
  return ontologies;
};

let fuse: Fuse<unknown, Fuse.IFuseOptions<unknown>> | null = null;
export const prepareIndex = async () => {
  const jsonLdOntologies = await mergedOntologies();
  console.log('ontologies merged', jsonLdOntologies[0]);
  try {
    // const jsonLdOntologies = (await jsonld.fromRDF((await mergedOntologies()) as any, {
    //   format: 'application/n-quads',
    // })) as Array<{
    //   '@id': string; // ontology uri
    //   '@graph': Array<JsonLdObj>; // ontology triples
    // }>;
    // console.log('jsonLdOntologies', jsonLdOntologies);

    const flatData = jsonLdOntologies.flatMap(o => prepareData(o));
    console.log('data prepared');

    // Create the Fuse index
    const myIndex = Fuse.createIndex(
      ['@id', '@type', 'label.@value', 'comment.@value'],
      flatData,
    );
    console.log('index created');
    fuse = new Fuse(flatData, fuseOptions, myIndex);
  } catch (e) {
    console.log(e);
  }
};

export const search = (searchType: 'predicate' | 'type', searchWord: string) => {
  const formattedSearchType = searchType === 'predicate' ? 'Property$' : 'Class$';

  if (!fuse) return;
  console.log('custom search', fuse);
  return fuse.search(
    {
      $and: [
        { '@type': formattedSearchType },
        { $or: [{ 'label.@value': searchWord }, { 'comment.@value': searchWord }] },
      ],
    },
    { limit: 100 },
  );
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
