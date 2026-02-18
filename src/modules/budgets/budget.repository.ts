import { getDatabase } from '../../database/db';
import * as Crypto from 'expo-crypto';
import { Budget } from './budget.types';

export async function createBudget(data: {
    title: string;
    client_name: string;
    address?: string;
    status?: 'EM_ANALISE' | 'ENVIADO' | 'APROVADO' | 'RECUSADO';
}) {
    const db = getDatabase();
    const now = new Date().toISOString();

    const id = Crypto.randomUUID();

    await db.runAsync(
        `INSERT INTO budgets 
     (id,title,client_name,address,discount,extra_fee,created_at,updated_at,synced,status)
     VALUES (?,?,?,?,?,?,?,?,0,?)`,
        [
            id,
            data.title,
            data.client_name,
            data.address ?? null,
            0,
            0,
            now,
            now,
            data.status ?? 'EM_ANALISE'
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
        status?: 'EM_ANALISE' | 'ENVIADO' | 'APROVADO' | 'RECUSADO';
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
          status = COALESCE(?, status),
          updated_at = ?,
          synced = 0
        WHERE id = ?`,
        [
            data.title ?? null,
            data.client_name ?? null,
            data.address ?? null,
            data.discount ?? null,
            data.extra_fee ?? null,
            data.status ?? null,
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

export interface DashboardData {
    totalBudgets: number;
    totalApproved: number;
    totalSent: number;
    totalPending: number;
    totalRejected: number;
    approvalRate: number;
    revenueTotal: number;
    revenueThisWeek: number;
    revenueThisMonth: number;
    averageTicket: number;
    recentBudgets: Budget[];
}

export async function getDashboardData(): Promise<DashboardData> {
    const db = getDatabase();

    // Status counts
    const counts = await db.getAllAsync<{ status: string; count: number }>(
        `SELECT status, COUNT(*) as count FROM budgets WHERE deleted_at IS NULL GROUP BY status`
    );

    const countMap: Record<string, number> = {};
    for (const row of counts) countMap[row.status] = row.count;

    const totalApproved = countMap['APROVADO'] ?? 0;
    const totalSent = countMap['ENVIADO'] ?? 0;
    const totalPending = countMap['EM_ANALISE'] ?? 0;
    const totalRejected = countMap['RECUSADO'] ?? 0;
    const totalBudgets = totalApproved + totalSent + totalPending + totalRejected;
    const approvalRate = totalBudgets > 0 ? Math.round((totalApproved / totalBudgets) * 100) : 0;

    // Revenue: sum of (qty * unit_price) for items of APPROVED budgets
    const revenueRow = await db.getFirstAsync<{ total: number }>(
        `SELECT COALESCE(SUM(i.qty * i.unit_price), 0) as total
         FROM items i
         INNER JOIN budgets b ON b.id = i.budget_id
         WHERE b.status = 'APROVADO'
           AND b.deleted_at IS NULL
           AND i.deleted_at IS NULL`
    );
    const revenueTotal = revenueRow?.total ?? 0;
    const averageTicket = totalApproved > 0 ? revenueTotal / totalApproved : 0;

    // Revenue this week (last 7 days)
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const weekRow = await db.getFirstAsync<{ total: number }>(
        `SELECT COALESCE(SUM(i.qty * i.unit_price), 0) as total
         FROM items i
         INNER JOIN budgets b ON b.id = i.budget_id
         WHERE b.status = 'APROVADO'
           AND b.deleted_at IS NULL
           AND i.deleted_at IS NULL
           AND b.updated_at >= ?`,
        weekStart.toISOString()
    );
    const revenueThisWeek = weekRow?.total ?? 0;

    // Revenue this month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const monthRow = await db.getFirstAsync<{ total: number }>(
        `SELECT COALESCE(SUM(i.qty * i.unit_price), 0) as total
         FROM items i
         INNER JOIN budgets b ON b.id = i.budget_id
         WHERE b.status = 'APROVADO'
           AND b.deleted_at IS NULL
           AND i.deleted_at IS NULL
           AND b.updated_at >= ?`,
        monthStart
    );
    const revenueThisMonth = monthRow?.total ?? 0;

    // Recent budgets (last 5)
    const recentBudgets = await db.getAllAsync<Budget>(
        `SELECT * FROM budgets WHERE deleted_at IS NULL ORDER BY updated_at DESC LIMIT 5`
    );

    return {
        totalBudgets,
        totalApproved,
        totalSent,
        totalPending,
        totalRejected,
        approvalRate,
        revenueTotal,
        revenueThisWeek,
        revenueThisMonth,
        averageTicket,
        recentBudgets,
    };
}

