"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOrder, OrderItem } from '@/context/OrderStore';

type MenuItem = {
  id: string;
  vendor: string;
  node_id: string;
  name: string;
  price: number;
  image: string;
};

export default function MenuDrawer({ nodeId, onClose }: { nodeId: string, onClose: () => void }) {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const { addOrder } = useOrder();
  const router = useRouter();

  useEffect(() => {
    fetch('/data/menu_data.json')
      .then(res => res.json())
      .then((data: MenuItem[]) => {
        setMenu(data.filter(item => item.node_id === nodeId));
      });
  }, [nodeId]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    addOrder(cart);
    onClose();
    router.push('/fan/order');
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-slate-900 border-t border-indigo-500/30 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] p-6 h-[75%] flex flex-col animate-in slide-in-from-bottom-full duration-300">
        
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-6" />
        
        <h2 className="text-2xl font-bold text-white mb-4">Digital Menu</h2>
        
        {menu.length === 0 ? (
          <p className="text-slate-400 text-center mt-10">No items available at this location right now.</p>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 pb-20 pr-2">
            {menu.map(item => (
              <div key={item.id} className="flex bg-slate-800/50 border border-slate-700/50 p-3 rounded-2xl gap-4 items-center">
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover shadow-md" />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-100">{item.name}</h3>
                  <p className="text-indigo-400 font-bold">${item.price.toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => addToCart(item)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
                >
                  +
                </button>
              </div>
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <div className="absolute bottom-6 left-6 right-6">
            <button 
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-4 rounded-2xl shadow-[0_10px_20px_rgba(99,102,241,0.3)] transition-all transform active:scale-[0.98] flex justify-between px-6"
            >
              <span>Join Ghost Queue</span>
              <span>${cartTotal.toFixed(2)}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
