// import fs from 'fs';
import { join } from 'path';
import { promises as fs } from 'fs';

export async function importNqFromPrefix(prefix: string) {
  const path = join(__dirname, './ontologies', `${prefix}.json`);
  return await fs.readFile(path, { encoding: 'binary' });
}

export default {
  importNqFromPrefix,
};
