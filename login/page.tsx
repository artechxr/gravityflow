"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSystem } from '@/context/SystemContext';
import { Activity, ShieldCheck, Smartphone, UserCircle2 } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const { setUser } = useSystem();
    const [email, setEmail] = useState('');
    const [step, setStep] = useState<'email' | 'fan_onboarding'>('email');
    
    const [fanName, setFanName] = useState('');
    const [fanSeat, setFanSeat] = useState('');
    
    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) return;

        const domain = email.split('@')[1]?.toLowerCase();
        
        if (domain === 'stadium.com') {
            setUser({ email, role: 'staff' });
            router.push('/staff');
        } else if (domain === 'vendor.com') {
            setUser({ email, role: 'vendor' });
            router.push('/vendor');
        } else {
            // It's a Fan
            setStep('fan_onboarding');
        }
    };

    const handleFanSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fanName || !fanSeat) return;

        setUser({
            email,
            role: 'fan',
            name: fanName,
            seat_id: fanSeat
        });
        
        router.push('/fan/map');
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[20%] left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px] animate-[pulse_8s_ease-in-out_infinite]"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[150px] "></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {step === 'email' ? (
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center shadow-inner">
                                <Activity className="w-8 h-8 text-indigo-400" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-black text-white text-center mb-2 tracking-tight">GravityFlow</h1>
                        <p className="text-center text-slate-400 font-medium mb-8">Enter your identity to access the grid.</p>
                        
                        <form onSubmit={handleEmailSubmit}>
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Network Identity</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="user@example.com"
                                        className="w-full bg-slate-950 border border-slate-700 px-5 py-4 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white font-medium transition-all"
                                    />
                                </div>
                            </div>
                            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all active:scale-95 flex items-center justify-center space-x-2 border border-indigo-400">
                                <span>Authenticate</span>
                            </button>
                        </form>

                        <div className="mt-6 bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl text-xs text-indigo-300 leading-relaxed">
                            <strong className="text-indigo-400 uppercase tracking-widest text-[10px]">Demo Override Keys:</strong><br/>
                            <div className="mt-2 grid grid-cols-[60px_1fr] gap-1">
                                <span className="text-white font-bold opacity-70">Staff:</span> <span>@stadium.com</span>
                                <span className="text-white font-bold opacity-70">Vendor:</span> <span>@vendor.com</span>
                                <span className="text-white font-bold opacity-70">Fan:</span> <span>Any other email</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-3 gap-2 opacity-60">
                            <div className="flex flex-col items-center text-center">
                                <Activity className="w-4 h-4 text-rose-400 mb-1" />
                                <span className="text-[9px] text-slate-400 uppercase tracking-widest">Ops</span>
                            </div>
                            <div className="flex flex-col items-center text-center border-l border-white/5">
                                <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1" />
                                <span className="text-[9px] text-slate-400 uppercase tracking-widest">Vendor</span>
                            </div>
                            <div className="flex flex-col items-center text-center border-l border-white/5">
                                <Smartphone className="w-4 h-4 text-indigo-400 mb-1" />
                                <span className="text-[9px] text-slate-400 uppercase tracking-widest">Fan</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl animate-in flip-in-y duration-700">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-full flex items-center justify-center shadow-inner">
                                <UserCircle2 className="w-8 h-8 text-purple-400" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-white text-center mb-1 tracking-tight">Complete Profile</h2>
                        <p className="text-center text-slate-400 text-sm mb-8">Personalize your stadium experience.</p>
                        
                        <form onSubmit={handleFanSubmit}>
                            <div className="space-y-5 mb-8">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Display Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={fanName}
                                        onChange={e => setFanName(e.target.value)}
                                        placeholder="e.g. Alice"
                                        className="w-full bg-slate-950 border border-slate-700 px-5 py-3.5 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white font-medium transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                                        <span>Seat Location</span>
                                        <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-500/30">Delivery Linked</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        required
                                        value={fanSeat}
                                        onChange={e => setFanSeat(e.target.value)}
                                        placeholder="e.g. Gate B, Row 10, Seat 4"
                                        className="w-full bg-slate-950 border border-slate-700 px-5 py-3.5 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white font-medium transition-all"
                                    />
                                </div>
                            </div>
                            <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all active:scale-95 border border-purple-400/50">
                                Enter the Stadium
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
