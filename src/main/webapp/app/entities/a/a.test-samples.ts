import { IA, NewA } from './a.model';

export const sampleWithRequiredData: IA = {
  id: '831e5c7c-ab89-4b4f-b0ab-467d14d49b97',
};

export const sampleWithPartialData: IA = {
  id: '2846ae84-4f5d-42af-93db-a6a9e3e9678e',
};

export const sampleWithFullData: IA = {
  id: 'a89f974d-cb9b-4e3a-9665-d7e45c937216',
  name: 'pare fuzzy strap',
};

export const sampleWithNewData: NewA = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
