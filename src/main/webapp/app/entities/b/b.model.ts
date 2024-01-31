import { IA } from 'app/entities/a/a.model';

export interface IB {
  id: string;
  name?: string | null;
  a?: IA | null;
}

export type NewB = Omit<IB, 'id'> & { id: null };
