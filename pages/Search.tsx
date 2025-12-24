
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Image as ImageIcon, ArrowLeft, Filter, Heart, Loader2, AlertCircle, ShoppingBag } from 'lucide-react';
import { identifyProductFromImage } from '../services/geminiService';
import { searchTaobaoProducts } from '../services/taobaoService';
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';

export const Search: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Platform Filter State
  const [platform, setPlatform] = useState<'Taobao' | 'Weidian' | '1688'>('Taobao');

  // Error State
  const [error, setError] = useState<string | null>(null);
  
  // Filter States
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('sales');

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Reset results when platform changes
  useEffect(() => {
      setResults([]);
      setPage(1);
      setHasMore(true);
  }, [platform]);

  const performSearch = async (pageNum: number, isLoadMore = false) => {
    if (!query.trim()) return;
    
    setError(null);

    if (isLoadMore) {
        setLoadingMore(true);
    } else {
        setLoading(true);
        setResults([]); 
    }
    
    // We now use the key integrated in the backend service automatically
    try {
        const newProducts = await searchTaobaoProducts(query, pageNum, undefined, {
            minPrice,
            maxPrice,
            sort: sortBy
        }, platform); 
        
        if (newProducts.length === 0) {
            setHasMore(false);
        } else {
            setResults(prev => isLoadMore ? [...prev, ...newProducts] : newProducts);
            setHasMore(true);
        }

    } catch (err: any) {
        console.error("Search Critical Fail", err);
        setError(err.message || "Failed to fetch data from API.");
        setHasMore(false);
    } finally {
        setLoading(false);
        setLoadingMore(false);
    }
  };

  const handleSearch = () => {
      setPage(1);
      setHasMore(true);
      performSearch(1, false);
  };

  const handleLoadMore = () => {
      const nextPage = page + 1;
      setPage(nextPage);
      performSearch(nextPage, true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = async () => {
          const base64 = (reader.result as string).split(',')[1];
          setLoading(true);
          // Mock identification
          const keywords = await identifyProductFromImage(base64);
          const newQuery = keywords[0] || "Found Item";
          setQuery(newQuery);
          
          setPage(1);
          setResults([]);
          
          try {
              const newProducts = await searchTaobaoProducts(newQuery, 1, undefined, { sort: sortBy }, platform);
              setResults(newProducts);
<<<<<<< HEAD
=======
              console.log("newProducts");
              console.log(newProducts);
>>>>>>> f6c8322 (Sure! Pl)
              setHasMore(newProducts.length > 0);
          } catch (err: any) {
              setError(err.message);
          } finally {
              setLoading(false);
          }
      };
      reader.readAsDataURL(file);
  }

  const handleBack = () => {
    navigate('/', { state: { scrollTo: 'tools-section' } });
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
    } else {
        addToWishlist(product);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-20">
       <div className="sticky top-24 z-30 bg-[#050505]/95 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-center relative mb-8">
          <button 
            onClick={handleBack} 
            className="absolute left-6 md:left-12 p-2 hover:bg-white/10 rounded-full transition-colors text-[#666] hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
          
          <div className="flex items-center gap-3">
             <SearchIcon size={28} className="text-primary" />
             <h1 className="text-xl md:text-2xl font-bold text-white">Product Search</h1>
          </div>
       </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 space-y-6">
        <div className="bg-card border border-slate-700 rounded-xl p-6 shadow-xl relative">
            <div className="flex flex-col md:flex-row gap-4 mb-6 pt-2">
                <div className="flex-1 relative">
                    <SearchIcon className="absolute left-4 top-3.5 text-slate-500" />
                    <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Search ${platform} products...`}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white focus:border-primary outline-none font-medium"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <div className="relative">
                    <input type="file" id="img-search" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    <label htmlFor="img-search" className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors h-full text-sm font-bold text-slate-300">
                        <ImageIcon size={20} />
                        <span className="hidden md:inline">Image Search</span>
                    </label>
                </div>
                <button 
                    onClick={handleSearch}
                    className="px-8 py-3 bg-primary hover:bg-primaryHover text-black font-bold rounded-lg transition-colors shadow-lg shadow-primary/20 min-w-[120px]"
                >
                    {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Search'}
                </button>
            </div>
            
            <div className="pt-4 border-t border-slate-700 flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                <div className="flex gap-4 text-sm text-slate-400">
                    <label className={`flex items-center gap-2 cursor-pointer transition-colors ${platform === 'Taobao' ? 'text-white' : 'hover:text-white'}`}>
                        <input type="checkbox" checked={platform === 'Taobao'} onChange={() => setPlatform('Taobao')} className="rounded bg-slate-800 border-slate-700 accent-primary" /> 
                        Taobao
                    </label>
                    <label className={`flex items-center gap-2 cursor-pointer transition-colors ${platform === 'Weidian' ? 'text-white' : 'hover:text-white'}`}>
                        <input type="checkbox" checked={platform === 'Weidian'} onChange={() => setPlatform('Weidian')} className="rounded bg-slate-800 border-slate-700 accent-primary" /> 
                        Weidian
                    </label>
                    <label className={`flex items-center gap-2 cursor-pointer transition-colors ${platform === '1688' ? 'text-white' : 'hover:text-white'}`}>
                        <input type="checkbox" checked={platform === '1688'} onChange={() => setPlatform('1688')} className="rounded bg-slate-800 border-slate-700 accent-primary" /> 
                        1688
                    </label>
                </div>

                <div className="hidden lg:block w-px h-8 bg-slate-700"></div>

                <div className="flex flex-wrap gap-4 items-center w-full lg:w-auto">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500 font-medium">Price (¥):</span>
                        <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sm focus:border-primary outline-none text-white" />
                        <span className="text-slate-600">-</span>
                        <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sm focus:border-primary outline-none text-white" />
                    </div>

                    <div className="flex items-center gap-2 ml-auto lg:ml-0">
                        <Filter size={16} className="text-slate-500" />
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm focus:border-primary outline-none text-white cursor-pointer">
                            <option value="sales">Best Selling</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        {/* ERROR DISPLAY */}
        {error && (
            <div className="border rounded-xl p-6 bg-red-500/10 border-red-500/20 flex flex-col items-center justify-center text-center animate-fade-in-up">
                <AlertCircle className="text-red-500 mb-2" size={32} />
                <h3 className="text-red-400 font-bold text-lg">API Error</h3>
                <p className="text-red-300/80 text-sm mt-1 max-w-lg font-mono bg-black/20 p-2 rounded break-all">
                    {error}
                </p>
            </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((product, idx) => {
                const saved = isInWishlist(product.id);
                return (
                    <div key={`${product.id}-${idx}`} className="bg-card border border-slate-800 rounded-xl overflow-hidden group hover:shadow-2xl hover:shadow-primary/10 transition-all animate-fade-in-up">
                        <div className="aspect-square bg-slate-900 relative overflow-hidden">
                            {product.image ? (
                                <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-700 bg-slate-900">
                                    <ImageIcon size={32} />
                                </div>
                            )}
                            <div className="absolute top-3 right-3 z-10">
                                <button 
                                    onClick={() => toggleWishlist(product)}
                                    className={`p-2 rounded-full border shadow-lg transition-all ${saved ? 'bg-primary text-black border-primary' : 'bg-black/50 text-white border-white/20 hover:bg-white hover:text-black'}`}
                                >
                                    <Heart size={16} fill={saved ? "currentColor" : "none"} />
                                </button>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="w-full bg-white text-black font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-2">
                                    <ShoppingBag size={14} /> View Link
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-4">
                            <h3 className="text-white font-medium text-sm line-clamp-2 mb-2 min-h-[40px]" title={product.title}>{product.title}</h3>
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-primary font-bold text-lg">¥{product.priceCNY}</div>
                                    <div className="text-[10px] text-slate-500 font-medium">approx. ${(product.priceCNY * 0.14).toFixed(2)}</div>
                                </div>
                                <div className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded font-bold uppercase">
                                    {product.sales > 0 ? `${product.sales}+ Sold` : 'New'}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
        
        {loading && (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => (
                    <div key={i} className="bg-card border border-slate-800 rounded-xl overflow-hidden h-[340px] animate-pulse">
                        <div className="aspect-square bg-slate-800"></div>
                        <div className="p-4 space-y-3">
                            <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
             </div>
        )}

        {results.length > 0 && hasMore && (
            <div className="flex justify-center pt-8">
                <button 
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-700 disabled:opacity-50 flex items-center gap-2"
                >
                    {loadingMore ? <Loader2 className="animate-spin" /> : 'Load More'}
                </button>
            </div>
        )}

      </div>
    </div>
  );
};
