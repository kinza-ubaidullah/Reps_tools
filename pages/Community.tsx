
import React, { useEffect, useState } from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Flame, Search, FileSpreadsheet, Ghost, Users, Loader2, AlertCircle, ShoppingBag, ExternalLink } from 'lucide-react';
import { searchTaobaoProducts } from '../services/taobaoService';
import { fetchSpreadsheets } from '../services/spreadsheetService';
import { Product, Spreadsheet } from '../types';

// Reusable Empty State Component
const EmptyState = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/50">
    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-500">
      <Icon size={32} />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 max-w-sm">{desc}</p>
  </div>
);

const HotSelling = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
        try {
            // Using "essentials hoodie" as a reliable query that always has data on API
            // Generic terms like "trending" often return 0 results on the free/basic endpoints
            const data = await searchTaobaoProducts('essentials hoodie', 1, undefined, { sort: 'sales' });
            if (data && data.length > 0) {
                setProducts(data.slice(0, 8)); // Top 8 items
            }
        } catch (e) {
            console.error("Failed to load trending items", e);
        } finally {
            setLoading(false);
        }
    };
    fetchTrending();
  }, []);

  if (loading) {
      return (
          <div className="py-20 flex justify-center">
              <Loader2 className="animate-spin text-primary" size={40} />
          </div>
      );
  }

  const hasData = products.length > 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Trending Items</h2>
            <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Live</span>
          </div>
          <select className="bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-primary font-medium">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
          </select>
      </div>
      
      {hasData ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p, i) => (
                <div key={p.id} className="bg-[#111] border border-white/5 rounded-2xl p-4 hover:border-white/20 transition-all group cursor-pointer hover:-translate-y-1">
                    <div className="relative mb-3 overflow-hidden rounded-xl bg-[#0A0A0A] aspect-square">
                        <span className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg z-10 shadow-lg">#{i+1}</span>
                        {p.image ? (
                             <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                        ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                        )}
                    </div>
                    <h3 className="font-bold truncate text-white text-sm mb-1 group-hover:text-primary transition-colors">{p.title}</h3>
                    <div className="flex justify-between items-center">
                        <span className="text-white font-bold text-sm">¥{p.priceCNY}</span>
                        <p className="text-[10px] text-[#666] flex items-center gap-1 font-bold uppercase">
                          <Flame size={10} className="text-orange-500" /> {p.sales}+
                        </p>
                    </div>
                </div>
            ))}
        </div>
      ) : (
        <EmptyState 
          icon={Ghost} 
          title="No Data Available" 
          desc="Could not fetch live trending items. Check API connection." 
        />
      )}
    </div>
  );
};

