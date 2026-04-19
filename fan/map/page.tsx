"use client";

import { useEffect, useState } from 'react';
import { HelpCircle, Activity, ChevronRight, Home } from 'lucide-react';
import { useSystem } from '@/context/SystemContext';
import Link from 'next/link';

type NodeData = {
    id: string;
    name: string;
    isGreenZone: boolean;
    current_density: number;
    predicted_score: number;
    risk_level: string;
    reason: string;
};

const STADIUM_POSITIONS: Record<string, { top: string, left: string }> = {
    'concourse_1': { top: '10%', left: '50%' }, // North Center
    'concourse_2': { top: '90%', left: '50%' }, // South Center
    'gate_A': { top: '50%', left: '8%' }, // West Edge
    'gate_B': { top: '50%', left: '92%' }, // East Edge
    'green_zone_north': { top: '30%', left: '25%' }, // NW
    'green_zone_south': { top: '70%', left: '75%' }, // SE
};

export default function FanMapPage() {
    const [nodes, setNodes] = useState<NodeData[]>([]);
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [predictionMode, setPredictionMode] = useState(false);
    const { highlightedRoute } = useSystem();

    // Fetch Live Intelligence Data
    useEffect(() => {
        const fetchInterval = setInterval(async () => {
            try {
                const res = await fetch('/api/crowd');
                if (res.ok) {
                    const data = await res.json();
                    setNodes(data.intelligence || data.nodes || []);
                }
            } catch (e) {
                console.error("Crowd fetch error", e);
            }
        }, 3000);
        return () => clearInterval(fetchInterval);
    }, []);

    const activeNode = nodes.find(n => n.id === selectedNode);

    const getRadarColor = (score: number, isGreenZone: boolean) => {
        if (isGreenZone) return 'bg-emerald-400 border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.8)]';
        if (score > 70) return 'bg-rose-500 border-rose-400 shadow-[0_0_20px_rgba(225,29,72,0.8)] animate-pulse';
        if (score > 40) return 'bg-amber-400 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.6)]';
        return 'bg-indigo-400 border-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.6)]';
    };

    return (
        <div className="relative min-h-[844px] w-full max-w-[390px] mx-auto flex flex-col p-4 pb-20 bg-slate-900 overflow-hidden">
            <div className="flex justify-between items-center mb-6 mt-4 relative z-10">
                <div className="flex items-center gap-4">
                    <Link href="/" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center shadow-lg border border-slate-700 hover:bg-slate-700 transition-colors shrink-0">
                        <Home className="w-4 h-4 text-slate-400 hover:text-indigo-400" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-sm flex items-center gap-2">
                            {predictionMode ? <span className="text-fuchsia-400">Future</span> : "Live"} <span className={predictionMode ? "text-fuchsia-200" : "text-indigo-400"}>Radar</span>
                        </h1>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">
                            {predictionMode ? "+5 Min Trend Projection" : "Real-time Topography"}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={() => setPredictionMode(!predictionMode)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border transition-colors ${predictionMode ? 'bg-fuchsia-900 border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.5)]' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`}
                >
                    <Activity className={`w-5 h-5 ${predictionMode ? 'text-fuchsia-300' : 'text-indigo-400'}`} />
                </button>
            </div>
            
            {highlightedRoute && (
                <div className="bg-indigo-900/40 border border-indigo-500/50 rounded-2xl p-3 mb-4 mx-4 flex items-center gap-3 animate-in slide-in-from-top-4 relative z-10 backdrop-blur-md">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                        <Activity className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                        <p className="text-xs text-indigo-200 font-bold">Fastest Route Calculated</p>
                        <p className="text-[10px] text-indigo-300/80">Pathing avoiding high-congestion zones. Est. 2 min faster than normal.</p>
                    </div>
                </div>
            )}
                <div>
                <Link href="/fan/help" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center shadow-lg border border-slate-700 hover:bg-slate-700 transition-colors">
                    <HelpCircle className="w-5 h-5 text-indigo-400" />
                </Link>
            </div>
            
            {nodes.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center animate-pulse z-10">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                    <p className="mt-6 text-indigo-300/80 font-medium tracking-wide">Syncing stadium matrix...</p>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center pt-8 pb-32 relative z-0">
                    
                    {/* The "Stadium" SVG / CSS Map */}
                    <div className="relative w-[340px] h-[520px] rounded-[160px] border-2 border-slate-700/50 bg-slate-800/20 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] flex items-center justify-center backdrop-blur-sm">
                        
                        {/* The Field / Court */}
                        <div className="w-[140px] h-[280px] rounded-[70px] border border-white/5 bg-slate-900/80 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)]"></div>
                            <div className="w-full h-[1px] bg-white/5 absolute top-1/2 -translate-y-1/2"></div>
                            <div className="w-16 h-16 rounded-full border border-white/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                        </div>

                        {/* SVG Path Overlay for predictive routing */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                            {/* Static lines indicating grid routes */}
                            <path d="M 40,260 L 170,52 C 200,52 300,260 300,260" stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                            <path d="M 40,260 L 170,468 C 200,468 300,260 300,260" stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                            <path d="M 170,52 L 170,468" stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                            
                            {/* Highlighted Glowing Route */}
                            {highlightedRoute && STADIUM_POSITIONS[highlightedRoute] && (
                                <g className="animate-in fade-in duration-1000">
                                    <polyline 
                                      points={`170,260 ${parseFloat(STADIUM_POSITIONS[highlightedRoute].left)/100 * 340},${parseFloat(STADIUM_POSITIONS[highlightedRoute].top)/100 * 520}`}
                                      stroke="url(#routeGrad)"
                                      strokeWidth="4" 
                                      fill="none" 
                                      strokeLinecap="round"
                                      className="animate-[dash_2s_linear_infinite]"
                                      strokeDasharray="10 10"
                                    />
                                    <defs>
                                        <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="rgba(99,102,241,0.2)" />
                                            <stop offset="100%" stopColor="rgba(16,185,129,1)" />
                                        </linearGradient>
                                    </defs>
                                </g>
                            )}
                        </svg>

                        {/* Radar Nodes */}
                        {nodes.map(node => {
                            const pos = STADIUM_POSITIONS[node.id] || { top: '50%', left: '50%' };
                            const activeScore = predictionMode ? node.predicted_score : node.current_density;
                            const isGreen = node.isGreenZone;
                            const isRed = activeScore > 70 && !isGreen;
                            const isHighlighted = node.id === highlightedRoute;

                            return (
                                <div 
                                    key={node.id}
                                    onClick={() => setSelectedNode(node.id)}
                                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer ${isHighlighted ? 'scale-125 z-20' : 'z-10'}`}
                                    style={{ top: pos.top, left: pos.left }}
                                >
                                    {/* The Blip */}
                                    <div className="relative flex items-center justify-center w-12 h-12">
                                        <div className={`absolute w-4 h-4 rounded-full border ${getRadarColor(activeScore, node.isGreenZone)} ${isHighlighted ? 'scale-150 border-white ring-4 ring-indigo-400' : 'scale-100 group-hover:scale-125'} transition-all duration-300 z-10`}></div>
                                        {/* Ripple */}
                                        <div className={`absolute inset-0 rounded-full opacity-40 animate-ping ${isHighlighted ? 'bg-indigo-300' : isGreen ? 'bg-emerald-400' : isRed ? 'bg-rose-500' : predictionMode ? 'bg-fuchsia-400' : 'bg-indigo-400'}`}></div>
                                    </div>
                                    
                                    {/* Label */}
                                    <div className="mt-1 bg-slate-950/80 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-md text-white font-bold text-[9px] uppercase tracking-widest whitespace-nowrap shadow-xl opacity-80 group-hover:opacity-100 transition-opacity">
                                        {node.name.replace('Main ', '')}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Logical Zone Intelligence Drawer instead of MenuDrawer */}
            {activeNode && (
                <div className="absolute inset-0 z-50 flex flex-col justify-end">
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setSelectedNode(null)} />
                    <div className="relative bg-slate-900 border-t border-indigo-500/30 rounded-t-[40px] p-8 pb-32 animate-in slide-in-from-bottom-full duration-300 shadow-[0_-20px_50px_rgba(0,0,0,0.6)]">
                        <div className="w-12 h-1.5 bg-slate-700 hover:bg-slate-500 transition-colors rounded-full mx-auto mb-8 cursor-pointer" onClick={() => setSelectedNode(null)} />
                        
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">{activeNode.name}</h2>
                                <div className="flex items-center gap-2 mt-2">
                                    <Activity className={`w-4 h-4 ${activeNode.isGreenZone ? 'text-emerald-400' : (predictionMode ? activeNode.predicted_score : activeNode.current_density) > 70 ? 'text-rose-400' : 'text-indigo-400'}`} />
                                    <span className={`text-[10px] uppercase tracking-widest font-bold ${activeNode.isGreenZone ? 'text-emerald-400' : (predictionMode ? activeNode.predicted_score : activeNode.current_density) > 70 ? 'text-rose-400' : 'text-indigo-400'}`}>
                                        Zone Intelligence
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-center">
                                <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-xl font-black text-white shadow-inner bg-slate-950 border-2 ${(predictionMode ? activeNode.predicted_score : activeNode.current_density) > 70 ? 'border-rose-500/50 shadow-rose-500/20' : 'border-indigo-500/50 shadow-indigo-500/20'}`}>
                                    {predictionMode ? activeNode.predicted_score : activeNode.current_density}<span className="text-[10px] text-slate-500">%</span>
                                </div>
                                <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold mt-2">
                                    {predictionMode ? "+5 Min Density" : "Density"}
                                </span>
                            </div>
                        </div>

                        {/* Cause-Effect Rendering */}
                        <div className="bg-slate-950/50 border border-slate-700/50 rounded-xl p-3 mb-4 text-xs font-medium tracking-wide flex items-center gap-2">
                            <Activity className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="text-slate-300">
                                <span className="text-indigo-400">Insight: </span>
                                {activeNode.reason}
                            </span>
                        </div>

                        <div className="space-y-4">
                            {activeNode.isGreenZone ? (
                                <div className="bg-gradient-to-r from-emerald-900/40 to-emerald-800/20 border border-emerald-500/30 p-5 rounded-3xl text-sm shadow-lg text-emerald-100">
                                    <strong className="block text-base text-emerald-400 mb-2">Rewards Active Location!</strong>
                                    Head to this zone and hunt for the Auth Code on the digital signage to claim your <strong>50 Fan Points</strong> securely in the Perks tab.
                                    <Link href="/fan/rewards" className="mt-4 flex items-center gap-2 text-xs font-bold bg-emerald-500 text-slate-900 px-4 py-2.5 rounded-xl w-max hover:bg-emerald-400 transition-colors">
                                        Go to Rewards <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            ) : (predictionMode ? activeNode.predicted_score : activeNode.current_density) > 70 ? (
                                <div className="bg-gradient-to-r from-rose-900/40 to-rose-800/20 border border-rose-500/30 p-5 rounded-3xl text-sm shadow-lg text-rose-100">
                                    <strong className="block text-base text-rose-400 mb-2">Severe Congestion Risk</strong>
                                    {activeNode.reason}. System recommends choosing alternate pathways to minimize waiting times. 
                                    <span className="block mt-2 font-bold text-rose-300">Wait Time Est ≈ {Math.floor((predictionMode ? activeNode.predicted_score : activeNode.current_density) / 4)} minutes.</span>
                                </div>
                            ) : (
                                <div className="bg-gradient-to-r from-indigo-900/40 to-indigo-800/20 border border-indigo-500/30 p-5 rounded-3xl text-sm shadow-lg text-indigo-100">
                                    <strong className="block text-base text-indigo-400 mb-2">Clear Flow</strong>
                                    This sector is currently unobstructed. Typical traversal pace is being maintained with no active bottlenecks recorded.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
