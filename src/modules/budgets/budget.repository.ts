import { getDatabase } from '../../database/db';
import { v4 as uuid } from 'uuid';
import { Budget } from './budget.types';

export async function createBudget(data: {
    title: string;
    client_name: string;
    address?: string;
}) {
    const db = getDatabase();
    const now = new Date().toISOString();

    const id = uuid();

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
