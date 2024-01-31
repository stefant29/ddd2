import { ID, NewD } from './d.model';

export const sampleWithRequiredData: ID = {
  id: '385c7329-a910-4f71-9a3c-237b1fe2dcda',
};

export const sampleWithPartialData: ID = {
  id: 'deaafa27-d0e8-4f4e-97c1-d1f3826b4782',
};

export const sampleWithFullData: ID = {
  id: '8f0cc7f7-f10b-4f1e-b5e1-d1a5ab5fe05d',
  name: 'when',
};

export const sampleWithNewData: NewD = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
