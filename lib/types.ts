export type IncidentStatus = 'pending' | 'dispatched' | 'resolved' | 'closed' | string;

export interface Incident {
    id: string;
    type: string;
    location: string;
    seat_id?: string;
    status: IncidentStatus;
    timestamp: number;
    color?: string;
    cause_effect_chain?: string;
    [key: string]: any;
}

export interface OrderItem {
    id: string;
    name?: string;
    quantity?: number;
    price?: number;
    [key: string]: any;
}

export interface Order {
    id: string;
    status: string;
    timestamp: number;
    items?: OrderItem[];
    total?: number;
    [key: string]: any;
}