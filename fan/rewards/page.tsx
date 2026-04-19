"use client";

import { useState } from 'react';
import { MapPin, ShieldCheck, AlertCircle } from 'lucide-react';

export default function FanRewardsPage() {
    const [points, setPoints] = useState(1250);
    const [justCheckedIn, setJustCheckedIn] = useState(false);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    // Secure check-in mock logic
    const handleSecureCheckIn = () => {
        if (!code) {
            setError("Please enter a zone code.");
            return;
        }

        setIsVerifying(true);
        setError('');

        // Simulate backend verification delay
        setTimeout(() => {
            // Hardcoded valid secure codes (would be pulled from backend and changed dynamically in real life)
            const validCodes = ['GZ-77', 'GZ-42']; 
            
            if (validCodes.includes(code.toUpperCase())) {
                setPoints(p => p + 50);
                setJustCheckedIn(true);
                setCode('');
                setTimeout(() => setJustCheckedIn(false), 4000);
            } else {
                setError("Invalid or expired Zone Code. Check the nearest digital sign.");
            }
            setIsVerifying(false);
        }, 1200);
    };

    return (
        <div className="min-h-full w-full max-w-[390px] mx-auto flex flex-col p-6 bg-slate-900 pb-32">
            <header className="mb-8 mt-4">
                <h1 className="text-3xl font-black tracking-tight text-white mb-2 drop-shadow-md">
                    Fan <span className="text-amber-400">Rewards</span>
                </h1>
                <p className="text-slate-400 text-sm font-medium">Earn perks for optimizing stadium flow.</p>
            </header>

            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-8 text-center shadow-[0_15px_40px_rgba(245,158,11,0.2)] mb-8 border border-amber-400/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <p className="text-amber-100 font-bold tracking-widest uppercase text-xs mb-2">Total Balance</p>
                <div className="text-6xl font-black text-white drop-shadow-lg flex items-center justify-center gap-2">
                    {points}
                </div>
                <p className="text-amber-100 mt-2 text-sm font-medium">Fan Points</p>
            </div>

            <div className="bg-slate-800/80 rounded-3xl p-6 border border-white/5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center shadow-inner">
                        <MapPin className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-black text-white leading-tight">Secure Zone Check-in</h3>
                </div>
                
                <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                    Help us manage crowd flow! Look for the rotating <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1 rounded">Auth Code</span> on the digital signage in any designated Green Zone to claim your points securely.
                    <br/><span className="text-xs text-slate-500 opacity-60 mt-2 block">(Testing Hint: Use 'GZ-77' or 'GZ-42')</span>
                </p>
                
                <div className="space-y-3 relative z-10">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Enter Code (e.g. GZ-77)" 
                            value={code}
                            onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
                            maxLength={5}
                            disabled={justCheckedIn || isVerifying}
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3.5 text-white font-mono text-center tracking-[0.2em] uppercase focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600 disabled:opacity-50"
                        />
                        {justCheckedIn && (
                            <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-400 animate-in zoom-in duration-300" />
                        )}
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-rose-400 text-xs font-bold bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                        </div>
                    )}

                    <button 
                        onClick={handleSecureCheckIn}
                        disabled={justCheckedIn || isVerifying || !code}
                        className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 h-14 ${
                            justCheckedIn 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 scale-[0.98]' 
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-[0.98] disabled:opacity-50 disabled:grayscale'
                        }`}
                    >
                        {isVerifying ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : justCheckedIn ? (
                            <>✓ Verified (+50 Pts)</>
                        ) : (
                            'Verify & Claim'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
