export type ItemType = 'MATERIAL' | 'MAO_DE_OBRA' | 'SERVICO';

export type Item = {
    id: string;
    budget_id: string;
    type: ItemType;
    name: string;
    qty: number;
    unit_price: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    synced: number;
};
