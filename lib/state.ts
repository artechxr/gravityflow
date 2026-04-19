import { Order, Incident } from '@/app/api/system/route';

export type NodeLink = { target: string; cost: number };

export type StadiumNode = {
    id: string;
    name: string;
    isGreenZone: boolean;
    base_density: number;
    flow_rate: number;
    order_volume: number;
    connections: NodeLink[];
};

export const globalNodes: StadiumNode[] = [
    { id: 'gate_A', name: 'Gate A', isGreenZone: false, base_density: 30, flow_rate: 10, order_volume: 0, connections: [{target: 'concourse_1', cost: 2}, {target: 'green_zone_north', cost: 4}] },
    { id: 'gate_B', name: 'Gate B', isGreenZone: false, base_density: 20, flow_rate: 5, order_volume: 0, connections: [{target: 'concourse_2', cost: 2}, {target: 'green_zone_south', cost: 4}] },
    { id: 'concourse_1', name: 'Main Concourse 1', isGreenZone: false, base_density: 45, flow_rate: 15, order_volume: 5, connections: [{target: 'gate_A', cost: 2}, {target: 'concourse_2', cost: 5}] },
    { id: 'concourse_2', name: 'Main Concourse 2', isGreenZone: false, base_density: 40, flow_rate: 12, order_volume: 3, connections: [{target: 'gate_B', cost: 2}, {target: 'concourse_1', cost: 5}] },
    { id: 'green_zone_north', name: 'Green Zone North', isGreenZone: true, base_density: 15, flow_rate: -5, order_volume: 0, connections: [{target: 'gate_A', cost: 4}] },
    { id: 'green_zone_south', name: 'Green Zone South', isGreenZone: true, base_density: 10, flow_rate: -5, order_volume: 0, connections: [{target: 'gate_B', cost: 4}] },
];

export const globalState = {
    emergencyMode: false,
    incidents: [] as Incident[],
    orders: [] as Order[],
    lastTick: Date.now()
};
