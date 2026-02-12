import * as SQLite from 'expo-sqlite';
import { migrate } from './migrate';

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase() {
    if (db) return db;

    db = await SQLite.openDatabaseAsync('orcafacil.db');

    // Ativa foreign keys (IMPORTANTE no SQLite)
    await db.execAsync(`PRAGMA foreign_keys = ON;`);

    await migrate(db);

    console.log('Banco SQLite inicializado');

    return db;
}

export function getDatabase() {
    if (!db) {
        throw new Error('Banco de dados não inicializado. Chame initDatabase() primeiro.');
    }

    return db;
}
