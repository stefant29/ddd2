import { IE, NewE } from './e.model';

export const sampleWithRequiredData: IE = {
  id: '799d1e56-a8bc-49ad-b040-662e90d84cb2',
};

export const sampleWithPartialData: IE = {
  id: 'e7d82827-ae86-4fc2-a7cc-1ffccfcb4733',
  name: 'good',
};

export const sampleWithFullData: IE = {
  id: '5bf7ce18-733e-42a9-8cb8-f138008d77a5',
  name: 'sparse',
};

export const sampleWithNewData: NewE = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
