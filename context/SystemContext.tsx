"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Incident, IncidentStatus } from '@/app/api/system/route';

export type UserProfile = {
    email: string;
    role: 'staff' | 'vendor' | 'fan';
    name?: string;
    seat_id?: string;
};

type SystemContextType = {
    user: UserProfile | null;
    setUser: (u: UserProfile | null) => void;
    emergencyMode: boolean;
    incidents: Incident[];
    highlightedRoute: string | null;
    setHighlightedRoute: (id: string | null) => void;
    setEmergencyMode: (mode: boolean) => Promise<void>;
    reportIncident: (type: string, location: string, seat_id?: string) => Promise<string | null>;
    updateIncidentStatus: (id: string, status: IncidentStatus) => Promise<void>;
};

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export function SystemProvider({ children }: { children: React.ReactNode }) {
    const [user, setUserState] = useState<UserProfile | null>(null);
    const [emergencyMode, setEmergencyModeState] = useState(false);
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [highlightedRoute, setHighlightedRoute] = useState<string | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('gravityflow_user');
        if (stored) {
            try {
                setUserState(JSON.parse(stored));
            } catch (e) {}
        }
    }, []);

    const setUser = (u: UserProfile | null) => {
        setUserState(u);
        if (u) {
            localStorage.setItem('gravityflow_user', JSON.stringify(u));
        } else {
            localStorage.removeItem('gravityflow_user');
        }
    };

    const fetchSystemState = async () => {
        try {
            const res = await fetch('/api/system');
            if (res.ok) {
                const data = await res.json();
                setEmergencyModeState(data.emergencyMode);
                setIncidents(data.incidents);
            }
        } catch (err) {
            console.error('Failed to fetch system state:', err);
        }
    };

    useEffect(() => {
        fetchSystemState(); // initial load
        const interval = setInterval(fetchSystemState, 2000); // Poll every 2 seconds
        return () => clearInterval(interval);
    }, []);

    const setEmergencyMode = async (mode: boolean) => {
        // Optimistic update
        setEmergencyModeState(mode);
        try {
            await fetch('/api/system', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'TOGGLE_EMERGENCY', payload: { mode } })
            });
            fetchSystemState();
        } catch (e) {
            console.error(e);
        }
    };

    const reportIncident = async (type: string, location: string, seat_id?: string) => {
        try {
            const res = await fetch('/api/system', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    action: 'NEW_INCIDENT', 
                    payload: { type, location, seat_id, color: 'rose' } 
                })
            });
            const data = await res.json();
            if (data.success) {
                fetchSystemState();
                return data.incident.id as string;
            }
            return null;
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    const updateIncidentStatus = async (id: string, status: IncidentStatus) => {
        // Optimistic update
        setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status } : inc));
        try {
            await fetch('/api/system', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    action: 'UPDATE_INCIDENT_STATUS', 
                    payload: { id, status } 
                })
            });
            fetchSystemState();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <SystemContext.Provider value={{ user, setUser, emergencyMode, incidents, highlightedRoute, setHighlightedRoute, setEmergencyMode, reportIncident, updateIncidentStatus }}>
            {children}
        </SystemContext.Provider>
    );
}

export const useSystem = () => {
    const context = useContext(SystemContext);
    if (context === undefined) {
        throw new Error('useSystem must be used within a SystemProvider');
    }
    return context;
};
