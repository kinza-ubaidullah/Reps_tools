import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Trash2, ShoppingBag, Search } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

export const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeFromWishlist } = useWishlist();

  const handleBack = () => {
    navigate('/', { state: { scrollTo: 'tools-section' } });
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
             <Heart size={28} className="text-primary" />
             <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                My Wishlist
                <span className="text-sm font-bold text-black bg-primary px-2 py-0.5 rounded-md">{items.length}</span>
             </h1>
          </div>
       </div>

      <div className="max-w-6xl mx-auto px-4 md:px-12 space-y-6 pb-20">
        {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                {items.map((product) => (
                    <div key={product.id} className="bg-[#111] border border-white/10 rounded-[24px] p-5 flex gap-5 hover:border-white/20 transition-all group hover:-translate-y-1 relative overflow-hidden">
                        <div className="w-28 h-28 bg-[#0A0A0A] rounded-xl overflow-hidden shrink-0 border border-white/5">
                            <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-white line-clamp-1 text-lg group-hover:text-primary transition-colors pr-6">{product.title}</h3>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            removeFromWishlist(product.id);
                                        }}
                                        className="text-[#666] hover:text-red-500 hover:bg-red-500/10 transition-all p-2 absolute top-4 right-4 bg-[#1A1A1A] rounded-full border border-white/5 z-20 shadow-lg" 
                                        title="Remove from Wishlist"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <p className="text-xs font-bold text-[#666] uppercase tracking-wider">{product.platform}</p>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-white font-bold text-xl">¥{product.priceCNY}</span>
                                <a href={product.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs bg-[#1A1A1A] hover:bg-white hover:text-black text-white px-4 py-2 rounded-lg transition-colors font-bold border border-white/10 shadow-lg">
                                    <ShoppingBag size={14} /> Buy Now
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-24 border-2 border-dashed border-[#222] rounded-[32px] bg-[#111]/50 px-6 animate-fade-in-up">
                <div className="w-20 h-20 bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-6 text-[#333]">
                    <Search size={40} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Your wishlist is empty</h3>
                <p className="text-[#666] mb-8 font-medium max-w-sm mx-auto">
                    Looks like you haven't saved any grails yet. Go explore products to find something you like!
                </p>
                <button onClick={() => navigate('/search')} className="px-8 py-3 bg-primary hover:bg-primaryHover text-black rounded-xl font-bold transition-transform hover:scale-105 shadow-lg shadow-primary/20 flex items-center gap-2 mx-auto">
                    <Search size={18} /> Browse Products
                </button>
            </div>
        )}
      </div>
    </div>
  );
};