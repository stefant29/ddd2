import { IE } from 'app/entities/e/e.model';
import { IB } from 'app/entities/b/b.model';

export interface IA {
  id: string;
  name?: string | null;
  e?: IE | null;
  bs?: IB[] | null;
}

export type NewA = Omit<IA, 'id'> & { id: null };
