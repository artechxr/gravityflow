import { NextResponse } from 'next/server';
import { globalNodes } from '@/lib/state';

export const dynamic = 'force-dynamic';

export async function GET() {
    // Current State ONLY (Serving Layer). Do NOT mix prediction logic here.
    const nodes = globalNodes.map(node => {
        return {
            id: node.id,
            name: node.name,
            isGreenZone: node.isGreenZone,
            congestion_score: node.base_density // Actual Density
        }
    });

    return NextResponse.json({ nodes }, {
        headers: {
            'Cache-Control': 'no-store, max-age=0',
        }
    });
}
