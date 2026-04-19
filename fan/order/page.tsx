"use client";

import { useOrder } from '@/context/OrderStore';
import { useSystem } from '@/context/SystemContext';
import { useRouter } from 'next/navigation';

export default function FanOrderPage() {
    const { getFanOrders, addOrder } = useOrder();
    const { user } = useSystem();
    const router = useRouter();
    
    const orders = getFanOrders(user?.email);

    if (!orders || orders.length === 0) {
        return (
            <div className="min-h-[844px] w-full max-w-[390px] mx-auto flex flex-col items-center justify-center p-6 bg-slate-900 text-center">
                <span className="text-6xl mb-6">🛒</span>
                <h2 className="text-2xl font-bold text-white mb-2">No Order History</h2>
                <p className="text-slate-400 mb-8">You haven't joined the Ghost Queue yet.</p>
                <button 
                    onClick={() => router.push('/fan/map')}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-indigo-500/30 active:scale-95 transition-all"
                >
                    Browse Concessions
                </button>
            </div>
        );
    }

    const getStatusDisplay = (status: string) => {
        switch(status) {
            case 'queued': return { text: 'In Queue', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30' };
            case 'preparing': return { text: 'Preparing', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' };
            case 'ready': return { text: 'Ready for Pickup!', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' };
            case 'completed': return { text: 'Completed', color: 'text-slate-400', bg: 'bg-slate-800', border: 'border-slate-700' };
            default: return { text: 'Unknown', color: 'text-white', bg: 'bg-slate-800', border: 'border-slate-700' };
        }
    };

    return (
        <div className="min-h-[844px] w-full max-w-[390px] mx-auto flex flex-col p-6 bg-slate-900">
            <h1 className="text-3xl font-black tracking-tight text-white mb-8 mt-4 drop-shadow-sm">
                Ghost Queue <span className="text-indigo-400">2.0</span>
            </h1>

            <div className="space-y-6 pb-32">
                {orders.map(order => {
                    const s = getStatusDisplay(order.status);
                    return (
                        <div key={order.id} className="bg-slate-800/80 rounded-3xl p-5 border border-white/5 shadow-xl">
                            <div className={`p-4 rounded-2xl border ${s.border} ${s.bg} mb-5 flex justify-between items-center shadow-inner`}>
                                <div>
                                    <h2 className={`text-lg font-black ${s.color} mb-0.5 tracking-wide`}>{s.text}</h2>
                                    <p className="text-slate-300 text-xs opacity-70">Order #{order.id.slice(-6).toUpperCase()}</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-slate-950/50 flex items-center justify-center shadow-inner">
                                    {order.status === 'ready' ? <span className="text-2xl">🎉</span> : <span className="text-2xl animate-pulse">⏳</span>}
                                </div>
                            </div>

                            <div className="space-y-3">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm">
                                        <span className="text-slate-300 font-medium"><span className="text-indigo-400 font-black mr-2">{item.quantity}x</span> {item.name}</span>
                                        <span className="text-slate-200 font-bold">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between items-center font-black text-lg">
                                <span className="text-white">Total</span>
                                <span className="text-indigo-400">₹{order.total}</span>
                            </div>

                            {order.status === 'completed' && (
                                <button 
                                    onClick={() => {
                                        addOrder(order.items, user?.email, user?.name, user?.seat_id);
                                    }}
                                    className="mt-5 w-full bg-slate-900 hover:bg-slate-950 text-white font-bold py-3.5 rounded-xl border border-white/10 transition-all flex items-center justify-center space-x-2 text-sm active:scale-95"
                                >
                                    <span>🔄</span>
                                    <span>Order Again</span>
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
