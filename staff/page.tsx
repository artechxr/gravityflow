"use client";

import { useEffect, useState } from 'react';
import { Lock, Home, AlertTriangle, ShieldAlert, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useSystem } from '@/context/SystemContext';

type NodeData = {
    id: string;
    name: string;
    isGreenZone: boolean;
    congestion_score: number;
};

export default function StaffPage() {
    const [nodes, setNodes] = useState<NodeData[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [staffCode, setStaffCode] = useState('');
    const [error, setError] = useState('');
    const [selectedDispatchNode, setSelectedDispatchNode] = useState('');
    const [dispatchStatus, setDispatchStatus] = useState<'idle' | 'deploying' | 'deployed'>('idle');
    
    const { emergencyMode, setEmergencyMode, incidents, updateIncidentStatus } = useSystem();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (staffCode.toUpperCase() === 'ADMIN-X') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Unauthorized Access Code.');
        }
    };

    const handleDispatch = () => {
        if (!selectedDispatchNode || dispatchStatus !== 'idle') return;
        setDispatchStatus('deploying');
        
        setTimeout(() => {
            setDispatchStatus('deployed');
            setTimeout(() => setDispatchStatus('idle'), 3000);
        }, 1500);
    };

    useEffect(() => {
        const fetchInterval = setInterval(async () => {
            try {
                const res = await fetch('/api/crowd');
                if (res.ok) {
                    const data = await res.json();
                    setNodes(data.nodes);
                    if (!selectedDispatchNode && data.nodes.length > 0) {
                        setSelectedDispatchNode(data.nodes[0].id);
                    }
                }
            } catch (e) {
                console.error("Crowd fetch error", e);
            }
        }, 3000);
        return () => clearInterval(fetchInterval);
    }, []);

    const getNodeColor = (score: number, isGreenZone: boolean) => {
        if (isGreenZone) return 'rgba(16, 185, 129, 0.4)';
        if (score > 70) return 'rgba(225, 29, 72, 0.6)';
        if (score > 40) return 'rgba(245, 158, 11, 0.5)';
        return 'rgba(99, 102, 241, 0.5)';
    };

    if (!isAuthenticated) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden text-slate-200 font-sans">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-black"></div>
            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-sm relative z-10">
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center shadow-inner">
                        <Lock className="w-5 h-5 text-indigo-400" />
                    </div>
                </div>
                <h2 className="text-2xl font-black text-white mb-2 text-center tracking-tight">Staff <span className="text-indigo-400">Ops</span> Login</h2>
                <p className="text-center text-slate-500 text-xs mb-8 uppercase tracking-[0.2em] font-bold">Secure Node</p>
                <form onSubmit={handleLogin}>
                    <input 
                        type="password" 
                        value={staffCode} 
                        onChange={e => {setStaffCode(e.target.value); setError('');}} 
                        placeholder="Passcode (e.g. ADMIN-X)" 
                        className="w-full bg-slate-950 border border-slate-700 px-4 py-4 rounded-xl mb-4 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-center uppercase tracking-widest text-white font-mono placeholder:text-slate-700 text-sm" 
                    />
                    {error && <p className="text-rose-400 text-xs font-bold mb-4 text-center">{error}</p>}
                    <button className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-500 transition shadow-[0_0_15px_rgba(99,102,241,0.3)] active:scale-95">Authenticate</button>
                </form>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col-reverse md:flex-row min-h-screen md:h-screen bg-slate-900 overflow-y-auto md:overflow-hidden text-slate-200 font-sans">
            <div className="w-full md:w-[350px] shrink-0 bg-slate-950/80 backdrop-blur-3xl border-t md:border-t-0 md:border-r border-white/5 flex flex-col z-10 shadow-2xl min-h-[50vh] md:min-h-0 md:h-full">
                <div className="p-8 border-b border-white/5 bg-slate-950 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight">Staff <span className="text-indigo-400">Ops</span></h1>
                        <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-[0.2em] font-bold">GravityFlow Command</p>
                    </div>
                    <Link href="/" className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center shadow-inner border border-slate-800 hover:bg-slate-800 transition-colors shrink-0 group">
                        <Home className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-10">
                    <button 
                        onClick={() => setEmergencyMode(!emergencyMode)}
                        className={`w-full py-5 rounded-2xl font-black tracking-widest uppercase transition-all duration-300 border-2 shadow-2xl flex flex-col items-center justify-center space-y-2 ${emergencyMode ? 'bg-black text-rose-500 border-rose-500 animate-[pulse_1.5s_ease-in-out_infinite]' : 'bg-gradient-to-br from-rose-600 to-rose-900 text-white border-rose-500/50 hover:border-rose-400 hover:shadow-[0_0_40px_rgba(225,29,72,0.6)] active:scale-95'}`}
                    >
                        <AlertTriangle className={`w-8 h-8 ${emergencyMode ? 'text-rose-500' : 'text-white'}`} />
                        <span>{emergencyMode ? 'Deactivate Emergency' : 'Activate Emergency Protocol'}</span>
                    </button>

                    <section>
                        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center"><span className="w-2 h-2 rounded-full bg-rose-500 mr-2 animate-pulse"></span> Active Incident Logs</h2>
                        <div className="space-y-4">
                            {incidents.filter(inc => inc.status !== 'resolved').length === 0 && (
                                <div className="text-center p-6 bg-slate-900/50 border border-slate-700 rounded-2xl text-slate-500 text-sm font-bold">No Active Incidents</div>
                            )}
                            {incidents.filter(inc => inc.status !== 'resolved').map(inc => {
                                const c = inc.color === 'rose' ? { bg: 'bg-rose-500/10', border: 'border-rose-500/20', line: 'bg-rose-500', text: 'text-rose-400' }
                                       : inc.color === 'emerald' ? { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', line: 'bg-emerald-500', text: 'text-emerald-400' }
                                       : { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', line: 'bg-indigo-500', text: 'text-indigo-400' };

                                return (
                                    <div key={inc.id} className={`${c.bg} border ${c.border} p-4 rounded-2xl relative overflow-hidden animate-in fade-in slide-in-from-left-4`}>
                                        <div className={`absolute top-0 left-0 w-1 h-full ${c.line}`}></div>
                                        <span className={`${c.text} text-xs font-bold uppercase tracking-wider block mb-1 flex items-center`}>
                                            <ShieldAlert className="w-3 h-3 mr-1" />
                                            {inc.type}
                                        </span>
                                        <p className="text-sm text-slate-300">Location: {inc.location} {inc.seat_id ? `(${inc.seat_id})` : ''}</p>
                                        <div className="flex items-center justify-between mt-4">
                                            <span className="text-[10px] text-slate-500 font-mono">{Math.round((Date.now() - inc.timestamp)/60000)} mins ago</span>
                                            {inc.status === 'pending' ? (
                                                <button onClick={() => updateIncidentStatus(inc.id, 'dispatched')} className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] uppercase font-black tracking-wider px-3 py-1.5 rounded-lg transition-colors shadow-lg active:scale-95">Dispatch Nearest Steward</button>
                                            ) : (
                                                <button onClick={() => updateIncidentStatus(inc.id, 'resolved')} className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] uppercase font-black tracking-wider px-3 py-1.5 rounded-lg transition-colors shadow-lg active:scale-95 flex items-center"><CheckCircle className="w-3 h-3 mr-1"/> Mark Resolved</button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Staff Dispatch</h2>
                        <div className="bg-slate-800/50 rounded-2xl p-5 border border-white/5 relative overflow-hidden">
                            {dispatchStatus === 'deployed' && (
                                <div className="absolute inset-0 bg-emerald-950/90 z-20 flex flex-col items-center justify-center animate-in fade-in duration-300 backdrop-blur-md">
                                    <span className="text-3xl mb-2 drop-shadow-lg">✅</span>
                                    <span className="text-emerald-400 font-bold text-sm text-center px-4">Unit En Route to Location</span>
                                </div>
                            )}

                            <label className="block text-xs font-bold text-slate-300 mb-3 uppercase tracking-wider">Deploy Unit #4 To:</label>
                            <select 
                                value={selectedDispatchNode}
                                onChange={e => setSelectedDispatchNode(e.target.value)}
                                disabled={dispatchStatus !== 'idle'}
                                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 text-sm mb-4 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
                            >
                                {nodes.map(n => (
                                    <option key={n.id} value={n.id}>{n.name}</option>
                                ))}
                            </select>
                            <button 
                                onClick={handleDispatch}
                                disabled={dispatchStatus !== 'idle'}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50 flex justify-center items-center h-[44px]"
                            >
                                {dispatchStatus === 'deploying' ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : 'Execute Dispatch'}
                            </button>
                        </div>
                    </section>
                </div>
            </div>

            <div className="flex-1 relative bg-slate-950 flex flex-col p-4 md:p-8 perspective-[1500px] min-h-[60vh] md:min-h-0 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-black"></div>
                
                <div className="absolute top-4 md:top-8 left-4 md:left-8 right-4 md:right-8 flex flex-col md:flex-row justify-between items-start md:items-center z-10 gap-3 md:gap-0">
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-lg">Live Heatmap</h2>
                    <div className="flex items-center space-x-3 bg-black/40 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10 shadow-xl">
                        <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-500 animate-[pulse_1.5s_ease-in-out_infinite]"></span>
                        <span className="text-[10px] md:text-xs font-bold text-emerald-400 uppercase tracking-wider">Live Simulation</span>
                    </div>
                </div>

                <div className="flex-1 relative overflow-hidden mt-12 md:mt-0 min-h-[400px]">
                    <div className="absolute top-1/2 left-1/2 -ml-[400px] -mt-[250px] w-[800px] h-[500px] transition-transform duration-1000 ease-out origin-center scale-[0.4] sm:scale-[0.65] lg:scale-100 lg:hover:!scale-[1.05]" style={{ transform: 'scale(var(--tw-scale-x)) rotateX(55deg) rotateZ(-15deg)', transformStyle: 'preserve-3d' }}>
                        
                        {/* Grid lines */}
                        <div className="absolute inset-0 border border-indigo-500/20 rounded-3xl" style={{ backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

                        {nodes.length > 0 && nodes.map((node, i) => {
                            const left = (i % 3) * 250 + 100;
                            const top = Math.floor(i / 3) * 200 + 100;
                            const isHighCongestion = node.congestion_score > 70 && !node.isGreenZone;
                            
                            return (
                                <div key={node.id} className="absolute transition-all duration-1000 flex flex-col items-center transform-style-3d" style={{ left, top, transform: 'translateZ(0)' }}>
                                    {/* 3D Column with origin anchored to bottom */}
                                    <div className="relative flex items-end justify-center w-24 transform-style-3d origin-bottom z-10" style={{ height: 180, transform: 'rotateX(-55deg) rotateZ(15deg)' }}>
                                        <div 
                                            className="w-full absolute bottom-0 rounded-t-xl transition-all duration-[2000ms] ease-out border-l border-t border-white/20 backdrop-blur-sm"
                                            style={{ 
                                                height: Math.max(15, node.congestion_score) + '%', 
                                                backgroundColor: getNodeColor(node.congestion_score, node.isGreenZone),
                                                boxShadow: isHighCongestion ? '0 0 60px rgba(225, 29, 72, 0.6), inset 0 0 20px rgba(255,255,255,0.2)' : '0 0 30px currentColor, inset 0 0 20px rgba(255,255,255,0.1)'
                                            }}
                                        ></div>
                                    </div>
                                    
                                    {/* Label Pill on Grid Floor */}
                                    <div className={`w-36 h-16 rounded-full border border-white/10 flex items-center justify-center -mt-8 relative z-0 shadow-2xl backdrop-blur-md transition-colors duration-1000 ${isHighCongestion ? 'bg-rose-950/80 border-rose-500/50' : 'bg-slate-900/80 border-indigo-500/30'}`}>
                                        <div className="text-center transform rotateX(-55deg) rotateZ(15deg)">
                                            <div className="text-[10px] font-black text-white uppercase tracking-widest drop-shadow-md">{node.name}</div>
                                            <div className={`text-sm font-black mt-0.5 ${isHighCongestion ? 'text-rose-400' : 'text-emerald-400'}`}>{node.congestion_score}%</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
