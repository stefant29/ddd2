import { IC, NewC } from './c.model';

export const sampleWithRequiredData: IC = {
  id: 'f272d1a5-bc1e-46a1-b987-d0dc520a012d',
};

export const sampleWithPartialData: IC = {
  id: 'd7531024-f7ab-495a-8ad1-51d565ef6c82',
};

export const sampleWithFullData: IC = {
  id: 'ac693f20-11b3-4fe4-9b9a-a171c2850e46',
  name: 'mutter corrupt huzzah',
};

export const sampleWithNewData: NewC = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
