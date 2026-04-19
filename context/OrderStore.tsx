"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type OrderItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
};

export type Order = {
    id: string;
    fanEmail?: string;
    fanName?: string;
    seatId?: string;
    items: OrderItem[];
    total: number;
    status: 'queued' | 'preparing' | 'ready' | 'completed';
    timestamp: number;
};

type OrderContextType = {
    orders: Order[];
    addOrder: (items: OrderItem[], fanEmail?: string, fanName?: string, seatId?: string) => void;
    updateOrderStatus: (id: string, status: Order['status']) => void;
    getFanOrders: (email?: string) => Order[];
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [myOrderId, setMyOrderId] = useState<string | null>(null);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/system');
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
            }
        } catch (e) {
            console.error(e);
        }
    };

    React.useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 2000);
        return () => clearInterval(interval);
    }, []);

    const addOrder = async (items: OrderItem[], fanEmail?: string, fanName?: string, seatId?: string) => {
        const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const newOrder: Order = {
            id: `ord_${Math.random().toString(36).substr(2, 9)}`,
            fanEmail,
            fanName,
            seatId,
            items,
            total,
            status: 'queued',
            timestamp: Date.now(),
        };

        // Optimistic update
        setOrders(prev => [newOrder, ...prev]);

        await fetch('/api/system', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'NEW_ORDER', payload: { order: newOrder } })
        });
    };

    const updateOrderStatus = async (id: string, status: Order['status']) => {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        await fetch('/api/system', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'UPDATE_ORDER_STATUS', payload: { id, status } })
        });
    };

    const getFanOrders = (email?: string) => {
        if (!email) return [];
        return orders.filter(o => o.fanEmail === email);
    };

    return (
        <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, getFanOrders }}>
            {children}
        </OrderContext.Provider>
    );
}

export function useOrder() {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error("useOrder must be used within an OrderProvider");
    }
    return context;
}
