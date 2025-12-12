
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, ArrowLeft, UserPlus, Search, Filter, X, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { Seller } from '../types';

export const Sellers: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  
  // Real Data State
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  // Categories
  const categories = ['All', 'Clothing', 'Shoes', 'Accessories', 'Leather Goods'];

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
      try {
          // Fetch only "Trusted" sellers for public view
          const { data, error } = await supabase
            .from('trusted_sellers')
            .select('*')
            .eq('status', 'Trusted')
            .order('rating', { ascending: false });
          
          if (error) throw error;
          
          if (data) {
              setSellers(data as Seller[]);
          }
      } catch (err) {
          console.error("Error fetching sellers:", err);
      } finally {
          setLoading(false);
      }
  };

  const handleBack = () => {
    navigate('/', { state: { scrollTo: 'tools-section' } });
  };

  const handleSubmitSuggestion = async (name: string, cat: string, link: string) => {
      // Add as "Pending" for admin review
      try {
          const { error } = await supabase
            .from('trusted_sellers')
            .insert({
                name: name,
                category: cat,
                link: link,
                status: 'Pending',
                rating: 0
            });
            
          if (error) throw error;
          alert("Suggestion sent! An admin will review it shortly.");
          setIsSuggestModalOpen(false);
      } catch (err) {
          console.error("Failed to submit", err);
          alert("Failed to submit. Please try again.");
      }
  };

  const filteredSellers = sellers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'All' || s.category.includes(category);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#050505] pt-28">
      {/* Sticky Header */}
      <div className="sticky top-24 z-30 bg-[#050505]/95 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-center relative mb-8">
        <button 
            onClick={handleBack} 
            className="absolute left-6 md:left-12 p-2 hover:bg-white/10 rounded-full transition-colors text-[#666] hover:text-white"
        >
            <ArrowLeft size={24} />
        </button>
        
        <div className="flex items-center gap-3">
            <ShieldCheck size={28} className="text-primary" />
            <h1 className="text-xl md:text-2xl font-bold text-white">Trusted Sellers</h1>
        </div>

        <button 
            onClick={() => setIsSuggestModalOpen(true)}
            className="absolute right-6 md:right-12 hidden md:flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] hover:bg-white hover:text-black rounded-xl text-xs font-bold text-white transition-colors border border-white/10"
        >
            <UserPlus size={16} /> Suggest
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 pb-12 space-y-6">
        
        {/* Search & Filter Bar */}
        <div className="bg-[#111] border border-white/10 rounded-[24px] p-4 flex flex-col md:flex-row gap-4 items-center animate-fade-in-up">
             <div className="relative flex-1 w-full">
                 <Search className="absolute left-4 top-3.5 text-[#666]" size={18} />
                 <input 
                    type="text" 
                    placeholder="Search seller by name..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-white focus:border-primary outline-none"
                 />
             </div>
             <div className="flex gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-2 md:pb-0">
                 {categories.map(cat => (
                     <button 
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border ${
                            category === cat 
                            ? 'bg-primary text-black border-primary' 
                            : 'bg-[#1A1A1A] text-[#888] border-white/5 hover:text-white'
                        }`}
                     >
                         {cat}
                     </button>
                 ))}
             </div>
        </div>

        {/* List */}
        <div className="space-y-4 animate-fade-in-up">
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-primary" size={40} />
                </div>
            ) : filteredSellers.length > 0 ? (
                filteredSellers.map((seller, idx) => (
                    <div key={idx} className="bg-[#111] border border-white/5 hover:border-white/20 transition-all rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between group cursor-pointer hover:-translate-y-1 gap-4">
                        <div className="flex items-center gap-6 w-full sm:w-auto">
                            <div className="w-14 h-14 bg-[#1A1A1A] rounded-full flex items-center justify-center font-bold text-xl text-[#666] group-hover:text-black group-hover:bg-primary transition-all border border-white/5 shrink-0">
                                {seller.name.charAt(0)}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{seller.name}</h3>
                                    <ShieldCheck size={16} className="text-emerald-500" />
                                </div>
                                <p className="text-[#666] text-sm font-bold uppercase tracking-wider">{seller.category}</p>
                            </div>
                        </div>
                        <div className="text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                            <div className="flex items-center gap-1 text-primary font-bold justify-end text-lg">
                                {seller.rating} <Star size={18} fill="currentColor" />
                            </div>
                            <a href={seller.link || '#'} target="_blank" rel="noreferrer" className="text-[10px] text-[#444] font-bold uppercase tracking-widest mt-1 block group-hover:text-white transition-colors bg-[#1A1A1A] px-3 py-1 rounded-lg">
                                Visit Store
                            </a>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-12 text-[#666]">
                    <p>No sellers found matching your search.</p>
                </div>
            )}
        </div>
        
        {/* Mobile FAB for Suggesting Seller */}
        <button 
            onClick={() => setIsSuggestModalOpen(true)}
            className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-primary text-black rounded-full shadow-[0_0_20px_rgba(217,142,4,0.4)] flex items-center justify-center z-40"
        >
            <UserPlus size={24} />
        </button>
      </div>

      {/* Suggest Seller Modal */}
      {isSuggestModalOpen && (
          <SuggestModal onClose={() => setIsSuggestModalOpen(false)} onSubmit={handleSubmitSuggestion} />
      )}
    </div>
  );
};

const SuggestModal = ({ onClose, onSubmit }: { onClose: () => void, onSubmit: (n: string, c: string, l: string) => void }) => {
    const [name, setName] = useState('');
    const [cat, setCat] = useState('Clothing');
    const [link, setLink] = useState('');

    return (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up">
            <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-[#666] hover:text-white">
                    <X size={24} />
                </button>
                
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <UserPlus size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white">Suggest a Seller</h3>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-[#666] uppercase tracking-wider mb-2">Seller Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} type="text" className="w-full bg-[#0A0A0A] border border-[#222] rounded-xl px-4 py-3 text-white focus:border-primary outline-none" placeholder="e.g. Husky" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#666] uppercase tracking-wider mb-2">Category</label>
                        <select value={cat} onChange={e => setCat(e.target.value)} className="w-full bg-[#0A0A0A] border border-[#222] rounded-xl px-4 py-3 text-white focus:border-primary outline-none">
                            <option>Clothing</option>
                            <option>Shoes</option>
                            <option>Accessories</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#666] uppercase tracking-wider mb-2">Store Link (Optional)</label>
                        <input value={link} onChange={e => setLink(e.target.value)} type="text" className="w-full bg-[#0A0A0A] border border-[#222] rounded-xl px-4 py-3 text-white focus:border-primary outline-none" placeholder="https://..." />
                    </div>
                    
                    <button 
                    onClick={() => onSubmit(name, cat, link)}
                    className="w-full bg-primary hover:bg-primaryHover text-black font-bold py-3.5 rounded-xl transition-colors mt-2"
                    >
                        Submit Suggestion
                    </button>
                </div>
            </div>
        </div>
    );
}
