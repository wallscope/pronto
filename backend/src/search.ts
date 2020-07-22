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
    ...obj,
    ontology: ontology['@id'],
    label: (obj?.['http://www.w3.org/2000/01/rdf-schema#label'] ||
      obj?.['http://www.w3.org/2004/02/skos/core#prefLabel']) as
      | Array<{ '@value': string; '@language'?: string }>
      | undefined,
    comment: obj['http://www.w3.org/2000/01/rdf-schema#comment'] as
      | Array<{ '@value': string; '@language'?: string }>
      | undefined,
  }));
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

    const fuseOptions: Fuse.IFuseOptions<unknown> = {
      includeScore: true,
      // distance: 1000,
      shouldSort: true,
      threshold: 0.4,
      minMatchCharLength: 2,
      useExtendedSearch: true,
      // keys to search in
      keys: [
        {
          name: 'ontology',
          weight: 0.00001,
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
          weight: 0.00001,
        },
      ],
    };
    // // Create the Fuse index
    const myIndex = Fuse.createIndex(
      // @ts-ignore
      fuseOptions.keys.map(k => k.name),
      flatData,
    );
    console.log('index created');
    fuse = new Fuse(flatData, fuseOptions, myIndex);
  } catch (e) {
    console.log(e);
  }
};

export const search = ({
  searchType,
  searchQuery,
  ontologies,
}: {
  searchType: 'predicate' | 'type';
  searchQuery: string;
  ontologies: Array<string>;
}) => {
  if (!fuse) return;

  // "$" tells fuse what word the searched "type" needs to end with
  const formattedSearchType = searchType === 'predicate' ? 'Property$' : '!Property$';

  return fuse
    .search(
      {
        $and: [
          { '@type': formattedSearchType },
          { $or: [{ 'label.@value': searchQuery }, { 'comment.@value': searchQuery }] },
          {
            // Query only the selected ontologies
            $or: ontologies.map(o => ({ ontology: `=${o}` })),
          },
        ],
      },
      { limit: 100 },
    )
    .map(result => result.item);
};

export const getFromUri = ({
  searchType,
  searchUri,
}: {
  searchType: 'predicate' | 'type';
  searchUri: string;
}) => {
  if (!fuse) return;

  // "$" tells fuse what word the searched "type" needs to end with
  const formattedSearchType = searchType === 'predicate' ? 'Property$' : '!Property$';

  return fuse
    .search(
      {
        $and: [{ '@type': formattedSearchType }, { '@id': `=${searchUri}` }],
      },
      { limit: 1 },
    )
    .map(result => result.item);
};
