import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Loader = ({ setLoading }) => {
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    // Stage 1: Initial Reveal
    const revealTimer = setTimeout(() => setReveal(true), 100);

    // Stage 2: Finish Loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3500);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(timer);
    };
  }, [setLoading]);

  return (
    <motion.div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0a0a0a] overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.05,
        filter: "blur(20px)",
        transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
      }}
    >
      {/* Cinematic Background - Glassmorphism & Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent-gold/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-rust/10 rounded-full blur-[100px]"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Luxury Typography Reveal */}
        <div className="overflow-hidden flex flex-col items-center">
          <div className="flex items-center gap-4 mb-4 overflow-hidden">
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={reveal ? { width: 40, opacity: 0.5 } : {}}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="h-[1px] bg-accent-gold"
            />
            <motion.span
              initial={{ y: 20, opacity: 0 }}
              animate={reveal ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              className="text-[10px] font-bold uppercase tracking-[0.8em] text-accent-gold/80"
            >
              SINCE 2007
            </motion.span>
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={reveal ? { width: 40, opacity: 0.5 } : {}}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="h-[1px] bg-accent-gold"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={reveal ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="mb-8"
          >
            <div className="w-32 h-32 md:w-48 md:h-48 relative">
              {/* Outer Glow Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-10px] border border-accent-gold/20 rounded-full border-dashed"
              />
              <img
                src="/src/assets/image-copy.png"
                alt="Badri Apparel"
                className="w-full h-full object-contain relative z-10"
              />
              <div className="absolute inset-0 bg-accent-gold/10 blur-3xl rounded-full opacity-50" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={reveal ? { opacity: 1 } : {}}
            transition={{ duration: 2 }}
            className="relative"
          >
            {/* Soft Glow Behind Text */}
            <div className="absolute inset-0 bg-accent-gold/5 blur-2xl rounded-full" />

            <h1 className="text-4xl md:text-7xl font-heading font-bold tracking-[-0.05em] text-white flex flex-col md:flex-row items-center">
              <motion.span
                initial={{ y: 50, opacity: 0 }}
                animate={reveal ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
              >
                BADRIBHAI
              </motion.span>
              <motion.span
                initial={{ y: 50, opacity: 0 }}
                animate={reveal ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 1 }}
                className="md:ml-4 italic font-light text-accent-gold"
              >
                APPAREL
              </motion.span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={reveal ? { opacity: 0.4, letterSpacing: "1.2em" } : {}}
            transition={{ duration: 3, ease: "easeOut", delay: 1 }}
            className="mt-6 text-[8px] md:text-[10px] font-bold uppercase text-white/60 translate-x-[0.6em]"
          >
            JAIPUR HERITAGE COLLECTIVE
          </motion.p>
        </div>

        {/* Premium Progress Bar */}
        <div className="absolute bottom-[-100px] w-64 h-[1px] bg-white/5 overflow-hidden rounded-full">
          <motion.div
            className="w-full h-full bg-gradient-to-r from-transparent via-accent-gold to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 0.5
            }}
          />
        </div>
      </div>

      {/* Cinematic Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </motion.div>
  );
};

export default Loader;
