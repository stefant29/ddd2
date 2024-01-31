import { IB, NewB } from './b.model';

export const sampleWithRequiredData: IB = {
  id: '2d810e38-5a07-4d69-abd6-7bb5a9ac1430',
};

export const sampleWithPartialData: IB = {
  id: 'aa264024-7085-4aab-a1be-f18ef1ccde01',
  name: 'appetizer gah',
};

export const sampleWithFullData: IB = {
  id: '841d3660-b42b-4031-8f7e-f0abccdca256',
  name: 'nor',
};

export const sampleWithNewData: NewB = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
