import { Budget } from '../budgets/budget.types';

/*
  Dados enviados do mobile para o backend
*/
export type SyncPushPayload = {
    budgets: Budget[];
    items: any[]; // vamos tipar corretamente quando implementarmos items
};

/*
  Dados recebidos do backend
*/
export type SyncPullResponse = {
    budgets: Budget[];
    items: any[];
};

/*
  Controle de estado da sincronização
*/
export type SyncStatus = {
    lastSyncAt: string | null;
    syncing: boolean;
    error: string | null;
};
