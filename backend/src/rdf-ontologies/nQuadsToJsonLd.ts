import jsonld from 'jsonld';
import fs from 'fs';
import { join } from 'path';

import { importNqFromPrefix } from './loadDataset';
import { JsonLdObj } from 'jsonld/jsonld-spec';
import prefixes from './prefixes';

const RELATIVE_SAVE_PATH = './NEW_ONTOLOGY_FOLDER';

/** Converts all ontologies to json-ld format */
export async function nQuadsToJsonLd() {
  for (const p of Object.keys(prefixes)) {
    console.log(p);
    const ontology = await importNqFromPrefix(p);
    const jsonLdOntology = (await jsonld.fromRDF(ontology as any, {
      format: 'application/n-quads',
    })) as Array<{
      '@id': string; // ontology uri
      '@graph': Array<JsonLdObj>; // ontology triples
    }>;

    await fs.writeFile(
      join(__dirname, RELATIVE_SAVE_PATH, `${p}.json`),
      JSON.stringify(jsonLdOntology[0]),
      err => {
        if (err) {
          return console.log(err);
        }
        console.log('The file was saved!');
      },
    );
  }
}
