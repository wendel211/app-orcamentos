import { getDatabase } from '../../database/db';
import * as Crypto from 'expo-crypto';
import { ItemType, Item } from './item.types';

/*
  Criar item offline
*/
export async function createItem(data: {
    user_id: string;
    budget_id: string;
    type: ItemType;
    name: string;
    qty: number;
    unit_price: number;
}) {
    const db = getDatabase();
    const now = new Date().toISOString();
    const id = Crypto.randomUUID();

    await db.runAsync(
        `
    INSERT INTO items
    (id, user_id, budget_id, type, name, qty, unit_price, created_at, updated_at, synced)
    VALUES (?,?,?,?,?,?,?,?,?,0)
    `,
        [
            id,
            data.user_id,
            data.budget_id,
            data.type,
            data.name,
            data.qty,
            data.unit_price,
            now,
            now
        ]
    );

    return id;
}

/*
  Listar itens de um orçamento
*/
export async function listItems(user_id: string, budget_id: string): Promise<Item[]> {
    const db = getDatabase();

    return db.getAllAsync<Item>(
        `
    SELECT * FROM items
    WHERE user_id = ? AND budget_id = ?
    AND deleted_at IS NULL
    ORDER BY created_at ASC
    `,
        [user_id, budget_id]
    );
}

/*
  Buscar item por ID
*/
export async function getItem(id: string): Promise<Item | null> {
    const db = getDatabase();

    return db.getFirstAsync<Item>(
        `SELECT * FROM items WHERE id = ?`,
        id
    );
}

/*
  Atualizar item offline
*/
export async function updateItem(
    id: string,
    data: Partial<Omit<Item, 'id' | 'budget_id' | 'created_at'>>
) {
    const db = getDatabase();
    const now = new Date().toISOString();

    await db.runAsync(
        `
    UPDATE items SET
      type = COALESCE(?, type),
      name = COALESCE(?, name),
      qty = COALESCE(?, qty),
      unit_price = COALESCE(?, unit_price),
      updated_at = ?,
      synced = 0
    WHERE id = ?
    `,
        [
            data.type ?? null,
            data.name ?? null,
            data.qty ?? null,
            data.unit_price ?? null,
            now,
            id
        ]
    );
}

/*
  Soft delete offline
*/
export async function deleteItem(id: string) {
    const db = getDatabase();
    const now = new Date().toISOString();

    await db.runAsync(
        `
    UPDATE items
    SET deleted_at = ?, updated_at = ?, synced = 0
    WHERE id = ?
    `,
        [now, now, id]
    );
}

/*
  Buscar itens não sincronizados
*/
export async function getUnsyncedItems(user_id: string): Promise<Item[]> {
    const db = getDatabase();

    return db.getAllAsync<Item>(
        `SELECT * FROM items WHERE user_id = ? AND synced = 0`,
        user_id
    );
}
