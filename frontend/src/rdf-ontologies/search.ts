// TODO: on startup, save and import indexes to localstorage/indexeddb
import Fuse from 'fuse.js';
//@ts-ignore
// import FlexSearch from 'flexsearch/dist/module/flexsearch';
//@ts-ignore
// import schema from './schema.nq';
//@ts-ignore
import json from './ref-jsonrc.json';
//@ts-ignore
import jsonld from './schema-ld.json';
// import jsonld from './ref-jsonld.json';

// const index: import('flexsearch').Index<unknown> = new FlexSearch({
//   doc: {
//     id: '@id',
//     field: '@type',
//   },
// });
// index.add(json);
// const res = index.search('a');
// console.log(res);

// const newData = Object.keys(json).map(key => {
//   return {
//     id: key,
//     type: json[key]['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'],
//     ...json[key],
//   };
// });

// console.log(newData);

// // http://www.w3.org/1999/02/22-rdf-syntax-ns#Property

// var options = {
//   includeScore: true,
//   keys: ['id', 'type.value'], // keys to search in
//   id: 'id', // return a list of keys only
// };
// // const options = { keys: ['title', 'author.firstName'] };

// // Create the Fuse index
// // const myIndex = Fuse.createIndex(options.keys, books);

// const fuse = new Fuse(newData, options);

// const result = fuse.search('ontology');
// console.log('result', result);

/** JSONLD */
// Add property names without a dot to enable Fuse to search them
const newData = jsonld.map((obj: any) => {
  return {
    ...obj,
    comment: obj['http://www.w3.org/2000/01/rdf-schema#comment'],
    label: obj['http://www.w3.org/2000/01/rdf-schema#label'],
  };
});
console.log('jsonld', newData);

const options: Fuse.IFuseOptions<unknown> = {
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

// Create the Fuse index
const myIndex = Fuse.createIndex(['@id', '@type', 'label.@value', 'comment.@value'], newData);

const fuse = new Fuse(newData, options, myIndex);

const searchType: 'Property$' | 'Class$' = 'Property$';
const searchWord = 'agent';

// const result = fuse.search({
//   $and: [
//     { '@type': searchType },
//     { $or: [{ 'label.@value': searchWord }, { 'comment.@value': searchWord }] },
//   ],
// });

// console.log('result', result);

// new tests
let globalFuse: Fuse<unknown, Fuse.IFuseOptions<unknown>> | null = null;

export const loadOntology = (ontology: unknown) => {
  // Check if valid json
  const jsonData = tryParseJSON(ontology);
  if (!jsonData) {
    // TODO: implement non-json ontology parsing
    console.log('not valid json data');
    return;
  }

  // Prepare data - Add property names without a dot to enable Fuse to search them
  const preparedData = jsonData.map((obj: any) => {
    return {
      ...obj,
      comment: obj['http://www.w3.org/2000/01/rdf-schema#comment'],
      label: obj['http://www.w3.org/2000/01/rdf-schema#label'],
    };
  });
  globalFuse = new Fuse(preparedData, options);
};

export const search = (searchType: 'predicate' | 'type', searchWord: string) => {
  const formattedSearchType = searchType === 'predicate' ? 'Property$' : 'Class$';

  if (!globalFuse) return;
  const result = globalFuse.search({
    $and: [
      { '@type': formattedSearchType },
      { $or: [{ 'label.@value': searchWord }, { 'comment.@value': searchWord }] },
    ],
  });

  console.log('result', result);
};

function tryParseJSON(jsonString: unknown) {
  if (typeof jsonString !== 'string') return false;

  try {
    const o = JSON.parse(jsonString);
    if (o && typeof o === 'object') {
      return o;
    }
  } catch (e) {
    // do nothing
  }

  return false;
}
