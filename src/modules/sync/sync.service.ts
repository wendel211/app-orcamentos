import { getDatabase } from '../../database/db';
import { api } from '../../services/api';
import { SyncPushPayload, SyncPullResponse } from './sync.types';

/*
  Salva ou atualiza lastSyncAt localmente
*/
async function setLastSync(date: string) {
    const db = getDatabase();

    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sync_meta (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

    await db.runAsync(
        `
    INSERT INTO sync_meta (key, value)
    VALUES ('lastSyncAt', ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `,
        date
    );
}

/*
  Recupera lastSyncAt
*/
async function getLastSync(): Promise<string> {
    const db = getDatabase();

    const result = await db.getFirstAsync<{ value: string }>(
        `SELECT value FROM sync_meta WHERE key = 'lastSyncAt'`
    );

    return result?.value ?? '1970-01-01T00:00:00.000Z';
}

/*
  PUSH → envia alterações locais para o backend
*/
async function pushChanges() {
    const db = getDatabase();

    const unsyncedBudgets = await db.getAllAsync(
        `SELECT * FROM budgets WHERE synced = 0`
    );

    if (unsyncedBudgets.length === 0) return;

    const payload: SyncPushPayload = {
        budgets: unsyncedBudgets,
        items: []
    };

    await api.post('/sync/push', payload);

    for (const budget of unsyncedBudgets) {
        await db.runAsync(
            `UPDATE budgets SET synced = 1 WHERE id = ?`,
            budget.id
        );
    }
}

/*
  PULL → busca alterações do backend
*/
async function pullChanges() {
    const db = getDatabase();
    const lastSyncAt = await getLastSync();

    const response = await api.get<SyncPullResponse>(
        `/sync/pull?since=${lastSyncAt}`
    );

    const { budgets } = response.data;

    for (const budget of budgets) {
        await db.runAsync(
            `
      INSERT INTO budgets
      (id,title,client_name,address,discount,extra_fee,created_at,updated_at,deleted_at,synced)
      VALUES (?,?,?,?,?,?,?,?,?,1)
      ON CONFLICT(id) DO UPDATE SET
        title=excluded.title,
        client_name=excluded.client_name,
        address=excluded.address,
        discount=excluded.discount,
        extra_fee=excluded.extra_fee,
        updated_at=excluded.updated_at,
        deleted_at=excluded.deleted_at,
        synced=1
      `,
            [
                budget.id,
                budget.title,
                budget.client_name,
                budget.address,
                budget.discount,
                budget.extra_fee,
                budget.created_at,
                budget.updated_at,
                budget.deleted_at ?? null
            ]
        );
    }

    await setLastSync(new Date().toISOString());
}

/*
  FUNÇÃO PRINCIPAL DE SINCRONIZAÇÃO
*/
export async function syncData() {
    try {
        await pushChanges();
        await pullChanges();
        return { success: true };
    } catch (error) {
        console.error('Erro na sincronização:', error);
        return { success: false };
    }
}
