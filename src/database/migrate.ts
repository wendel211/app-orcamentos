
import type { SQLiteDatabase } from 'expo-sqlite';
import { schema } from './schema';


export async function migrate(db: SQLiteDatabase) {
    try {
        await db.execAsync(schema); // Creates tables if they don't exist

        // Migration: Add 'status' column to 'budgets' table if it doesn't exist
        const result = await db.getAllAsync<{ name: string }>('PRAGMA table_info(budgets)');
        const hasStatus = result.some(col => col.name === 'status');

        if (!hasStatus) {
            console.log('Migrating: Adding status column to budgets');
            await db.execAsync("ALTER TABLE budgets ADD COLUMN status TEXT DEFAULT 'EM_ANALISE'");
        }
    } catch (error) {
        console.error('Migration error:', error);
    }
}
