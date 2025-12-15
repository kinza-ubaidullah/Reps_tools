import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Layout/Navbar';
import { ChatWidget } from './components/Chat/ChatWidget';
import { ShippingCalculator } from './pages/ShippingCalculator';
import { LinkConverter } from './pages/LinkConverter';
import { Search } from './pages/Search';
import { Tracking } from './pages/Tracking';
import { QCPhotos } from './pages/QCPhotos';
import { Home } from './pages/Home';
import { Community } from './pages/Community';
import { Sellers } from './pages/Sellers';
import { Profile } from './pages/Profile';
import { Wishlist } from './pages/Wishlist';
import { Admin } from './pages/Admin';
import { AuthModal } from './components/Auth/AuthModal';
import { User, Rank } from './types';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';
import { WishlistProvider } from './context/WishlistContext';
import { Loader2 } from 'lucide-react';

// Helper to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    // Only scroll to top if we are NOT on the /products subpage (which handles its own scrolling)
    if (pathname !== '/products') {
        window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
};

// Premium Preloader Component
const Preloader = () => (
  <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center animate-fade-out">
    <div className="relative">
      {/* Logo SVG */}
      <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
        <path d="M20 28H80" stroke="#B91C1C" strokeWidth="8" strokeLinecap="round"/>
        <path d="M35 28L25 85" stroke="#B91C1C" strokeWidth="8" strokeLinecap="round"/>
        <path d="M65 28L75 85" stroke="#B91C1C" strokeWidth="8" strokeLinecap="round"/>
        <path d="M30 55H70" stroke="#B91C1C" strokeWidth="8" strokeLinecap="round"/>
        <path d="M72 18C78 18 82 22 78 30C74 38 65 42 50 42" stroke="#15803D" strokeWidth="6" strokeLinecap="round"/>
        <path d="M50 42C35 42 22 46 22 56C22 66 32 72 50 72" stroke="#15803D" strokeWidth="6" strokeLinecap="round"/>
        <path d="M50 72C68 72 74 82 70 92" stroke="#15803D" strokeWidth="6" strokeLinecap="round"/>
        <circle cx="75" cy="20" r="2" fill="#EAB308" />
      </svg>
      {/* Spinner Ring */}
      <div className="absolute -inset-8 border-2 border-primary/20 rounded-full"></div>
      <div className="absolute -inset-8 border-t-2 border-primary rounded-full animate-spin"></div>
    </div>
    <div className="mt-8 flex flex-col items-center gap-2">
      <h2 className="text-2xl font-bold text-white tracking-widest">ANY<span className="text-primary">REPS</span></h2>
      <div className="flex items-center gap-2 text-[#666] text-xs font-bold uppercase tracking-wider">
         <Loader2 size={12} className="animate-spin" />
         Initializing Tools...
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [appReady, setAppReady] = useState(false);

  // Initial Preloader Logic
  useEffect(() => {
    // Simulate asset loading / connection check
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 2500); // 2.5 seconds preloader

    return () => clearTimeout(timer);
  }, []);

  // Initialize Supabase Auth Listener
  useEffect(() => {
    // Safety check: If Supabase isn't configured, skip auth logic
    if (!isSupabaseConfigured) {
        setSessionLoading(false);
        return;
    }

    // 1. Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
          fetchUserProfile(session.user.id, session.user.email);
      } else {
          setSessionLoading(false);
      }
    }).catch(err => {
      console.error("Auth session check failed", err);
      setSessionLoading(false);
    });

    // 2. Listen for changes (Login, Logout, Auto-refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUserProfile(session.user.id, session.user.email);
      } else {
        setUser(null);
        setSessionLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string, userEmail?: string) => {
      try {
          let { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
          
          // Handle "Row not found" or missing profile by creating one
          // This fixes issues where signups don't trigger database triggers
          if (!data) {
             console.log("Profile missing, creating default profile for:", userId);
             const newProfile = {
                id: userId,
                username: userEmail?.split('@')[0] || 'User',
                avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
                banner_url: '',
                rank: Rank.BRONZE,
                reputation: 0,
                description: 'Community Member'
             };

             const { data: createdData, error: insertError } = await supabase
                .from('profiles')
                .insert([newProfile])
                .select()
                .single();
             
             if (insertError) {
                 console.error("Failed to auto-create profile:", insertError);
                 // Fallback to local object so the app works even if DB insert fails temporarily
                 data = newProfile; 
             } else {
                 data = createdData;
             }
          }
          
          if (data) {
              setUser({
                  id: data.id,
                  username: data.username || 'User',
                  email: userEmail || '', // Email is in auth object
                  avatar: data.avatar_url,
                  banner: data.banner_url || '', // Fetch banner
                  rank: (data.rank as Rank) || Rank.BRONZE,
                  reputation: data.reputation || 0,
                  joinDate: data.created_at || new Date().toISOString(),
                  description: data.description || 'Community Member' // Fetch description
              });
          }
      } catch (err) {
          console.error("Error fetching profile:", err);
      } finally {
          setSessionLoading(false);
      }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
        await supabase.auth.signOut();
    } else {
        setUser(null);
    }
    window.location.hash = '/';
  };

  // Show Preloader until app is "ready" (time delay) AND session check is done
  if (!appReady || sessionLoading) {
      return <Preloader />;
  }

  return (
    <WishlistProvider>
        <div className="flex h-screen w-full overflow-hidden bg-[#050505] text-white font-sans selection:bg-primary/30 selection:text-white">
        <ScrollToTop />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            <Navbar 
            user={user} 
            onLoginClick={() => setIsAuthOpen(true)} 
            onLogout={handleLogout}
            />

            <main className="flex-1 overflow-y-auto scroll-smooth relative no-scrollbar bg-[#050505]">
                <Routes>
                {/* Core Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Home />} />
                
                {/* Feature Routes */}
                <Route path="/calculator" element={<ShippingCalculator />} />
                <Route path="/converter" element={<LinkConverter />} />
                <Route path="/search" element={<Search />} />
                <Route path="/tracking" element={<Tracking />} />
                <Route path="/qc" element={<QCPhotos />} />
                
                {/* Community & User Routes */}
                <Route path="/community/*" element={<Community />} />
                <Route path="/sellers" element={<Sellers />} />
                <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/" />} />
                <Route path="/wishlist" element={<Wishlist />} />
                
                {/* Admin Route - Protected */}
                <Route 
                    path="/admin" 
                    element={user?.rank === Rank.ADMIN ? <Admin /> : <Navigate to="/" />} 
                />
                
                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
            
            {/* Global Chat Widget */}
            <ChatWidget user={user} onLoginRequest={() => setIsAuthOpen(true)} />
        </div>

        {/* Auth Modal */}
        {isAuthOpen && (
            <AuthModal 
            onClose={() => setIsAuthOpen(false)} 
            onLogin={() => {}} // Handled by listener
            />
        )}
        </div>
    </WishlistProvider>
  );
};

export default App;