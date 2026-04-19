import { NextResponse } from 'next/server';
import { globalState } from '@/lib/state';
import type { Incident, Order, IncidentStatus, OrderItem } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({
        emergencyMode: globalState.emergencyMode,
        incidents: globalState.incidents.slice().sort((a, b) => b.timestamp - a.timestamp),
        orders: globalState.orders.slice().sort((a, b) => b.timestamp - a.timestamp)
    }, {
        headers: {
            'Cache-Control': 'no-store, max-age=0'
        }
    });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action, payload } = body;

        switch (action) {
            case 'TOGGLE_EMERGENCY':
                globalState.emergencyMode = payload.mode;
                break;
            
            case 'NEW_INCIDENT': {
                const newIncident: Incident = {
                    id: Date.now().toString(),
                    type: payload.type, // e.g. "Fire", "Stampede", "Medical"
                    location: payload.location,
                    seat_id: payload.seat_id,
                    status: 'pending',
                    timestamp: Date.now(),
                    color: payload.color || 'indigo'
                };
                globalState.incidents.push(newIncident);
                return NextResponse.json({ success: true, incident: newIncident });
            }
            
            case 'UPDATE_INCIDENT_STATUS': {
                const idx = globalState.incidents.findIndex(i => i.id === payload.id);
                if (idx !== -1) {
                    globalState.incidents[idx].status = payload.status;
                }
                break;
            }
                
            case 'NEW_ORDER':
                globalState.orders.push(payload.order);
                // INGESTION LINK: High order volume -> triggers increased flow_rate natively in intelligence
                return NextResponse.json({ success: true, order: payload.order });
                
            case 'UPDATE_ORDER_STATUS': {
                const oIdx = globalState.orders.findIndex(o => o.id === payload.id);
                if (oIdx !== -1) {
                    globalState.orders[oIdx].status = payload.status;
                }
                break;
            }
            
            default:
                return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            emergencyMode: globalState.emergencyMode,
            incidents: globalState.incidents.slice().sort((a, b) => b.timestamp - a.timestamp),
            orders: globalState.orders.slice().sort((a, b) => b.timestamp - a.timestamp)
        });

    } catch (err) {
        console.error('System API Error:', err);
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
}
