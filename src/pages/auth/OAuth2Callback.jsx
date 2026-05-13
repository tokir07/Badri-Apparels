import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const OAuth2Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken, fetchUser } = useAuthStore();

  useEffect(() => {
    const processAuth = async () => {
      const error = searchParams.get('error');
      if (error === 'oauth_failed') {
        toast.error("The heritage archive couldn't verify your social identity. Please try again or use your local vault key.");
        navigate('/login');
        return;
      }

      const token = searchParams.get('token');
      const refreshToken = searchParams.get('refresh_token');

      if (token) {
        localStorage.setItem('token', token);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        
        setToken(token);
        const result = await fetchUser();
        
        if (result.success) {
          toast.success("Welcome to the BadriBhai Heritage Archive!");
          if (result.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        } else {
          toast.error("Handshake failed. Please try again.");
          navigate('/login');
        }
      } else {
        toast.error("No credentials found in the callback.");
        navigate('/login');
      }
    };

    processAuth();
  }, [searchParams, navigate, setToken, fetchUser]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-8">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-24 h-24 border-2 border-accent border-t-transparent rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="text-accent animate-pulse" size={32} />
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-heading font-bold text-foreground uppercase tracking-widest">
          Authenticating <span className="italic font-light text-accent">Patron.</span>
        </h2>
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground animate-pulse">
          Synchronizing your identity with the archive
        </p>
      </div>
    </div>
  );
};

export default OAuth2Callback;
