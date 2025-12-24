
import React, { useState } from 'react';
import { X, Mail, Loader2, AlertCircle, Info } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: any) => void; 
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle Login/Signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // For Signup
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // New state to handle email verification flow
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNeedsVerification(false);

    if (!isSupabaseConfigured) {
        setError("Supabase is not configured. Please add your credentials in services/supabaseClient.ts");
        return;
    }

    setLoading(true);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    const cleanUsername = username.trim();

    try {
        if (isLogin) {
            // LOGIN
            const { error } = await supabase.auth.signInWithPassword({
                email: cleanEmail,
                password: cleanPassword,
            });
            if (error) throw error;
            // Success: App.tsx listener will handle the rest
            onClose();
        } else {
            // SIGNUP
            const { error } = await supabase.auth.signUp({
                email: cleanEmail,
                password: cleanPassword,
                options: {
                    // We keep emailRedirectTo for email links as it helps users return to the correct page
                    emailRedirectTo: window.location.origin,
                    data: {
                        username: cleanUsername,
                        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`
                    }
                }
            });
            if (error) throw error;
            
            setNeedsVerification(true);
        }
    } catch (err: any) {
        console.error("Auth Error:", err);
        let msg = err.message || 'Authentication failed';
        
        if (msg.includes('Email not confirmed')) {
            setNeedsVerification(true); 
            setLoading(false);
            return; 
        } else if (msg.includes('Invalid login credentials')) {
            msg = 'Incorrect email or password. Please try again.';
        } else if (msg.toLowerCase().includes('invalid email')) {
            msg = 'The email address format is invalid. Check for spaces.';
        }
        
        setError(msg);
    } finally {
        setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setResendLoading(true);
    const cleanEmail = email.trim();
    try {
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: cleanEmail,
            options: {
                emailRedirectTo: window.location.origin
            }
        });
        if (error) throw error;
        alert("Confirmation email resent! Please check your inbox (and spam folder).");
    } catch (err: any) {
        alert("Error resending email: " + err.message);
    } finally {
        setResendLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'discord') => {
      if (!isSupabaseConfigured) {
        setError("Supabase is not configured.");
        return;
      }
      
      setLoading(true);
      setError('');

      try {
          // Explicitly setting redirectTo ensures the user comes back to the exact same environment (localhost or vercel)
          // This REQUIRES the URL (e.g., http://localhost:5173/**) to be whitelisted in Supabase Dashboard > Auth > URL Configuration.
          // Ensure the OAuth callback returns to a hash route so the app router can handle it (e.g. http://localhost:5173/#/)
          const redirectTo = window.location.origin + '/#/';
          console.log('Starting social login', provider, 'redirectTo=', redirectTo);
          const res = await supabase.auth.signInWithOAuth({
              provider: provider,
              options: {
                  redirectTo
              }
          });
          console.log('signInWithOAuth result', res);
          if (res.error) throw res.error;
      } catch (err: any) {
          setLoading(false);
          console.error("Social Auth Error:", err);
          
          // Helper messages for common configuration errors
          if (err.message && (err.message.includes('provider is not enabled') || err.message.includes('supported'))) {
              setError(`The ${provider} login is not enabled in your Supabase Dashboard. Please enable it in 'Auth > Providers'.`);
          } else if (err.message && (err.message.includes('redirect_uri_mismatch') || err.message.includes('Mismatching redirect URI'))) {
               setError(`Configuration Error: Please add "${window.location.origin}/**" to Redirect URLs in your Supabase Dashboard.`);
          } else {
              setError(err.message || "An error occurred during social login.");
          }
      }
  };

  // --- RENDER: VERIFICATION SCREEN ---
  if (needsVerification) {
      return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in-up">
            <div className="bg-[#111] w-full max-w-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative p-8 text-center">
                <button onClick={onClose} className="absolute top-4 right-4 text-[#666] hover:text-white transition-colors">
                    <X size={24} />
                </button>
                
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary ring-1 ring-primary/30">
                    <Mail size={32} />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-3">Check your email</h2>
                <p className="text-[#888] mb-8 leading-relaxed text-sm">
                    We've sent a confirmation link to <br/>
                    <span className="text-white font-bold text-base">{email}</span>. 
                    <br/><br/>
                    Please check your inbox (and spam folder) to activate your account before logging in.
                </p>
                
                <div className="space-y-3">
                    <button 
                        onClick={handleResendEmail}
                        disabled={resendLoading}
                        className="w-full py-3 bg-[#222] hover:bg-white hover:text-black text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-white/5"
                    >
                        {resendLoading ? <Loader2 className="animate-spin" size={18} /> : 'Resend Confirmation Email'}
                    </button>
                    <button 
                        onClick={() => { setNeedsVerification(false); setIsLogin(true); }}
                        className="w-full py-3 text-[#666] hover:text-white font-bold transition-colors text-sm"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
      );
  }

  // --- RENDER: LOGIN/SIGNUP FORM ---
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in-up">
      <div className="bg-[#111] w-full max-w-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#666] hover:text-white transition-colors">
          <X size={24} />
        </button>
        
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center mb-2 text-white">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-[#666] text-center mb-6 text-sm">
            {isLogin ? 'Login to access your tools and community.' : 'Join the fastest growing reps community.'}
          </p>

          {/* Social Logins */}
          <div className="space-y-3">
            <button 
              onClick={() => handleSocialLogin('google')}
              className="w-full py-3 bg-white hover:bg-gray-200 text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-3 text-sm"
            >
              <img src="https://www.google.com/favicon.ico" alt="G" className="w-5 h-5" />
              Continue with Google
            </button>
            <button 
              onClick={() => handleSocialLogin('discord')}
              className="w-full py-3 bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-3 text-sm"
            >
              <svg viewBox="0 0 127.14 96.36" className="w-5 h-5 fill-current">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.89,105.89,0,0,0,126.6,80.22c1.24-21.69-1.37-45.69-18.9-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
              </svg>
              Continue with Discord
            </button>
            
            <div className="flex gap-2 items-start bg-[#161616] p-2 rounded-lg border border-white/5">
                <Info size={14} className="text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-[#888] leading-tight">
                    <b>Setup Required:</b> Ensure <code>{window.location.origin}/**</code> is added to <b>Redirect URLs</b> in Supabase Auth Settings.
                </p>
            </div>
          </div>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px bg-[#222] flex-1"></div>
            <span className="text-[#444] text-[10px] font-bold uppercase tracking-widest">OR</span>
            <div className="h-px bg-[#222] flex-1"></div>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
                <div>
                    <label className="block text-xs font-bold text-[#666] uppercase tracking-wider mb-2">Username</label>
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="RepsKing99" 
                        className="w-full bg-[#0A0A0A] border border-[#222] rounded-xl py-3 px-4 text-white focus:border-primary outline-none transition-colors" 
                        required 
                    />
                </div>
            )}
            <div>
              <label className="block text-xs font-bold text-[#666] uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3 text-[#444]" size={18} />
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" 
                    className="w-full bg-[#0A0A0A] border border-[#222] rounded-xl py-3 pl-11 pr-4 text-white focus:border-primary outline-none transition-colors" 
                    required 
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#666] uppercase tracking-wider mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-[#0A0A0A] border border-[#222] rounded-xl py-3 px-4 text-white focus:border-primary outline-none transition-colors" 
                required 
              />
            </div>

            {error && (
                <div className="flex items-start gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg text-sm border border-red-500/20 leading-relaxed">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" /> 
                    <span>{error}</span>
                </div>
            )}

            <div className="space-y-3 pt-2">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 bg-[#222] hover:bg-white hover:text-black text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading && <Loader2 className="animate-spin" size={18} />}
                    {isLogin ? 'Login' : 'Sign Up'}
                </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-sm text-[#666] hover:text-primary transition-colors font-medium"
              >
                  {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};
