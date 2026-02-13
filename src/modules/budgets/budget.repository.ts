import { getDatabase } from '../../database/db';
import * as Crypto from 'expo-crypto';
import { Budget } from './budget.types';

export async function createBudget(data: {
    title: string;
    client_name: string;
    address?: string;
}) {
    const db = getDatabase();
    const now = new Date().toISOString();

    const id = Crypto.randomUUID();

    await db.runAsync(
        `INSERT INTO budgets 
     (id,title,client_name,address,discount,extra_fee,created_at,updated_at,synced)
     VALUES (?,?,?,?,?,?,?,?,0)`,
        [
            id,
            data.title,
            data.client_name,
            data.address ?? null,
            0,
            0,
            now,
            now
        ]
    );

    return id;
}

export async function updateBudget(
    id: string,
    data: {
        title?: string;
        client_name?: string;
        address?: string | null;
        discount?: number;
        extra_fee?: number;
    }
) {
    const db = getDatabase();
    const now = new Date().toISOString();

    await db.runAsync(
        `UPDATE budgets SET
          title = COALESCE(?, title),
          client_name = COALESCE(?, client_name),
          address = ?,
          discount = COALESCE(?, discount),
          extra_fee = COALESCE(?, extra_fee),
          updated_at = ?,
          synced = 0
        WHERE id = ?`,
        [
            data.title ?? null,
            data.client_name ?? null,
            data.address ?? null,
            data.discount ?? null,
            data.extra_fee ?? null,
            now,
            id
        ]
    );
}

export async function deleteBudget(id: string) {
    const db = getDatabase();
    const now = new Date().toISOString();

    // Soft delete budget
    await db.runAsync(
        `UPDATE budgets
     SET deleted_at = ?, updated_at = ?, synced = 0
     WHERE id = ?`,
        [now, now, id]
    );

    // Soft delete related items
    await db.runAsync(
        `UPDATE items
     SET deleted_at = ?, updated_at = ?, synced = 0
     WHERE budget_id = ? AND deleted_at IS NULL`,
        [now, now, id]
    );
}

export async function listBudgets(): Promise<Budget[]> {
    const db = getDatabase();
    return db.getAllAsync<Budget>(
        `SELECT * FROM budgets 
     WHERE deleted_at IS NULL 
     ORDER BY updated_at DESC`
    );
}

export async function getBudget(id: string): Promise<Budget | null> {
    const db = getDatabase();
    return db.getFirstAsync<Budget>(
        `SELECT * FROM budgets WHERE id = ?`,
        id
    );
}
