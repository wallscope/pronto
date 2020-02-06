import { Quad } from 'n3';
export interface OntologyResult {
  name: string;
  label: string;
  comment: string;
  source: string;
  definition?: string;
  rest: Array<Quad>;
}
