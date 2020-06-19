// import fs from 'fs';
import { join, resolve } from 'path';
import { promises as fs } from 'fs';

function buildPath(prefix: string) {
  return resolve(join(__dirname, './ontologies', `${prefix}.json`));
}

export async function importNqFromPrefix(prefix: string) {
  const path = join(__dirname, './new-ontologies', `${prefix}.json`);
  return await fs.readFile(path, { encoding: 'binary' });
}

// export function loadDatasetStream(prefix: string) {
//   return fs.createReadStream(buildPath(prefix), { encoding: 'utf8' });
// }

export default {
  importNqFromPrefix,
};
