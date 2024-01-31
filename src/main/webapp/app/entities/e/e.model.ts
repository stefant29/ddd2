import { IA } from 'app/entities/a/a.model';

export interface IE {
  id: string;
  name?: string | null;
  as?: IA[] | null;
}

export type NewE = Omit<IE, 'id'> & { id: null };
