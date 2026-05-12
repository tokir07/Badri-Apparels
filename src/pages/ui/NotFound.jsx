import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-12"
      >
        <div className="w-24 h-24 bg-muted rounded-3xl flex items-center justify-center shadow-sm border border-border">
           <Compass size={48} className="text-primary animate-pulse" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6 max-w-lg"
      >
        <div className="flex items-center justify-center gap-3">
           <div className="w-8 h-[1px] bg-primary" />
           <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Error 404</span>
           <div className="w-8 h-[1px] bg-primary" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-heading font-bold text-foreground tracking-tighter leading-none uppercase">
          Path <span className="italic font-light text-muted-foreground">Not Found.</span>
        </h1>
        
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
          The collection or page you are looking for does not exist or has been relocated. Let us guide you back to our curated artisanal journey.
        </p>

        <div className="pt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center px-10 py-4 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-xl gap-3"
          >
            <ArrowLeft size={16} /> Return Home
          </Link>
          
          <Link 
            to="/products" 
            className="inline-flex items-center justify-center px-10 py-4 border-2 border-border text-foreground rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-muted transition-all gap-3"
          >
            Shop Collections <Sparkles size={16} />
          </Link>
        </div>
      </motion.div>

      {/* Subtle background text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 select-none">
        <h2 className="text-[25vw] font-heading font-bold text-muted/20 tracking-tighter leading-none">
          404
        </h2>
      </div>
    </div>
  );
};

export default NotFound;
