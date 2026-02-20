import { Budget } from '../budgets/budget.types';
import { Item } from '../items/item.types';

/*
  Dados enviados do mobile para o backend
*/
export type SyncPushPayload = {
  userId: string;
  budgets: Budget[];
  items: Item[];
};

/*
  Dados recebidos do backend
*/
export type SyncPullResponse = {
  budgets: Budget[];
  items: Item[];
};

/*
  Controle de estado da sincronização
*/
export type SyncStatus = {
  lastSyncAt: string | null;
  syncing: boolean;
  error: string | null;
};
