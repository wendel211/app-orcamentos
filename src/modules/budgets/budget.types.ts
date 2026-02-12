export type Budget = {
    id: string;
    title: string;
    client_name: string;
    address?: string;
    discount: number;
    extra_fee: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    synced: number;
};
