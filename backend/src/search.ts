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
  return ontology['@graph'].map((obj: any) => ({
    ontology: ontology['@id'],
    label: obj['http://www.w3.org/2000/01/rdf-schema#label'] as Array<object> | undefined,
    comment: obj['http://www.w3.org/2000/01/rdf-schema#comment'] as Array<object> | undefined,
    // type: obj['@type'] as Array<string>,
    // originalObject: [obj],
    ...obj,
  }));
};

const fuseOptions: Fuse.IFuseOptions<unknown> = {
  includeScore: true,
  distance: 1000,
  // keys to search in
  keys: [
    {
      name: 'ontology',
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
    {
      name: '@id',
      weight: 0.5,
    },
    {
      name: '@type',
      weight: 1,
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
  console.log('ontologies merged');
  try {
    const flatData = jsonLdOntologies.flatMap(o => prepareData(o));
    console.log('1 data prepared', flatData[400]);

    // // Create the Fuse index
    const myIndex = Fuse.createIndex(
      ['ontology', 'label.@value', 'comment.@value', '@id', '@type'],
      flatData,
    );
    console.log('index created');
    fuse = new Fuse(flatData, fuseOptions, myIndex);
  } catch (e) {
    console.log(e);
  }
};

export const search = (searchType: 'predicate' | 'type', searchWord: string) => {
  // "$" tells fuse what word the searched "type" needs to end with
  const formattedSearchType = searchType === 'predicate' ? 'Property$' : 'Class$';

  if (!fuse) return;
  console.log('custom search', fuse);

  // Object.values(prefixes).map((p, i) => {
  //         if (i > 60) return { ontology: `'${p}` };
  //         else return { ontology: `'sdfsadf` };
  //       }),

  const searchOptions:
    | string
    | {
        [key: string]: string;
      }
    | {
        $and?: Fuse.Expression[] | undefined;
      }
    | {
        $or?: Fuse.Expression[] | undefined;
      } = {
    $and: [
      { '@type': formattedSearchType },
      { $or: [{ 'label.@value': searchWord }, { 'comment.@value': searchWord }] },
      {
        $or: [
          { ontology: 'http://purl.org/goodrelations/v1#' },
          { ontology: 'http://www.w3.org/ns/activitystreams#' },
          // { ontology: 'http://dbpedia.org/ontology/' },
        ],
      },
    ],
  };
  console.log('options', searchOptions);
  return fuse.search(searchOptions, { limit: 100 });
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
