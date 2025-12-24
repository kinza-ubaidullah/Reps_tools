<<<<<<< HEAD

=======
>>>>>>> f6c8322 (Sure! Pl)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  DollarSign, 
  Activity, 
  Shield, 
  Trash2, 
  Plus, 
  Search, 
  CheckCircle,
  BarChart3,
  ExternalLink,
  Server,
  Database,
  Truck,
  ArrowLeft,
  X,
  BookOpen,
  Lock,
  Globe,
  Gamepad2,
  Key,
  Edit2,
  Save,
  MoreHorizontal,
  AlertTriangle,
  BrainCircuit,
  Loader2,
  FileSpreadsheet,
<<<<<<< HEAD
  Settings
=======
  Settings,
  Copy,
  Terminal
>>>>>>> f6c8322 (Sure! Pl)
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { User, Rank, Seller, Spreadsheet } from '../types';
import { addSpreadsheet, deleteSpreadsheet, fetchSpreadsheets } from '../services/spreadsheetService';
import { RANK_COLORS } from '../constants';

const AdminStats = ({ userCount }: { userCount: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-[#111] border border-white/5 p-6 rounded-[24px] flex items-center gap-4 hover:border-white/10 transition-colors shadow-lg">
      <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
        <Users size={24} />
      </div>
      <div>
        <p className="text-[#666] text-sm font-bold uppercase tracking-wider">Total Users</p>
        <h3 className="text-3xl font-bold text-white mt-1">{userCount.toLocaleString()}</h3>
        <p className="text-emerald-400 text-xs font-bold flex items-center gap-1 mt-1">
          <Activity size={12} /> Real-time Data
        </p>
      </div>
    </div>
    <div className="bg-[#111] border border-white/5 p-6 rounded-[24px] flex items-center gap-4 hover:border-white/10 transition-colors shadow-lg">
      <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
        <DollarSign size={24} />
      </div>
      <div>
        <p className="text-[#666] text-sm font-bold uppercase tracking-wider">Est. Revenue</p>
        <h3 className="text-3xl font-bold text-white mt-1">$0.00</h3>
        <p className="text-[#666] text-xs font-bold mt-1">Affiliate Not Configured</p>
      </div>
    </div>
    <div className="bg-[#111] border border-white/5 p-6 rounded-[24px] flex items-center gap-4 hover:border-white/10 transition-colors shadow-lg">
      <div className="p-4 bg-pink-500/10 text-pink-400 rounded-2xl border border-pink-500/20">
        <BarChart3 size={24} />
      </div>
      <div>
        <p className="text-[#666] text-sm font-bold uppercase tracking-wider">Conversions</p>
        <h3 className="text-3xl font-bold text-white mt-1">0</h3>
        <p className="text-[#666] text-xs font-bold mt-1">Total links generated</p>
      </div>
    </div>
  </div>
);

const ConfigManager = () => {
    const [appId, setAppId] = useState('');
    const [secret, setSecret] = useState('');
    const [invite, setInvite] = useState('');
    const [rapidKey, setRapidKey] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        const { data } = await supabase.from('app_settings').select('*');
        if(data) {
            data.forEach(item => {
                if(item.key === 'qc_app_id') setAppId(item.value);
                if(item.key === 'qc_secret') setSecret(item.value);
                if(item.key === 'qc_invite') setInvite(item.value);
                if(item.key === 'rapid_api_key') setRapidKey(item.value);
            });
        }
    };

    const saveConfig = async () => {
        setLoading(true);
        try {
            await supabase.from('app_settings').upsert([
                { key: 'qc_app_id', value: appId },
                { key: 'qc_secret', value: secret },
                { key: 'qc_invite', value: invite },
                { key: 'rapid_api_key', value: rapidKey }
            ]);
            alert("Configuration Saved to Database!");
        } catch (e: any) {
            alert("Error saving config: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#111] border border-white/5 rounded-[24px] overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-white/5 bg-[#161616] flex items-center gap-2">
                <Settings size={20} className="text-primary" />
                <h3 className="text-lg font-bold text-white">Backend Configuration</h3>
            </div>
            <div className="p-8 space-y-6">
                 
                 {/* QC SECTION */}
                 <div>
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Server size={16} /> QC Service (Pointshaul)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-[#666] uppercase tracking-wider mb-2">Pointshaul App ID</label>
                            <input type="text" value={appId} onChange={e => setAppId(e.target.value)} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#666] uppercase tracking-wider mb-2">Pointshaul Secret Key</label>
                            <input type="password" value={secret} onChange={e => setSecret(e.target.value)} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#666] uppercase tracking-wider mb-2">Invite Code</label>
                            <input type="text" value={invite} onChange={e => setInvite(e.target.value)} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
                        </div>
                    </div>
                 </div>

                 <div className="border-t border-white/5 my-6"></div>

                 {/* RAPID API SECTION */}
                 <div>
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Globe size={16} /> Product Search (RapidAPI)</h4>
                    <div>
                        <label className="block text-xs font-bold text-[#666] uppercase tracking-wider mb-2">RapidAPI Key (Taobao Advanced)</label>
                        <input type="password" value={rapidKey} onChange={e => setRapidKey(e.target.value)} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" placeholder="e.g. e20bdb..." />
                    </div>
                 </div>

                 <div className="pt-4 border-t border-white/5">
                    <button onClick={saveConfig} disabled={loading} className="px-6 py-3 bg-primary hover:bg-primaryHover text-black font-bold rounded-xl transition-all shadow-lg flex items-center gap-2">
                        {loading ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />}
                        Save All Secrets
                    </button>
                 </div>
            </div>
        </div>
    );
};

const SpreadsheetManager = () => {
    const [sheets, setSheets] = useState<Spreadsheet[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTitle, setNewTitle] = useState('');
    const [newItemCount, setNewItemCount] = useState('');
    const [newLink, setNewLink] = useState('');
    const [newAuthor, setNewAuthor] = useState('Admin');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const data = await fetchSpreadsheets();
        setSheets(data);
        setLoading(false);
    };

    const handleAdd = async () => {
        if (!newTitle || !newLink) return;
        try {
            await addSpreadsheet({
                title: newTitle,
                items: newItemCount || '0',
                link: newLink,
                author: newAuthor
            });
            setNewTitle('');
            setNewLink('');
            setNewItemCount('');
            loadData();
        } catch (e) {
            alert("Error adding sheet");
        }
    };

    const handleDelete = async (id: number) => {
        if(confirm("Delete this spreadsheet?")) {
            await deleteSpreadsheet(id);
            loadData();
        }
    }

    return (
        <div className="bg-[#111] border border-white/5 rounded-[24px] overflow-hidden animate-fade-in-up mt-8">
            <div className="p-6 border-b border-white/5 bg-[#161616] flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileSpreadsheet size={20} className="text-green-500" /> Manage Spreadsheets
                </h3>
            </div>
            
            {/* Add Form */}
            <div className="p-6 bg-[#0A0A0A] border-b border-white/5 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                    <label className="text-xs font-bold text-[#666] uppercase mb-1 block">Title</label>
                    <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-2 text-white text-sm" placeholder="e.g. Budget Finds" />
                </div>
                <div>
                     <label className="text-xs font-bold text-[#666] uppercase mb-1 block">Items Count</label>
                    <input type="text" value={newItemCount} onChange={e => setNewItemCount(e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-2 text-white text-sm" placeholder="e.g. 1.5k" />
                </div>
                 <div>
                     <label className="text-xs font-bold text-[#666] uppercase mb-1 block">Link</label>
                    <input type="text" value={newLink} onChange={e => setNewLink(e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-2 text-white text-sm" placeholder="https://..." />
                </div>
                <button onClick={handleAdd} className="bg-primary hover:bg-primaryHover text-black font-bold p-2 rounded-lg text-sm h-[38px]">
                    Add Sheet
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-[#1A1A1A] text-[#666] text-xs font-bold uppercase">
                        <tr>
                            <th className="p-4">Title</th>
                            <th className="p-4">Items</th>
                            <th className="p-4">Link</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                        {sheets.map(s => (
                            <tr key={s.id} className="hover:bg-[#1A1A1A]">
                                <td className="p-4 text-white font-bold">{s.title}</td>
                                <td className="p-4 text-[#888]">{s.items}</td>
                                <td className="p-4 text-blue-400 truncate max-w-[150px]">{s.link}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-white"><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const SellersManager = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [sellerName, setSellerName] = useState('');
  const [sellerCategory, setSellerCategory] = useState('');
  const [sellerStatus, setSellerStatus] = useState<any>('Pending');
  const [sellerLink, setSellerLink] = useState('');

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
      try {
          const { data, error } = await supabase
            .from('trusted_sellers')
            .select('*')
            .order('id', { ascending: false });
          
          if (error) throw error;
          if (data) setSellers(data as Seller[]);
      } catch (err) {
          console.error("Fetch Sellers Error", err);
      } finally {
          setLoading(false);
      }
  }

  const handleDelete = async (id: number) => {
    if(window.confirm("Are you sure you want to delete this seller?")) {
        try {
            const { error } = await supabase.from('trusted_sellers').delete().eq('id', id);
            if (error) throw error;
            setSellers(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            alert("Error deleting seller");
        }
    }
  };

  const openEditModal = (seller: Seller) => {
      setEditingId(seller.id);
      setSellerName(seller.name);
      setSellerCategory(seller.category);
      setSellerStatus(seller.status);
      setSellerLink(seller.link || '');
      setIsModalOpen(true);
  };

  const openAddModal = () => {
      setEditingId(null);
      setSellerName('');
      setSellerCategory('');
      setSellerLink('');
      setSellerStatus('Pending');
      setIsModalOpen(true);
  }

  const handleSave = async () => {
    if (!sellerName || !sellerCategory) return;

    try {
        if (editingId) {
            // Update
            const { error } = await supabase
                .from('trusted_sellers')
                .update({ name: sellerName, category: sellerCategory, status: sellerStatus, link: sellerLink })
                .eq('id', editingId);
            if (error) throw error;
        } else {
            // Insert
            const { error } = await supabase
                .from('trusted_sellers')
                .insert({ name: sellerName, category: sellerCategory, status: sellerStatus, link: sellerLink });
            if (error) throw error;
        }
        
        await fetchSellers(); // Refresh list
        setIsModalOpen(false);
    } catch (err: any) {
        alert("Error saving: " + err.message);
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
      const nextStatus = currentStatus === 'Trusted' ? 'Pending' : currentStatus === 'Pending' ? 'Rejected' : 'Trusted';
      try {
          const { error } = await supabase.from('trusted_sellers').update({ status: nextStatus }).eq('id', id);
          if (error) throw error;
          
          setSellers(prev => prev.map(s => s.id === id ? { ...s, status: nextStatus as any } : s));
      } catch (err) {
          console.error("Status toggle failed", err);
      }
  };

  return (
    <div className="bg-[#111] border border-white/5 rounded-[24px] overflow-hidden">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#161616]">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Manage Sellers
            <span className="text-xs font-normal text-[#666] ml-2">(DB: trusted_sellers)</span>
        </h3>
        <button 
            onClick={openAddModal}
            className="px-4 py-2 bg-primary hover:bg-primaryHover text-black rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
        >
          <Plus size={16} /> Add Seller
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
            <thead className="bg-[#0A0A0A] text-[#666] text-xs font-bold uppercase tracking-wider">
            <tr>
                <th className="p-5">Name</th>
                <th className="p-5">Category</th>
                <th className="p-5">Status (Click to toggle)</th>
                <th className="p-5 text-right">Actions</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
            {loading ? (
                <tr>
                    <td colSpan={4} className="p-8 text-center text-[#666]">
                        <Loader2 className="animate-spin inline mr-2" /> Loading Database...
                    </td>
                </tr>
            ) : sellers.map((s) => (
                <tr key={s.id} className="hover:bg-[#1A1A1A] transition-colors">
                <td className="p-5 font-bold text-white">{s.name}</td>
                <td className="p-5 text-[#888] text-sm font-medium">{s.category}</td>
                <td className="p-5">
                    <button 
                        onClick={() => toggleStatus(s.id, s.status)}
                        className={`text-[10px] px-2 py-1 rounded-lg font-bold uppercase tracking-wide border transition-all hover:scale-105 ${
                            s.status === 'Trusted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                            s.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}
                    >
                    {s.status}
                    </button>
                </td>
                <td className="p-5 text-right flex items-center justify-end gap-2">
                    <button 
                        onClick={() => openEditModal(s)}
                        className="p-2 text-[#666] hover:text-white transition-colors bg-[#0A0A0A] rounded-lg border border-white/5 hover:border-white/20"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button 
                        onClick={() => handleDelete(s.id)}
                        className="p-2 text-[#666] hover:text-red-400 transition-colors bg-[#0A0A0A] rounded-lg border border-white/5 hover:border-red-500/30"
                    >
                        <Trash2 size={16} />
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in-up">
            <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">{editingId ? 'Edit Seller' : 'Add New Seller'}</h3>
                    <button onClick={() => setIsModalOpen(false)}><X className="text-[#666] hover:text-white" /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-[#666] uppercase tracking-wider block mb-2">Seller Name</label>
                        <input 
                            type="text" 
                            placeholder="Seller Name" 
                            value={sellerName}
                            onChange={(e) => setSellerName(e.target.value)}
                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-[#666] uppercase tracking-wider block mb-2">Category</label>
                        <input 
                            type="text" 
                            placeholder="Category (e.g. Shoes)" 
                            value={sellerCategory}
                            onChange={(e) => setSellerCategory(e.target.value)}
                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                        />
                    </div>
                     <div>
                        <label className="text-xs font-bold text-[#666] uppercase tracking-wider block mb-2">Store Link</label>
                        <input 
                            type="text" 
                            placeholder="https://..." 
                            value={sellerLink}
                            onChange={(e) => setSellerLink(e.target.value)}
                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-[#666] uppercase tracking-wider block mb-2">Status</label>
                        <select 
                            value={sellerStatus}
                            onChange={(e) => setSellerStatus(e.target.value)}
                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Trusted">Trusted</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    <button 
                        onClick={handleSave}
                        className="w-full bg-primary hover:bg-primaryHover text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        <Save size={18} /> {editingId ? 'Save Changes' : 'Add Seller'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

const UsersManager = ({ onUserCountChange }: { onUserCountChange: (count: number) => void }) => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (data) {
                const mappedUsers = data.map(u => ({
                    id: u.id,
                    username: u.username || 'Unknown',
                    email: 'Hidden (Auth)', 
                    rank: u.rank || Rank.BRONZE,
                    reputation: u.reputation || 0,
                    joined: new Date(u.created_at).toLocaleDateString()
                }));
                setUsers(mappedUsers);
                onUserCountChange(mappedUsers.length);
            }
        } catch (err) {
            console.error("Error fetching users", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRankChange = async (userId: string, newRank: string) => {
        if (!confirm(`Are you sure you want to change this user's rank to ${newRank}?`)) return;
        
        setUpdating(userId);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ rank: newRank })
                .eq('id', userId);

            if (error) throw error;

            // Optimistic Update
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, rank: newRank } : u));
            alert("User rank updated successfully.");
        } catch (err) {
            console.error("Error updating rank:", err);
            alert("Failed to update rank.");
        } finally {
            setUpdating(null);
        }
    };

    const filteredUsers = users.filter(u => u.username.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-[#111] border border-white/5 rounded-[24px] overflow-hidden">
      <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center bg-[#161616] gap-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
            User Management
            {loading && <span className="text-xs text-primary animate-pulse">Syncing...</span>}
        </h3>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-2.5 text-[#666]" size={16} />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#0A0A0A] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm focus:border-primary outline-none text-white w-full md:w-64 font-medium"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
            <thead className="bg-[#0A0A0A] text-[#666] text-xs font-bold uppercase tracking-wider">
            <tr>
                <th className="p-5">User</th>
                <th className="p-5">Stats</th>
                <th className="p-5">Rank (Editable)</th>
                <th className="p-5">Joined</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
            {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#1A1A1A] transition-colors">
                <td className="p-5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-white uppercase">
                        {u.username.charAt(0)}
                    </div>
                    <div>
                        <span className="font-bold text-white block">{u.username}</span>
                        <span className="text-[10px] text-[#666] font-mono">{u.id.slice(0, 8)}...</span>
                    </div>
                </td>
                <td className="p-5 text-[#888] text-sm font-medium">
                    {u.reputation} Rep
                </td>
                <td className="p-5">
                    {updating === u.id ? (
                        <span className="text-xs text-primary animate-pulse">Updating...</span>
                    ) : (
                        <select 
                            value={u.rank}
                            onChange={(e) => handleRankChange(u.id, e.target.value)}
                            className={`text-xs px-2 py-1.5 rounded font-bold uppercase tracking-wide bg-[#222] text-white border border-white/10 outline-none focus:border-primary cursor-pointer`}
                        >
                            <option value={Rank.BRONZE}>Bronze</option>
                            <option value={Rank.SILVER}>Silver</option>
                            <option value={Rank.GOLD}>Gold</option>
                            <option value={Rank.PLATINUM}>Platinum</option>
                            <option value={Rank.ADMIN}>Admin</option>
                        </select>
                    )}
                </td>
                <td className="p-5 text-[#666] text-sm">{u.joined}</td>
                </tr>
            )) : (
                <tr>
                    <td colSpan={5} className="p-8 text-center text-[#666]">
                        {loading ? "Loading users..." : "No users found in database."}
                    </td>
                </tr>
            )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

<<<<<<< HEAD
const AccessSetupGuide = () => (
    <div className="animate-fade-in-up space-y-8">
        
        {/* API Credentials */}
        <div className="bg-[#111] border border-white/5 rounded-[24px] p-8">
             <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 border border-emerald-500/20">
                    <Key size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">API Credentials Setup</h2>
                    <p className="text-[#666] text-sm font-medium">Get your own keys to unlock full features.</p>
                </div>
             </div>

             <div className="space-y-6">
                 {/* QC API Keys */}
                 <div className="bg-[#1A1A1A] border border-white/10 p-6 rounded-2xl">
                     <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Server size={18} className="text-primary" /> 1. QC Service (Pointshaul)
                     </h4>
                     <ol className="list-decimal list-inside text-sm text-[#888] space-y-2 mb-4">
                        <li>Go to <b>pointshaul.com</b> and register for an account.</li>
                        <li>Navigate to the API section to generate an <b>App ID</b> and <b>Secret Key</b>.</li>
                        <li>You may also need an <b>Invite Code</b> from their Discord.</li>
                        <li>Paste these keys in the <b>Config Tab</b> above.</li>
                     </ol>
                 </div>

                 {/* Rapid API Keys */}
                 <div className="bg-[#1A1A1A] border border-white/10 p-6 rounded-2xl">
                     <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Globe size={18} className="text-blue-500" /> 2. Product Search (RapidAPI)
                     </h4>
                     <ol className="list-decimal list-inside text-sm text-[#888] space-y-2 mb-4">
                        <li>Go to <b>rapidapi.com</b> and search for "Taobao Advanced".</li>
                        <li>Subscribe to a plan (Free or Pro).</li>
                        <li>Copy your <b>X-RapidAPI-Key</b>.</li>
                        <li>Paste it in the <b>Config Tab</b> above.</li>
                     </ol>
                     <div className="bg-blue-500/10 text-blue-400 p-3 rounded-xl text-xs border border-blue-500/20">
                        <b>Note:</b> The default key used in the app is shared and often hits rate limits. Using your own key ensures 100% uptime.
=======
const AccessSetupGuide = () => {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    return (
        <div className="animate-fade-in-up space-y-8">
            
            {/* 403 FIX SECTION */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-[24px] p-8 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <AlertTriangle size={120} />
                 </div>
                 
                 <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="p-3 bg-red-500/10 rounded-xl text-red-500 border border-red-500/20">
                        <Terminal size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Fix 403 Authentication Error</h2>
                        <p className="text-red-400/80 text-sm font-medium">Follow these exact steps to enable Google/Discord login.</p>
                    </div>
                 </div>

                 <div className="space-y-6 relative z-10">
                    <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-white/5 space-y-4">
                        <p className="text-white text-sm font-medium">Aapko ye URL apne Supabase Dashboard mein add karna hoga:</p>
                        
                        <div className="flex items-center gap-3 bg-[#111] p-4 rounded-xl border border-white/10 group/item">
                            <code className="flex-1 text-primary font-mono text-sm">{window.location.origin}</code>
                            <button 
                                onClick={() => copyToClipboard(window.location.origin)}
                                className="p-2 hover:bg-white/10 rounded-lg text-[#666] hover:text-white transition-all"
                            >
                                <Copy size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                             <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                <span className="text-[10px] font-bold text-primary uppercase block mb-1">Step 1</span>
                                <p className="text-xs text-slate-300">Supabase Dashboard {'>'} <b>Authentication</b> {'>'} <b>URL Configuration</b></p>
                             </div>
                             <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                <span className="text-[10px] font-bold text-primary uppercase block mb-1">Step 2</span>
                                <p className="text-xs text-slate-300"><b>Site URL</b> aur <b>Redirect URLs</b> mein oper wala URL paste karein.</p>
                             </div>
                        </div>
                    </div>
                 </div>
            </div>

            {/* API Credentials */}
            <div className="bg-[#111] border border-white/5 rounded-[24px] p-8">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 border border-emerald-500/20">
                        <Key size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">API Credentials Setup</h2>
                        <p className="text-[#666] text-sm font-medium">Get your own keys to unlock full features.</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                     {/* QC API Keys */}
                     <div className="bg-[#1A1A1A] border border-white/10 p-6 rounded-2xl">
                         <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Server size={18} className="text-primary" /> 1. QC Service (Pointshaul)
                         </h4>
                         <ol className="list-decimal list-inside text-sm text-[#888] space-y-2 mb-4">
                            <li>Go to <b>pointshaul.com</b> and register for an account.</li>
                            <li>Navigate to the API section to generate an <b>App ID</b> and <b>Secret Key</b>.</li>
                            <li>You may also need an <b>Invite Code</b> from their Discord.</li>
                            <li>Paste these keys in the <b>Config Tab</b> above.</li>
                         </ol>
                     </div>

                     {/* Rapid API Keys */}
                     <div className="bg-[#1A1A1A] border border-white/10 p-6 rounded-2xl">
                         <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Globe size={18} className="text-blue-500" /> 2. Product Search (RapidAPI)
                         </h4>
                         <ol className="list-decimal list-inside text-sm text-[#888] space-y-2 mb-4">
                            <li>Go to <b>rapidapi.com</b> and search for "Taobao Advanced".</li>
                            <li>Subscribe to a plan (Free or Pro).</li>
                            <li>Copy your <b>X-RapidAPI-Key</b>.</li>
                            <li>Paste it in the <b>Config Tab</b> above.</li>
                         </ol>
                     </div>
                 </div>
            </div>

            {/* Database Setup */}
             <div className="bg-[#111] border border-white/5 rounded-[24px] p-8">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500 border border-indigo-500/20">
                        <Database size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Database Setup (Supabase)</h2>
                        <p className="text-[#666] text-sm font-medium">Run this SQL to create the backend tables for these keys.</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                     <div className="bg-black/40 p-4 rounded-xl border border-white/10 font-mono text-xs text-gray-300 overflow-x-auto">
                        <p className="text-[#666] mb-2">-- 1. Create App Settings (For storing secrets)</p>
                        <code className="block text-emerald-400 mb-4">
                            create table app_settings (<br/>
                            &nbsp;&nbsp;key text primary key,<br/>
                            &nbsp;&nbsp;value text<br/>
                            );
                        </code>
>>>>>>> f6c8322 (Sure! Pl)
                     </div>
                 </div>
             </div>
        </div>
<<<<<<< HEAD

        {/* Database Setup */}
         <div className="bg-[#111] border border-white/5 rounded-[24px] p-8">
             <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500 border border-indigo-500/20">
                    <Database size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Database Setup (Supabase)</h2>
                    <p className="text-[#666] text-sm font-medium">Run this SQL to create the backend tables for these keys.</p>
                </div>
             </div>

             <div className="space-y-4">
                 <div className="bg-black/40 p-4 rounded-xl border border-white/10 font-mono text-xs text-gray-300 overflow-x-auto">
                    <p className="text-[#666] mb-2">-- 1. Create App Settings (For storing secrets)</p>
                    <code className="block text-emerald-400 mb-4">
                        create table app_settings (<br/>
                        &nbsp;&nbsp;key text primary key,<br/>
                        &nbsp;&nbsp;value text<br/>
                        );
                    </code>
                 </div>
             </div>
         </div>
    </div>
);
=======
    );
};
>>>>>>> f6c8322 (Sure! Pl)

const SystemStatusReport = () => (
    <div className="space-y-6 animate-fade-in-up">
        
        <div className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 p-6 rounded-[24px]">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                <Server className="text-primary" /> System Status Report
            </h2>
            <p className="text-slate-300 font-medium max-w-2xl">
                System is running in <span className="text-primary font-bold">Pro Plan Mode</span>. 
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#111] border border-white/5 rounded-[24px] p-6 relative group hover:border-emerald-500/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Database size={18} className="text-emerald-500" /> Database Connection
                    </h3>
                    <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-1 rounded border border-emerald-500/20 font-bold uppercase">Connected</span>
                </div>
                <div className="bg-[#0A0A0A] p-4 rounded-xl border border-white/5">
                     <p className="text-emerald-400 text-sm font-bold flex items-center gap-2">
                          <CheckCircle size={14} /> Sellers & Users Synced
                     </p>
                </div>
            </div>

            <div className="bg-[#111] border border-white/5 rounded-[24px] p-6 relative group hover:border-blue-500/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Search size={18} className="text-blue-500" /> Taobao Search (Pro)
                    </h3>
                    <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-1 rounded border border-emerald-500/20 font-bold uppercase">Active</span>
                </div>
                <div className="bg-[#0A0A0A] p-4 rounded-xl border border-white/5">
                    <p className="text-emerald-400 text-sm font-bold flex items-center gap-2">
                        <CheckCircle size={14} /> Locked to taobao-advanced.p.rapidapi.com
                    </p>
                </div>
            </div>

            <div className="bg-[#111] border border-white/5 rounded-[24px] p-6 relative group hover:border-indigo-500/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <BrainCircuit size={18} className="text-indigo-500" /> QC Caching
                    </h3>
                    <span className="bg-indigo-500/10 text-indigo-400 text-[10px] px-2 py-1 rounded border border-indigo-500/20 font-bold uppercase">Optimized</span>
                </div>
                <div className="bg-[#0A0A0A] p-4 rounded-xl border border-white/5">
                    <p className="text-indigo-400 text-sm font-bold flex items-center gap-2">
                        <CheckCircle size={14} /> Saving API Credits
                    </p>
                    <p className="text-xs text-[#666] mt-1">Checks DB before fetching external APIs</p>
                </div>
            </div>
        </div>
    </div>
);

export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'status' | 'access' | 'config'>('access');
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);

  return (
    <div className="min-h-screen bg-[#050505] pt-28">
      <div className="sticky top-24 z-30 bg-[#050505]/95 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between relative mb-8 gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
             <button onClick={() => navigate('/')} className="p-2 hover:bg-white/10 rounded-full transition-colors text-[#666] hover:text-white mr-2"><ArrowLeft size={24} /></button>
             <Shield size={28} className="text-red-500 shrink-0" />
             <h1 className="text-xl md:text-2xl font-bold text-white whitespace-nowrap">Admin Dashboard</h1>
          </div>
          <div className="flex gap-2 bg-[#1A1A1A] p-1 rounded-lg border border-white/5 overflow-x-auto max-w-full no-scrollbar">
              <button onClick={() => setActiveTab('access')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'access' ? 'bg-white text-black shadow-lg' : 'text-[#666] hover:text-white'}`}><BookOpen size={14} /> Setup</button>
              <button onClick={() => setActiveTab('config')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'config' ? 'bg-white text-black shadow-lg' : 'text-[#666] hover:text-white'}`}><Settings size={14} /> Config</button>
              <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-white text-black shadow-lg' : 'text-[#666] hover:text-white'}`}>Content</button>
              <button onClick={() => setActiveTab('users')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-white text-black shadow-lg' : 'text-[#666] hover:text-white'}`}>Users</button>
              <button onClick={() => setActiveTab('status')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'status' ? 'bg-primary text-black shadow-lg' : 'text-[#666] hover:text-white'}`}>Status</button>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 pb-12">
        {activeTab === 'status' && <SystemStatusReport />}
        {activeTab === 'dashboard' && <div className="animate-fade-in-up space-y-8"><AdminStats userCount={userCount} /><SellersManager /><SpreadsheetManager /></div>}
        {activeTab === 'users' && <div className="animate-fade-in-up"><UsersManager onUserCountChange={setUserCount} /></div>}
        {activeTab === 'access' && <AccessSetupGuide />}
        {activeTab === 'config' && <ConfigManager />}
      </div>
    </div>
  );
<<<<<<< HEAD
};
=======
};
>>>>>>> f6c8322 (Sure! Pl)
