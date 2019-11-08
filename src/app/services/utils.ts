import { map } from 'rxjs/operators';

export const flattenDocument = map((documents: any[]) =>
  documents.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data() }))
);
