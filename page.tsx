"use client";

import { useOrder } from '@/context/OrderStore';
import { useSystem } from '@/context/SystemContext';
import { useState, useEffect } from 'react';
import { Lock, Home, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function VendorPage() {
    const { orders, updateOrderStatus } = useOrder();
    const { emergencyMode, user } = useSystem();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [vendorId, setVendorId] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user?.role === 'vendor') {
            setIsAuthenticated(true);
        }
    }, [user]);

    const activeOrders = orders.filter(o => o.status !== 'completed');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (vendorId.toUpperCase() === 'V-1234') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Invalid Vendor ID.');
        }
    };

    if (!isAuthenticated) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg border-4 border-slate-50">
                    <Lock className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-6 text-center mt-4">Vendor <span className="text-indigo-600">Login</span></h2>
                <form onSubmit={handleLogin}>
                    <input 
                        type="text" 
                        value={vendorId} 
                        onChange={e => {setVendorId(e.target.value); setError('');}} 
                        placeholder="Enter ID (e.g. V-1234)" 
                        className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-center uppercase tracking-widest font-mono text-slate-700 font-bold" 
                    />
                    {error && <p className="text-rose-500 text-xs font-bold mb-4 text-center">{error}</p>}
                    <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/30 active:scale-95">Access Hub</button>
                </form>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 p-8 flex flex-col relative">
            {emergencyMode && (
                <div className="absolute top-0 left-0 w-full bg-rose-600 text-white font-black uppercase tracking-widest text-sm py-2 flex justify-center items-center z-50 animate-[pulse_2s_ease-in-out_infinite]">
                    <AlertTriangle className="w-5 h-5 mr-3" />
                    Global Emergency Active - Halting Operations
                </div>
            )}
            <div className={`max-w-6xl mx-auto w-full ${emergencyMode ? 'pt-8 opacity-50 pointer-events-none grayscale' : ''}`}>
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-200 hover:bg-slate-50 transition-colors shrink-0 group">
                            <Home className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Vendor <span className="text-indigo-600">Hub</span></h1>
                            <p className="text-slate-500 font-medium">Real-time Order Management</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeOrders.map(order => (
                        <div key={order.id} className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 flex flex-col border border-slate-100 transition-all hover:shadow-2xl hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-100">
                                <div>
                                    <span className="font-bold text-lg text-slate-800 tracking-tight">#{order.id.slice(-6).toUpperCase()}</span>
                                    {order.fanName && (
                                        <div className="text-sm font-bold text-indigo-600 mt-1">{order.fanName} <span className="text-slate-400 font-medium">({order.seatId})</span></div>
                                    )}
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                    order.status === 'queued' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                    order.status === 'preparing' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                }`}>
                                    {order.status}
                                </span>
                            </div>
                            
                            <div className="flex-1 space-y-3 mb-6">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-slate-600 items-center">
                                        <span className="font-medium">
                                            <span className="text-slate-400 font-bold mr-2">{item.quantity}x</span> 
                                            {item.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex space-x-3 mt-auto">
                                {order.status === 'queued' && (
                                    <button onClick={() => updateOrderStatus(order.id, 'preparing')} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 active:scale-95">Accept Order</button>
                                )}
                                {order.status === 'preparing' && (
                                    <button onClick={() => updateOrderStatus(order.id, 'ready')} className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/30 active:scale-95">Mark Ready</button>
                                )}
                                {order.status === 'ready' && (
                                    <button onClick={() => updateOrderStatus(order.id, 'completed')} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-slate-800/30 active:scale-95 text-sm">Handed to Fan</button>
                                )}
                            </div>
                        </div>
                    ))}
                    {activeOrders.length === 0 && (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-dashed border-slate-300">
                            <span className="text-5xl mb-4 grayscale opacity-50">😴</span>
                            <h3 className="text-xl font-bold text-slate-700">All caught up!</h3>
                            <p className="text-slate-500 mt-1">No active orders right now.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
