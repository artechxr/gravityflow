"use client";

import { useState, useRef, useEffect } from 'react';
import { useSystem } from '@/context/SystemContext';
import { useOrder } from '@/context/OrderStore';
import { X, Send, Bot, User } from 'lucide-react';

type Message = {
    id: string;
    sender: 'user' | 'bot';
    text: string;
};

export default function GravityBot({ onClose }: { onClose: () => void }) {
    const { user, setHighlightedRoute } = useSystem();
    const { getFanOrders } = useOrder();
    
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput('');
        
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userMsg }]);
        setIsTyping(true);

        try {
            const orders = getFanOrders(user?.email);
            const chatHistory = messages.slice(-5);
            
            const res = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg, orders, user, chatHistory })
            });
            const data = await res.json();
            
            setIsTyping(false);

            if (data.action?.type === 'HIGHLIGHT_ROUTE') {
                setHighlightedRoute(data.action.payload);
            }

            setMessages(prev => [...prev, { id: Date.now().toString() + '_bot', sender: 'bot', text: data.response }]);
            
        } catch (err) {
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now().toString() + '_err', sender: 'bot', text: "Sorry, my neural nets are experiencing latency. Try again?" }]);
        }
    };

    return (
        <div className="fixed left-0 right-0 top-0 bottom-[100px] sm:inset-auto sm:top-auto sm:bottom-4 sm:right-24 z-40 flex items-end justify-center sm:block p-4 sm:p-0 pointer-events-none">
            <div className="bg-slate-900/80 backdrop-blur-3xl border border-indigo-500/30 rounded-3xl w-full max-w-[390px] h-full sm:h-[600px] max-h-[80vh] shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col pointer-events-auto animate-in zoom-in-95 duration-200 overflow-hidden relative">
                
                {/* Header */}
                <div className="bg-indigo-600/10 border-b border-indigo-500/20 p-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-400">
                            <Bot className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="font-black text-white text-lg tracking-tight leading-tight">GravityBot</h3>
                            <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex max-w-[85%] gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className="shrink-0 mt-auto mb-1">
                                    {msg.sender === 'bot' ? (
                                        <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center">
                                            <Bot className="w-3 h-3 text-indigo-400" />
                                        </div>
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center">
                                            <User className="w-3 h-3 text-slate-300" />
                                        </div>
                                    )}
                                </div>
                                <div className={`px-4 py-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-sm leading-relaxed'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                             <div className="flex gap-2 flex-row max-w-[85%]">
                                 <div className="shrink-0 mt-auto mb-1">
                                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center">
                                        <Bot className="w-3 h-3 text-indigo-400" />
                                    </div>
                                 </div>
                                 <div className="px-4 py-3.5 rounded-2xl bg-slate-800 border border-slate-700 rounded-bl-sm flex gap-1 items-center">
                                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                 </div>
                             </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-800 bg-slate-900/50 shrink-0">
                    <form onSubmit={handleSend} className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Ask GravityBot anything..."
                            className="w-full bg-slate-950 border border-slate-700 rounded-full pl-5 pr-12 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
                        />
                        <button 
                            type="submit" 
                            disabled={!input.trim() || isTyping}
                            className="absolute right-1.5 w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 flex items-center justify-center text-white transition-all"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
