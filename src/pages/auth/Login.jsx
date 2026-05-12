import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../../store/useAuthStore';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid patron email address'),
  password: z.string().min(6, 'Identity key must be at least 6 characters'),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setError('');
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        if (result.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("A connection error occurred. Please ensure the backend is running.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      
      {/* Left Side - Cinematic Heritage Image (Desktop) */}
      <div className="hidden lg:flex w-1/2 relative bg-black items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-0"
        >
          <img src="/images/jaipuri_kurti_hero_1778263445000_1778264668567.png" alt="Jaipur Heritage" className="w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background"></div>
        </motion.div>
        
        <div className="relative z-10 p-20 flex flex-col justify-between h-full w-full">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-[1px] bg-accent" />
               <span className="text-xs uppercase tracking-[0.6em] text-accent font-bold">Jaipur Artisanal Collective</span>
            </div>
            <h2 className="text-6xl lg:text-8xl font-heading font-bold text-white leading-[0.9] mb-8">
              THE <br/><span className="text-accent italic font-light">ANTHOLOGY.</span>
            </h2>
            <p className="text-white/40 text-lg max-w-md font-light italic leading-relaxed">
              Where timeless Jaipuri craftsmanship meets the modern silhouette. Re-enter your sanctuary of style.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-24 relative bg-background">
        
        {/* Back Button */}
        <Link to="/" className="absolute top-10 left-10 flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition-all group z-20">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Sanctuary
        </Link>
        
        {/* Animated Background Motifs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-[120px]"
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md relative z-10 bg-card border border-border p-10 md:p-14 rounded-[3.5rem] shadow-2xl shadow-primary/5"
        >
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
               <Sparkles size={16} className="text-accent animate-pulse" />
               <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent">BADRIBHAI APPAREL</span>
               <Sparkles size={16} className="text-accent animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tighter mb-3">Welcome Patron</h1>
            <p className="text-muted-foreground text-sm font-light italic">Re-establish your connection to the craft.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-destructive/10 border border-destructive/20 text-destructive px-5 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-3"
                >
                  <AlertCircle size={14} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="space-y-2 relative group">
              <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold ml-1">Patron Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-accent group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  {...register('email')}
                  placeholder="patron@badriapparel.com"
                  className={`w-full pl-14 pr-4 py-5 bg-muted/30 border ${errors.email ? 'border-destructive' : 'border-border'} rounded-2xl focus:outline-none focus:border-primary transition-all duration-500 text-sm font-medium`}
                />
              </div>
              {errors.email && <p className="text-[9px] text-destructive font-bold uppercase tracking-widest mt-1 ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2 relative group">
              <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold ml-1">Identity Key</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-accent group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  {...register('password')}
                  placeholder="••••••••"
                  className={`w-full pl-14 pr-14 py-5 bg-muted/30 border ${errors.password ? 'border-destructive' : 'border-border'} rounded-2xl focus:outline-none focus:border-primary transition-all duration-500 text-sm font-medium`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-[9px] text-destructive font-bold uppercase tracking-widest mt-1 ml-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between mt-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="hidden" />
                <div className="w-5 h-5 rounded-lg border-2 border-border group-hover:border-primary flex items-center justify-center transition-all bg-card">
                  <div className="w-2 h-2 bg-primary rounded-sm opacity-0 group-hover:opacity-20 transition-opacity" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">Keep Logged In</span>
              </label>
              <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-foreground transition-colors border-b border-primary/20 hover:border-foreground">Recall Key?</a>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="w-full relative py-5 mt-8 bg-primary text-primary-foreground rounded-2xl overflow-hidden group shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 w-full h-full bg-foreground transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out"></div>
              <span className="relative z-10 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em]">
                {isSubmitting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <>Enter Vault <motion.div animate={{ x: isHovered ? 5 : 0 }} transition={{ duration: 0.3 }}><ArrowRight size={18} /></motion.div></>
                )}
              </span>
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-[0.3em]">
              <span className="bg-card px-4 text-muted-foreground">OR</span>
            </div>
          </div>

          <div className="mt-8">
            <a 
              href="http://127.0.0.1:8080/oauth2/authorization/google"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-5 bg-white border border-border rounded-2xl flex items-center justify-center gap-4 hover:border-accent hover:bg-accent/5 transition-all duration-500 group shadow-sm no-underline"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-foreground">Continue with Google</span>
            </a>
          </div>

          <p className="mt-12 text-center text-xs text-muted-foreground">
            New to the collective? <Link to="/signup" className="font-bold text-primary hover:text-foreground transition-colors border-b border-primary/20">Create Patron Identity</Link>
          </p>

        </motion.div>
      </div>
    </div>
  );
};

export default Login;
