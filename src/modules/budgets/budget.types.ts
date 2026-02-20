export type Budget = {
    id: string;
    user_id?: string;
    title: string;
    client_name: string;
    address?: string;
    discount: number;
    extra_fee: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    status: 'EM_ANALISE' | 'ENVIADO' | 'APROVADO' | 'RECUSADO';
    synced: number;
};
