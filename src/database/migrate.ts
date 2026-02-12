
import type { SQLiteDatabase } from 'expo-sqlite';
import { schema } from './schema';


export async function migrate(db: SQLiteDatabase) {
    await db.execAsync(schema);
}