const W2C = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('Shoes'); 

  useEffect(() => {
      fetchW2CProducts();
  }, [activeCategory]);

  const fetchW2CProducts = async () => {
      setLoading(true);
      setError('');
      try {
          // Use specific category queries
          const query = activeCategory === 'All' ? 'Streetwear' : activeCategory;
          const data = await searchTaobaoProducts(query, 1);
          
          if (data && data.length > 0) {
              setProducts(data);
          } else {
              setProducts([]); 
          }
      } catch (err: any) {
          console.error("W2C Fetch Error:", err);
          setError("Could not load feed. Please try again later.");
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
              {['Shoes', 'Hoodie', 'T-Shirt', 'Pants', 'Watch'].map(c => (
                  <button 
                    key={c} 
                    onClick={() => setActiveCategory(c)}
                    className={`px-4 py-1.5 rounded-full border border-white/5 whitespace-nowrap text-xs font-bold transition-colors uppercase tracking-wide ${
                        activeCategory === c 
                        ? 'bg-primary text-black' 
                        : 'bg-[#111] hover:bg-[#222] text-[#666] hover:text-white'
                    }`}
                  >
                      {c}
                  </button>
              ))}
          </div>
          <button className="px-5 py-2 bg-primary hover:bg-primaryHover text-black text-sm font-bold rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap shadow-lg shadow-primary/20">
            <Plus size={16} /> Post Find
          </button>
        </div>

        {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 mb-4 animate-fade-in-up">
                <AlertCircle size={18} />
                <span className="text-sm font-bold">{error}</span>
            </div>
        )}

        {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
                <Loader2 size={32} className="animate-spin text-primary mb-4" />
                <p className="text-[#666] font-medium">Fetching latest finds...</p>
            </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up">
              {products.map((p) => (
                  <div key={p.id} className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all group hover:-translate-y-1">
                      <div className="relative overflow-hidden aspect-[4/3] bg-[#0A0A0A]">
                        {p.image ? (
                            <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#333]">No Image</div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                View Details
                            </span>
                        </div>
                      </div>
                      <div className="p-4">
                          <h3 className="text-white text-sm font-bold truncate mb-1">{p.title}</h3>
                          <div className="flex justify-between items-center">
                              <span className="text-[#888] text-xs font-medium">{p.platform}</span>
                              <span className="text-primary font-bold">¥{p.priceCNY}</span>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
        ) : (
            <EmptyState 
                icon={ShoppingBag} 
                title="No Finds Yet" 
                desc={`No results found for ${activeCategory}. Try another category.`} 
            />
        )}
    </div>
  );
};

const Spreadsheets = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sheets, setSheets] = useState<Spreadsheet[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const loadSheets = async () => {
            setLoading(true);
            const data = await fetchSpreadsheets();
            setSheets(data);
            setLoading(false);
        };
        loadSheets();
    }, []);

    const filteredSheets = sheets.filter(s => 
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="bg-[#111] border border-white/5 rounded-[24px] p-8 text-center animate-fade-in-up">
                <div className="w-20 h-20 bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-6 text-[#333]">
                    <FileSpreadsheet size={40} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Community Spreadsheets</h3>
                <p className="text-[#666] mb-8 font-medium max-w-md mx-auto">
                    Access over 15,000+ curated items from the best spreadsheets in the community.
                </p>
                
                <div className="max-w-md mx-auto relative">
                    <Search className="absolute left-4 top-3.5 text-[#666]" size={20} />
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search spreadsheets by title or author..." 
                        className="w-full bg-[#0A0A0A] border border-[#222] rounded-xl pl-12 pr-4 py-3 text-white focus:border-primary outline-none font-medium transition-all focus:bg-black"
                    />
                </div>
            </div>

            {loading ? (
                 <div className="flex justify-center py-20">
                     <Loader2 className="animate-spin text-primary" size={40} />
                 </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
                    {filteredSheets.length > 0 ? filteredSheets.map((s) => (
                        <div key={s.id} className="bg-[#111] border border-white/5 p-6 rounded-2xl flex items-center justify-between hover:border-white/20 cursor-pointer transition-all group hover:bg-[#161616]">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-900/20 text-green-500 rounded-xl flex items-center justify-center font-bold text-lg border border-green-500/20">
                                    {s.title.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-white font-bold group-hover:text-primary transition-colors">{s.title}</h4>
                                    <p className="text-[#666] text-xs font-bold uppercase tracking-wider">
                                        {/* Use formatted date or default text */}
                                        {s.created_at ? new Date(s.created_at).toLocaleDateString() : 'Recent'} • {s.items} Items
                                    </p>
                                </div>
                            </div>
                            <div className="text-right flex flex-col items-end gap-2">
                                <a 
                                    href={s.link} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="p-2 bg-[#222] rounded-lg text-white hover:text-primary transition-colors"
                                >
                                    <ExternalLink size={16} />
                                </a>
                                <span className="text-[10px] text-[#444] font-bold">by {s.author}</span>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-2 text-center py-10 text-[#666]">
                            No spreadsheets found matching "{searchTerm}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export const Community: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/', { state: { scrollTo: 'community-section' } });
  };

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
            <Flame size={28} className="text-primary" />
            <h1 className="text-xl md:text-2xl font-bold text-white">Community Hub</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 space-y-8 pb-12">
        {/* Navigation Tabs */}
        <div className="flex p-1 bg-[#111] border border-white/5 rounded-xl w-fit mx-auto mb-8">
            <NavLink 
                to="/community/hot" 
                className={({isActive}) => `px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${isActive ? 'bg-[#222] text-white shadow-lg' : 'text-[#666] hover:text-white'}`}
            >
                <Flame size={16} /> Hot Selling
            </NavLink>
            <NavLink 
                to="/community/w2c" 
                className={({isActive}) => `px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${isActive ? 'bg-[#222] text-white shadow-lg' : 'text-[#666] hover:text-white'}`}
            >
                <ShoppingBag size={16} /> W2C Gallery
            </NavLink>
            <NavLink 
                to="/community/sheets" 
                className={({isActive}) => `px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${isActive ? 'bg-[#222] text-white shadow-lg' : 'text-[#666] hover:text-white'}`}
            >
                <FileSpreadsheet size={16} /> Spreadsheets
            </NavLink>
        </div>

        <Routes>
            <Route path="/" element={<Navigate to="hot" replace />} />
            <Route path="hot" element={<HotSelling />} />
            <Route path="w2c" element={<W2C />} />
            <Route path="sheets" element={<Spreadsheets />} />
        </Routes>
      </div>
    </div>
  );
};
