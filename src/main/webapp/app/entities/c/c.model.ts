import { IA } from 'app/entities/a/a.model';

export interface IC {
  id: string;
  name?: string | null;
  a?: IA | null;
}

export type NewC = Omit<IC, 'id'> & { id: null };
