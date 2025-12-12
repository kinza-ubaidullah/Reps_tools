
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Lock, Users, Wifi } from 'lucide-react';
import { User, ChatMessage, Rank } from '../../types';
import { RANK_COLORS } from '../../constants';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';

interface ChatWidgetProps {
  user: User | null;
  onLoginRequest: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ user, onLoginRequest }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'sys-1',
      userId: 'system',
      username: 'System',
      userRank: Rank.ADMIN,
      text: 'Welcome to AnyReps Live Chat! Say hello.',
      timestamp: Date.now(),
      isSystem: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [onlineCount, setOnlineCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Setup Supabase Realtime
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Create a channel for global chat
    const channel = supabase.channel('global-chat', {
        config: {
            presence: {
                key: user ? user.username : 'guest-' + Math.floor(Math.random() * 1000),
            },
        },
    });

    channelRef.current = channel;

    channel
        .on('broadcast', { event: 'message' }, ({ payload }) => {
            // Receive message from others
            setMessages(prev => [...prev, payload]);
        })
        .on('presence', { event: 'sync' }, () => {
            const state = channel.presenceState();
            setOnlineCount(Object.keys(state).length + 42); // +42 fake users for "community feel"
        })
        .subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                await channel.track({ online_at: new Date().toISOString() });
            }
        });

    return () => {
        supabase.removeChannel(channel);
    };
  }, [user]);

  const handleSend = async () => {
    if (!inputValue.trim() || !user || !channelRef.current) return;
    
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      userRank: user.rank,
      text: inputValue,
      timestamp: Date.now()
    };
    
    // 1. Optimistic Update (Show immediately)
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');

    // 2. Broadcast to others
    try {
        await channelRef.current.send({
            type: 'broadcast',
            event: 'message',
            payload: newMsg,
        });
    } catch (err) {
        console.error("Failed to send message", err);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primaryHover rounded-full shadow-[0_0_20px_rgba(217,142,4,0.3)] flex items-center justify-center text-white transition-transform hover:scale-105 z-[100] border border-white/10"
      >
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[90vw] sm:w-96 h-[500px] max-h-[80vh] bg-[#111] border border-white/10 rounded-2xl shadow-2xl flex flex-col z-[100] overflow-hidden animate-fade-in-up">
      {/* Header */}
      <div className="bg-[#161616] p-4 border-b border-white/5 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    Global Chat <Wifi size={12} className="text-emerald-500"/>
                </h3>
                <p className="text-[10px] text-[#666] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Users size={10} /> {onlineCount} Online
                </p>
            </div>
        </div>
        <button 
            onClick={() => setIsOpen(false)} 
            className="w-8 h-8 flex items-center justify-center hover:bg-[#222] rounded-lg text-[#666] hover:text-white transition-colors"
        >
            <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0A0A0A] scrollbar-thin scrollbar-thumb-gray-800">
        {messages.map(msg => (
          <div key={msg.id} className={`flex flex-col ${msg.userId === user?.id ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-2 mb-1.5 px-1">
                <span className={`text-xs font-bold ${RANK_COLORS[msg.userRank]}`}>{msg.username}</span>
                {!msg.isSystem && msg.userRank !== Rank.BRONZE && (
                     <span className="text-[9px] bg-[#222] px-1.5 py-0.5 rounded text-[#888] font-bold uppercase tracking-wider">{msg.userRank}</span>
                )}
            </div>
            <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm break-words ${
                msg.isSystem ? 'bg-emerald-500/10 text-emerald-400 w-full text-center border border-emerald-500/20 italic' :
                msg.userId === user?.id 
                    ? 'bg-primary text-black rounded-tr-sm' 
                    : 'bg-[#1F1F1F] text-gray-200 rounded-tl-sm border border-white/5'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-[#161616] border-t border-white/5 shrink-0">
        {user ? (
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none transition-colors font-medium placeholder:text-[#444]"
            />
            <button 
              onClick={handleSend}
              className="bg-primary hover:bg-primaryHover text-white p-3 rounded-xl transition-colors shadow-lg shadow-primary/20 flex items-center justify-center"
            >
              <Send size={18} fill="currentColor" />
            </button>
          </div>
        ) : (
          <button 
            onClick={onLoginRequest}
            className="w-full py-3 bg-[#1A1A1A] hover:bg-[#222] text-[#888] hover:text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors border border-white/5"
          >
            <Lock size={14} /> Login to chat
          </button>
        )}
      </div>
    </div>
  );
};
