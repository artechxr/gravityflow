"use client";

import { useEffect, useState } from 'react';
import { useSystem } from '@/context/SystemContext';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function EmergencyManager() {
    const { emergencyMode, incidents } = useSystem();
    const [showAllClear, setShowAllClear] = useState(false);
    const [prevMode, setPrevMode] = useState(false);
    const [clearance, setClearance] = useState(0);

    const activeEmergency = incidents[0]; // Fetch the most recent high-priority event

    useEffect(() => {
        if (emergencyMode) {
            setClearance(0);
            const timer = setInterval(() => {
                setClearance(c => (c < 100 ? c + 5 : 100));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [emergencyMode]);

    useEffect(() => {
        if (prevMode && !emergencyMode) {
            setShowAllClear(true);
            const timer = setTimeout(() => setShowAllClear(false), 8000); 
            return () => clearTimeout(timer);
        }
        setPrevMode(emergencyMode);
    }, [emergencyMode, prevMode]);

    if (!emergencyMode && !showAllClear) return null;

    const getColors = () => {
        if (activeEmergency?.type === 'Medical') return 'rose-500';
        if (activeEmergency?.type === 'Fire') return 'orange-500';
        return 'rose-600'; // Stampede
    };

    return (
        <div className={`fixed inset-0 z-[9999] pointer-events-none transition-all duration-1000 ${emergencyMode ? 'opacity-100' : 'opacity-0'}`}>
            {/* Dark Alert Glassmorphic Background */}
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-3xl pointer-events-auto flex flex-col items-center justify-center p-6 text-center">
                
                {/* Emergency Header */}
                <div className={`bg-${getColors()}/10 border border-${getColors()}/50 rounded-[3rem] p-10 max-w-sm w-full shadow-[0_0_150px_rgba(225,29,72,0.4)] animate-[pulse_2s_ease-in-out_infinite]`}>
                    <AlertCircle className={`w-20 h-20 text-${getColors()} mx-auto mb-6 drop-shadow-lg`} />
                    <h1 className="text-4xl font-black text-white tracking-widest uppercase mb-2">
                        {activeEmergency?.type || 'Emergency'}
                    </h1>
                    <p className={`text-${getColors()}/80 font-black text-sm tracking-[0.3em] uppercase pt-4`}>
                        {activeEmergency?.type === 'Medical' ? 'Medical Team Dispatched' : 'Evacuate Immediately'}
                    </p>
                </div>

                {/* Routing Map & Clearance */}
                <div className="mt-8 bg-black/40 border border-white/10 rounded-[2rem] p-8 w-full max-w-sm relative overflow-hidden backdrop-blur-lg">
                    <div className="flex justify-between items-end mb-6 border-b border-white/5 pb-4">
                        <div className="text-left">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Critical Area</h3>
                            <p className="text-xl font-bold text-rose-400">{activeEmergency?.location || 'Zone'} Blocked</p>
                        </div>
                        <div className="text-right">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Clearance</h3>
                            <p className="text-xl font-bold text-emerald-400">{clearance}% Cleared</p>
                        </div>
                    </div>
                    
                    <div className="relative h-56 w-full border border-white/5 rounded-2xl bg-slate-900 flex flex-col items-center justify-between p-6 shadow-inner">
                        <div className="w-full flex justify-between px-4 z-10 relative">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-rose-500/20 border-2 border-rose-500/50 rounded-full flex flex-col items-center justify-center animate-pulse">
                                    <span className="text-xs font-bold text-rose-400">DANGER</span>
                                </div>
                            </div>
                            <div className="w-14 h-14 bg-emerald-500 border-4 border-emerald-400 rounded-full flex flex-col items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.8)] z-20">
                                <span className="text-[9px] font-black text-slate-900 uppercase">Safe Zone</span>
                            </div>
                        </div>
                        
                        {/* Flowing Chevron Path */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 pt-12 overflow-hidden pointer-events-none opacity-60">
                            {[1, 2, 3].map(i => (
                                <ArrowRight key={i} className="w-8 h-8 text-emerald-400 transform rotate-90 animate-[bounce_1s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.15}s` }} />
                            ))}
                        </div>

                        <div className="w-full text-center mt-auto z-10 relative">
                            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Follow Green Corridors</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* All Clear Toast */}
            {showAllClear && (
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex items-start justify-center pt-16 z-[10000]">
                    <div className="bg-emerald-500 border-2 border-emerald-400 text-slate-900 px-8 py-5 rounded-[2rem] flex items-center shadow-[0_30px_60px_rgba(16,185,129,0.4)] animate-in slide-in-from-top-10 fade-in duration-500 backdrop-blur-md pointer-events-auto">
                        <CheckCircle2 className="w-8 h-8 mr-4" />
                        <div>
                            <p className="font-black text-lg uppercase tracking-wider">All Clear</p>
                            <p className="text-sm text-emerald-950 font-bold">Emergency state has been lifted.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
