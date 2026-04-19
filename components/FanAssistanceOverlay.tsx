"use client";

import { useState, useEffect } from 'react';
import { useSystem } from '@/context/SystemContext';
import { LifeBuoy, X, CheckCircle2, Clock, AlertTriangle, Bot, MessageCircle } from 'lucide-react';
import GravityBot from './GravityBot';

export default function FanAssistanceOverlay() {
    const { reportIncident, incidents, user } = useSystem();
    const [isOpen, setIsOpen] = useState(false);
    const [showFaq, setShowFaq] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [isFabExpanded, setIsFabExpanded] = useState(false);
    const [issueType, setIssueType] = useState('Spill/Cleanup');
    const [myIncidentId, setMyIncidentId] = useState<string | null>(null);
    const [resolvedTimer, setResolvedTimer] = useState<NodeJS.Timeout | null>(null);

    const myIncident = incidents.find(i => i.id === myIncidentId);

    useEffect(() => {
        if (myIncident?.status === 'resolved') {
            // Start the 1 minute fade-out timer
            if (!resolvedTimer) {
                const timer = setTimeout(() => {
                    setMyIncidentId(null);
                    setResolvedTimer(null);
                }, 60000); // 1 minute
                setResolvedTimer(timer);
            }
        }
    }, [myIncident?.status, resolvedTimer]);

    const handleSubmit = async () => {
        const id = await reportIncident(issueType, 'Sector 4', user?.seat_id || 'Unknown Seat');
        if (id) {
            setMyIncidentId(id);
            setIsOpen(false);
        }
    };

    if (myIncident) {
        return (
            <div className={`fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-[350px] z-40 rounded-2xl p-4 shadow-2xl backdrop-blur-md border ${myIncident.status === 'resolved' ? 'bg-slate-900/90 border-emerald-500/50' : myIncident.status === 'dispatched' ? 'bg-indigo-950/90 border-indigo-400/50' : 'bg-slate-900/90 border-amber-500/50'}`}>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Assistance Request</span>
                    {myIncident.status === 'pending' && <span className="flex items-center text-[10px] text-amber-400"><Clock className="w-3 h-3 mr-1 animate-spin"/> Pending</span>}
                    {myIncident.status === 'dispatched' && <span className="flex items-center text-[10px] text-indigo-400 animate-pulse"><AlertTriangle className="w-3 h-3 mr-1"/> Dispatched</span>}
                    {myIncident.status === 'resolved' && <span className="flex items-center text-[10px] text-emerald-400"><CheckCircle2 className="w-3 h-3 mr-1"/> Resolved</span>}
                </div>
                
                {myIncident.status === 'pending' && (
                    <p className="text-sm text-white font-bold">Your request for <span className="text-amber-400">{myIncident.type}</span> has been broadcast to staff.</p>
                )}
                {myIncident.status === 'dispatched' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2">
                        <p className="text-sm font-black text-white">Steward is on the way.</p>
                        <p className="text-xs font-bold text-indigo-300 mt-1">Estimated arrival: 3 minutes.</p>
                    </div>
                )}
                {myIncident.status === 'resolved' && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                        <p className="text-sm font-black text-white">Case Closed</p>
                        <p className="text-[10px] text-slate-400 mt-1">Thank you for reporting. This message will clear shortly.</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <>
            <div className="fixed bottom-20 right-5 z-40 flex flex-col-reverse items-end gap-3 pointer-events-none">
                {/* Main Hub Trigger */}
                <button 
                    onClick={() => setIsFabExpanded(!isFabExpanded)}
                    className="w-14 h-14 min-w-[56px] min-h-[56px] bg-slate-800/80 backdrop-blur-lg border border-white/20 hover:bg-slate-700 hover:border-white/40 text-white rounded-full flex flex-col items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.6)] transition-all active:scale-90 pointer-events-auto z-50 relative"
                >
                    {isFabExpanded ? <X className="w-6 h-6 text-slate-300" /> : <MessageCircle className="w-6 h-6" />}
                </button>

                {/* Expanded Action Menu */}
                <div className={`flex flex-col-reverse items-end gap-4 transition-all duration-300 ease-out origin-bottom pointer-events-auto ${isFabExpanded ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-10 pointer-events-none'}`}>
                    
                    {/* FAQ Button (Bottom) */}
                    <div className="flex items-center justify-end gap-3 group">
                        <span className="text-white text-[10px] font-bold tracking-widest uppercase bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">FAQ</span>
                        <button 
                            onClick={() => { setShowFaq(true); setIsFabExpanded(false); }}
                            className="w-12 h-12 bg-slate-800 backdrop-blur-md border border-white/10 hover:bg-slate-700 text-slate-300 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
                        >
                            <span className="text-xl">❓</span>
                        </button>
                    </div>

                    {/* SOS Button (Middle) */}
                    <div className="flex items-center justify-end gap-3 group">
                        <span className="text-white text-[10px] font-bold tracking-widest uppercase bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">SOS Steward</span>
                        <button 
                            onClick={() => { setIsOpen(true); setIsFabExpanded(false); }}
                            className="w-12 h-12 bg-rose-600/90 backdrop-blur-md border border-rose-400 hover:bg-rose-500 text-white rounded-full flex items-center justify-center shadow-[0_5px_15px_rgba(225,29,72,0.4)] transition-transform hover:scale-110 active:scale-95"
                        >
                            <span className="text-xl">🆘</span>
                        </button>
                    </div>

                    {/* GravityBot Button (Top) */}
                    <div className="flex items-center justify-end gap-3 group">
                        <span className="text-white text-[10px] font-bold tracking-widest uppercase bg-indigo-600/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-indigo-400/50 shadow-[0_5px_15px_rgba(99,102,241,0.3)] opacity-0 group-hover:opacity-100 transition-opacity">GravityBot</span>
                        <button 
                            onClick={() => { setShowChat(true); setIsFabExpanded(false); }}
                            className="w-12 h-12 bg-indigo-600/90 backdrop-blur-md border border-indigo-400 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-[0_5px_15px_rgba(99,102,241,0.4)] transition-transform hover:scale-110 active:scale-95 relative"
                        >
                            <div className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-30"></div>
                            <span className="text-xl relative z-10">🤖</span>
                        </button>
                    </div>

                </div>
            </div>

            {showChat && <GravityBot onClose={() => setShowChat(false)} />}

            {showFaq && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl w-full max-w-sm shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button onClick={() => setShowFaq(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-xl font-black text-white mb-2">Stadium FAQs</h3>
                        <p className="text-sm text-slate-400 mb-6">Learn how the system works.</p>
                        
                        <div className="space-y-4">
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                <h4 className="text-indigo-400 font-bold text-sm mb-1">How does pricing work?</h4>
                                <p className="text-xs text-slate-300 leading-relaxed">All prices are localized in Indian Rupees (₹) across the stadium. The Digital Menu automatically syncs exactly with local concession stands.</p>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                <h4 className="text-indigo-400 font-bold text-sm mb-1">Ghost Queue Orders</h4>
                                <p className="text-xs text-slate-300 leading-relaxed">Add any items to your cart, click Checkout, and we stream your Seat ID instantly to the kitchen. No waiting in line.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl w-full max-w-sm shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                        
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
                                <LifeBuoy className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white">Request Assistance</h3>
                                <p className="text-[10px] uppercase tracking-widest text-slate-500">Seat-to-Steward System</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Issue Type</label>
                                <select 
                                    value={issueType}
                                    onChange={e => setIssueType(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                                >
                                    <option>Medical</option>
                                    <option>Spill/Cleanup</option>
                                    <option>Security Incident</option>
                                    <option>Seat Issue</option>
                                </select>
                            </div>
                            
                            <div className="bg-slate-950/50 rounded-xl p-3 border border-white/5 flex justify-between items-center">
                                <span className="text-xs text-slate-500">Detected Location:</span>
                                <span className="text-xs font-bold text-indigo-400 tracking-wider">{user?.seat_id || 'Unknown Seat'}</span>
                            </div>

                            <button 
                                onClick={handleSubmit}
                                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl transition-colors shadow-[0_0_20px_rgba(99,102,241,0.3)] active:scale-95"
                            >
                                Dispatch Steward
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
