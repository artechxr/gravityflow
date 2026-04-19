"use client";

import { useState, useEffect } from 'react';
import { useOrder, OrderItem } from '@/context/OrderStore';
import { useSystem } from '@/context/SystemContext';
import { Coffee, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

type MenuItem = {
  id: string;
  vendor: string;
  node_id: string;
  name: string;
  price: number;
  image: string;
};

export default function FanMenuPage() {
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [cart, setCart] = useState<Record<string, number>>({});
    const { addOrder } = useOrder();
    const { user } = useSystem();
    const router = useRouter();

    useEffect(() => {
        fetch('/data/menu_data.json')
          .then(res => res.json())
          .then(setMenu);
    }, []);

    const handleIncrement = (id: string) => {
        setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const handleDecrement = (id: string) => {
        setCart(prev => {
            const next = { ...prev };
            if (next[id] > 1) {
                next[id] -= 1;
            } else {
                delete next[id];
            }
            return next;
        });
    };

    const cartTotal = Object.keys(cart).reduce((sum, id) => {
        const item = menu.find(m => m.id === id);
        return sum + (item ? item.price * cart[id] : 0);
    }, 0);

    const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

    const handleCheckout = () => {
        const orderItems: OrderItem[] = Object.keys(cart).map(id => {
            const item = menu.find(m => m.id === id)!;
            return { id: item.id, name: item.name, price: item.price, quantity: cart[id] };
        });
        addOrder(orderItems, user?.email, user?.name, user?.seat_id);
        router.push('/fan/order');
    };

    const vendors = Array.from(new Set(menu.map(i => i.vendor)));

    return (
        <div className="min-h-full w-full max-w-[390px] mx-auto flex flex-col p-6 bg-slate-900 pb-40">
            <header className="mb-8 mt-4">
                <h1 className="text-3xl font-black tracking-tight text-white mb-2 drop-shadow-md flex items-center gap-3">
                    <Coffee className="w-8 h-8 text-rose-400" /> Digital Menu
                </h1>
                <p className="text-slate-400 text-sm font-medium">Browse and order from anywhere in the stadium.</p>
            </header>

            {menu.length === 0 ? (
                <div className="animate-pulse space-y-6">
                    <div className="h-40 bg-slate-800 rounded-3xl" />
                    <div className="h-40 bg-slate-800 rounded-3xl" />
                </div>
            ) : (
                <div className="space-y-8 relative">
                    {vendors.map(vendor => (
                        <section key={vendor} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-rose-500"></span> {vendor}
                            </h2>
                            <div className="space-y-4">
                                {menu.filter(i => i.vendor === vendor).map(item => {
                                    const qty = cart[item.id] || 0;
                                    return (
                                        <div key={item.id} className="bg-slate-800/50 border border-white/5 rounded-3xl p-3 flex gap-4 items-center shadow-xl backdrop-blur-sm transition-all group hover:bg-slate-800 cursor-pointer" onClick={() => handleIncrement(item.id)}>
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-900 relative pointer-events-none">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute inset-0 border border-white/10 rounded-2xl"></div>
                                            </div>
                                            <div className="flex-1 py-2 pointer-events-none">
                                                <h3 className="font-bold text-white text-[15px] leading-tight mb-1">{item.name}</h3>
                                                <p className="text-rose-400 font-black tracking-wide">₹{item.price}</p>
                                            </div>
                                            
                                            {qty > 0 ? (
                                                <div className="flex items-center gap-3 bg-slate-700/50 p-2 rounded-xl shrink-0" onClick={e => e.stopPropagation()}>
                                                    <button onClick={() => handleDecrement(item.id)} className="w-8 h-8 flex items-center justify-center text-white bg-slate-600 hover:bg-rose-500 rounded-lg transition-colors active:scale-95">
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="text-white font-bold w-4 text-center">{qty}</span>
                                                    <button onClick={() => handleIncrement(item.id)} className="w-8 h-8 flex items-center justify-center text-white bg-slate-600 hover:bg-rose-500 rounded-lg transition-colors active:scale-95">
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div 
                                                    className="w-12 h-12 rounded-2xl bg-slate-700/50 text-white flex items-center justify-center shrink-0 cursor-pointer hover:bg-rose-500 transition-colors" 
                                                    onClick={(e) => { e.stopPropagation(); handleIncrement(item.id); }}
                                                >
                                                    <Plus strokeWidth={3} className="w-5 h-5 text-slate-300" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    ))}

                    {cartCount > 0 && (
                        <div className="fixed bottom-[110px] left-1/2 -translate-x-1/2 w-[90%] max-w-[350px] z-40 animate-in slide-in-from-bottom-5">
                            <button onClick={handleCheckout} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-between p-4 rounded-2xl shadow-[0_10px_30px_rgba(99,102,241,0.4)] transition-all active:scale-95">
                                <div className="flex items-center bg-indigo-500 rounded-xl px-3 py-1.5 text-sm font-black">
                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                    {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
                                </div>
                                <span className="text-lg font-black tracking-wider">Checkout | ₹{cartTotal}</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
