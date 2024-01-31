import { IA, NewA } from './a.model';

export const sampleWithRequiredData: IA = {
  id: '9d2c14c4-a4d8-4487-9630-b097881049b5',
};

export const sampleWithPartialData: IA = {
  id: 'b323e83d-9af0-4691-9788-8925e3fa0301',
  name: 'shame gah pluralize',
};

export const sampleWithFullData: IA = {
  id: '070cbd87-831e-45c7-8cab-89b4f0ab467d',
  name: 'step-father',
};

export const sampleWithNewData: NewA = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
