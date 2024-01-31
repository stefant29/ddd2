import { IA } from 'app/entities/a/a.model';

export interface ID {
  id: string;
  name?: string | null;
  a?: IA | null;
}

export type NewD = Omit<ID, 'id'> & { id: null };
