import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-12 max-w-xl"
      >
        <div className="relative">
          <h1 className="text-[12rem] md:text-[20rem] font-heading font-bold text-muted/20 leading-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="space-y-4">
              <Search className="text-accent mx-auto w-12 h-12 animate-bounce" />
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">Lost in the <span className="text-accent italic font-light">Archive.</span></h2>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground text-lg max-w-md mx-auto font-light italic">
          The heritage piece you seek has either moved to a private collection or never existed in our anthology.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground rounded-[2rem] font-bold uppercase tracking-[0.3em] text-[10px] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20"
        >
          <ArrowLeft size={16} /> Return to Sanctuary
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
