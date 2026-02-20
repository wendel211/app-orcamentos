
import type { SQLiteDatabase } from 'expo-sqlite';
import { schema } from './schema';


export async function migrate(db: SQLiteDatabase) {
    try {
        await db.execAsync(schema); // Creates tables if they don't exist

        // Migration: Add 'user_id' column to 'budgets' table if it doesn't exist
        const budgetsCols = await db.getAllAsync<{ name: string }>('PRAGMA table_info(budgets)');
        if (!budgetsCols.some(col => col.name === 'user_id')) {
            console.log('Migrating: Adding user_id column to budgets');
            await db.execAsync("ALTER TABLE budgets ADD COLUMN user_id TEXT");
        }

        // Migration: Add 'user_id' column to 'items' table if it doesn't exist
        const itemsCols = await db.getAllAsync<{ name: string }>('PRAGMA table_info(items)');
        if (!itemsCols.some(col => col.name === 'user_id')) {
            console.log('Migrating: Adding user_id column to items');
            await db.execAsync("ALTER TABLE items ADD COLUMN user_id TEXT");
        }
    } catch (error) {
        console.error('Migration error:', error);
    }
}
