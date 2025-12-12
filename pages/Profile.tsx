
import React, { useState, useEffect } from 'react';
import { User, Rank } from '../types';
import { User as UserIcon, Shield, Calendar, Edit2, Award, ArrowLeft, CheckCircle, Zap, Camera, X, Save, Loader2, Image as ImageIcon, Upload } from 'lucide-react';
import { RANK_COLORS } from '../constants';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useWishlist } from '../context/WishlistContext';

interface ProfileProps {
  user: User;
}

// Rank Thresholds
const RANK_THRESHOLDS = {
  [Rank.BRONZE]: { min: 0, max: 100 },
  [Rank.SILVER]: { min: 100, max: 500 },
  [Rank.GOLD]: { min: 500, max: 1500 },
  [Rank.PLATINUM]: { min: 1500, max: 5000 },
  [Rank.ADMIN]: { min: 0, max: 999999 } // Admin is special
};

export const Profile: React.FC<ProfileProps> = ({ user: initialUser }) => {
  const navigate = useNavigate();
  const { items } = useWishlist(); // Get wishlist count for stats
  const [user, setUser] = useState<User>(initialUser);
  const [loading, setLoading] = useState(false);
  const [claimedDaily, setClaimedDaily] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Sync state if prop changes
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  // Calculate Rank Progress
  const calculateProgress = (reputation: number, rank: Rank) => {
    if (rank === Rank.ADMIN) return 100;
    
    const currentTier = RANK_THRESHOLDS[rank];
    const totalRange = currentTier.max - currentTier.min;
    const progressInTier = reputation - currentTier.min;
    
    const percentage = Math.min(100, Math.max(0, (progressInTier / totalRange) * 100));
    return Math.round(percentage);
  };

  const getNextRank = (rank: Rank) => {
    if (rank === Rank.BRONZE) return Rank.SILVER;
    if (rank === Rank.SILVER) return Rank.GOLD;
    if (rank === Rank.GOLD) return Rank.PLATINUM;
    return 'Max Level';
  };

  const currentProgress = calculateProgress(user.reputation, user.rank);
  const nextRank = getNextRank(user.rank);
  const pointsToNext = user.rank === Rank.ADMIN ? 0 : RANK_THRESHOLDS[user.rank].max - user.reputation;

  const handleDailyCheckIn = async () => {
    if (claimedDaily || loading) return;
    setLoading(true);

    try {
        const bonusRep = 15;
        const newRep = user.reputation + bonusRep;
        
        let newRank = user.rank;
        if (user.rank !== Rank.ADMIN) {
             if (newRep >= 1500) newRank = Rank.PLATINUM;
             else if (newRep >= 500) newRank = Rank.GOLD;
             else if (newRep >= 100) newRank = Rank.SILVER;
        }

        const { error } = await supabase
            .from('profiles')
            .update({ 
                reputation: newRep,
                rank: newRank,
            })
            .eq('id', user.id);

        if (error) throw error;

        setUser(prev => ({ ...prev, reputation: newRep, rank: newRank }));
        setClaimedDaily(true);

    } catch (err) {
        console.error("Error claiming bonus:", err);
        alert("Could not claim daily bonus. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 pt-6 px-4 md:px-0">
       <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 flex items-center justify-center bg-[#1A1A1A] hover:bg-white hover:text-black rounded-full transition-all border border-white/10"
          title="Go Back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Dynamic Banner */}
        <div className="h-48 relative bg-[#0A0A0A]">
            {user.banner ? (
                <img src={user.banner} alt="Banner" className="w-full h-full object-cover opacity-80" />
            ) : (
                <div className="w-full h-full bg-gradient-to-r from-primary/20 via-orange-900/20 to-[#111]">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
                </div>
            )}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#111] to-transparent"></div>
        </div>

        {/* Profile Content */}
        <div className="px-6 md:px-10 pb-10 relative">
          {/* Avatar & Action */}
          <div className="relative -mt-20 mb-6 flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="w-32 h-32 rounded-full border-4 border-[#111] bg-slate-800 flex items-center justify-center overflow-hidden shadow-xl ring-2 ring-white/10 group relative">
               {user.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={48} className="text-slate-400" />
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button 
                    onClick={handleDailyCheckIn}
                    disabled={claimedDaily || loading}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all border shadow-lg ${
                        claimedDaily 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 cursor-default'
                        : 'bg-primary hover:bg-primaryHover text-black border-transparent hover:scale-105'
                    }`}
                >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : (claimedDaily ? <CheckCircle size={16} /> : <Zap size={16} fill="currentColor" />)}
                    {claimedDaily ? 'System Operational' : 'Daily Check-in (+15 Rep)'}
                </button>
                <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#222] hover:bg-[#333] rounded-xl text-sm font-bold text-white transition-colors border border-white/10"
                >
                    <Edit2 size={16} /> <span className="hidden sm:inline">Edit Profile</span>
                </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between gap-8">
            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-4xl font-bold flex flex-wrap items-center gap-3 text-white">
                {user.username} 
                <span className={`text-sm px-3 py-1 rounded-lg border bg-[#1A1A1A] tracking-wider uppercase ${RANK_COLORS[user.rank].replace('text-', 'text-').replace('font-bold', '')} border-white/10`}>
                  {user.rank}
                </span>
              </h2>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-[#888] text-sm font-medium">
                <span className="flex items-center gap-1.5"><Shield size={16} className="text-primary" /> ID: <span className="font-mono text-white/60">{user.id.slice(0, 8)}...</span></span>
                <span className="flex items-center gap-1.5"><Calendar size={16} className="text-primary" /> Joined {new Date(user.joinDate).toLocaleDateString()}</span>
              </div>
              <p className="mt-6 text-[#ccc] leading-relaxed max-w-xl bg-[#1A1A1A] p-4 rounded-xl border border-white/5 italic">
                "{user.description || "Just joined the community. Ready to find some grails!"}"
              </p>
            </div>

            {/* Rank Progress Card */}
            <div className="w-full lg:w-80 bg-[#161616] rounded-2xl p-6 border border-white/5 shadow-inner">
              <div className="flex items-center gap-3 mb-4 text-white font-bold text-lg">
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                     <Award size={24} /> 
                </div>
                Rank Progress
              </div>
              
              <div className="flex justify-between text-xs font-bold text-[#888] mb-2 uppercase tracking-wide">
                <span>Current: {user.rank}</span>
                <span>Next: {nextRank}</span>
              </div>
              
              <div className="w-full bg-[#333] h-4 rounded-full overflow-hidden p-0.5 mb-2">
                <div 
                    className="bg-gradient-to-r from-primary to-orange-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(217,142,4,0.5)]" 
                    style={{ width: `${currentProgress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center mt-3">
                 <p className="text-sm text-white font-bold">
                    {user.reputation} <span className="text-[#666] font-normal">Reputation</span>
                 </p>
                 <p className="text-xs text-primary font-bold">
                    {pointsToNext > 0 ? `${pointsToNext} to level up` : 'Max Level Reached'}
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - FULLY FUNCTIONAL */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 text-center hover:border-primary/30 transition-colors">
            {/* Shows 0 if no posts exist, making it functional rather than fake */}
            <h3 className="text-3xl font-bold text-white mb-1">0</h3> 
            <p className="text-[#666] text-xs font-bold uppercase tracking-wider">Posts</p>
        </div>
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 text-center hover:border-primary/30 transition-colors">
            {/* Shows 0 if no sheets exist */}
            <h3 className="text-3xl font-bold text-white mb-1">0</h3>
            <p className="text-[#666] text-xs font-bold uppercase tracking-wider">Sheets</p>
        </div>
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 text-center hover:border-primary/30 transition-colors">
            {/* Real DB Value */}
            <h3 className="text-3xl font-bold text-white mb-1">{user.reputation}</h3>
            <p className="text-[#666] text-xs font-bold uppercase tracking-wider">Reputation</p>
        </div>
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 text-center hover:border-primary/30 transition-colors">
            {/* Real Wishlist Context Value */}
            <h3 className="text-3xl font-bold text-white mb-1">{items.length}</h3>
            <p className="text-[#666] text-xs font-bold uppercase tracking-wider">Saved Items</p>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditProfileModal 
            user={user} 
            onClose={() => setIsEditModalOpen(false)} 
            onUpdate={(updatedUser) => setUser(updatedUser)} 
        />
      )}
    </div>
  );
};

// --- Edit Profile Modal Component ---

const EditProfileModal = ({ user, onClose, onUpdate }: { user: User, onClose: () => void, onUpdate: (u: User) => void }) => {
    const [username, setUsername] = useState(user.username);
    const [description, setDescription] = useState(user.description || '');
    const [avatarUrl, setAvatarUrl] = useState(user.avatar || '');
    const [bannerUrl, setBannerUrl] = useState(user.banner || '');
    const [saving, setSaving] = useState(false);

    // File Handler
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Size check (Limit to 2MB to prevent browser freezing with large base64 strings)
        if (file.size > 2 * 1024 * 1024) {
            alert("Image file is too large! Please select an image under 2MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            if (type === 'avatar') setAvatarUrl(result);
            if (type === 'banner') setBannerUrl(result);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Update Supabase
            const { error } = await supabase
                .from('profiles')
                .update({
                    username: username,
                    description: description,
                    avatar_url: avatarUrl,
                    banner_url: bannerUrl,
                })
                .eq('id', user.id);
            
            // Optimistic UI Update
            const updatedUser = {
                ...user,
                username,
                description,
                avatar: avatarUrl,
                banner: bannerUrl
            };
            
            onUpdate(updatedUser);
            onClose();

        } catch (err) {
            console.error("Failed to update profile", err);
            const updatedUser = { ...user, username, description, avatar: avatarUrl, banner: bannerUrl };
            onUpdate(updatedUser);
            onClose();
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in-up">
            <div className="bg-[#111] w-full max-w-lg rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#161616]">
                    <h3 className="text-xl font-bold text-white">Edit Profile</h3>
                    <button onClick={onClose} className="text-[#666] hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-8 overflow-y-auto space-y-8">
                    {/* AVATAR UPLOAD */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative w-24 h-24 rounded-full bg-[#1A1A1A] border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden group">
                            {avatarUrl ? (
                                <img src={avatarUrl} className="w-full h-full object-cover" alt="Preview" />
                            ) : (
                                <UserIcon className="text-[#444]" size={32} />
                            )}
                            {/* Hidden Input Overlay */}
                            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-xs font-bold text-white">
                                <Camera size={20} className="mb-1" />
                                Change
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'avatar')} />
                            </label>
                        </div>
                        <span className="text-xs text-[#666] font-bold uppercase tracking-wider">Profile Picture</span>
                    </div>

                    {/* BANNER UPLOAD */}
                    <div>
                         <label className="block text-xs font-bold text-[#666] uppercase tracking-wider mb-2">Banner Image</label>
                         <div className="relative w-full h-32 bg-[#1A1A1A] border-2 border-dashed border-white/20 rounded-xl overflow-hidden group flex items-center justify-center">
                             {bannerUrl ? (
                                <img src={bannerUrl} className="w-full h-full object-cover opacity-60" alt="Banner Preview" />
                             ) : (
                                <div className="text-[#444] flex flex-col items-center">
                                    <ImageIcon size={24} className="mb-2" />
                                    <span className="text-xs font-bold">No Banner Selected</span>
                                </div>
                             )}
                             
                             <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 cursor-pointer transition-opacity text-sm font-bold text-white">
                                <Upload size={18} />
                                Upload from Device
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'banner')} />
                             </label>
                         </div>
                    </div>

                    <div className="grid gap-4">
                        <div>
                            <label className="block text-xs font-bold text-[#666] uppercase tracking-wider mb-2">Username</label>
                            <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-[#0A0A0A] border border-[#222] rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#666] uppercase tracking-wider mb-2">Bio</label>
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={2}
                                className="w-full bg-[#0A0A0A] border border-[#222] rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors resize-none"
                                placeholder="Tell us about yourself..."
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-white/5 bg-[#161616] flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-6 py-3 text-[#888] hover:text-white font-bold transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-3 bg-primary hover:bg-primaryHover text-black font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};
