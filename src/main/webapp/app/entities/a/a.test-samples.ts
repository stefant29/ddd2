import { IA, NewA } from './a.model';

export const sampleWithRequiredData: IA = {
  id: '4c369ad6-96f3-4d8a-a58a-ca71dbe91b80',
};

export const sampleWithPartialData: IA = {
  id: '0af7d126-2166-4079-bb61-3e6890975474',
  name: 'yowza slim upbeat',
};

export const sampleWithFullData: IA = {
  id: '0befcb47-4f4a-493e-bc7a-4343f3c9bd15',
  name: 'quirk index',
};

export const sampleWithNewData: NewA = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
