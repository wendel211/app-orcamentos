import * as SQLite from 'expo-sqlite';
import { migrate } from './migrate';

let db: SQLite.SQLiteDatabase;

export async function initDatabase() {
    db = await SQLite.openDatabaseAsync('orcafacil.db');
    await migrate(db);
    return db;
}

export function getDatabase() {
    return db;
}
