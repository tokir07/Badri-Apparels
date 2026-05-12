import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Package, Heart, Tag, Shield, 
  Trash2, Check, CheckCircle2, Clock, 
  ChevronRight, Filter, Sparkles, ShieldCheck,
  Zap, Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const AccountNotifications = () => {
  const [filter, setFilter] = useState('All');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'Acquisition',
      title: 'Heritage Dispatch',
      message: 'Your artisanal acquisition #BADRI-2026-0042 has been dispatched via Jaipur Express.',
      time: '2 hours ago',
      isRead: false,
      icon: <Package className="text-accent-maroon" />
    },
    {
      id: 2,
      type: 'Archive',
      title: 'Curated Price Drop',
      message: 'A heritage masterpiece in your Archive is now available with an artisanal concession.',
      time: '5 hours ago',
      isRead: false,
      icon: <Sparkles className="text-accent-gold" />
    },
    {
      id: 3,
      type: 'Security',
      title: 'Portal Integrity Alert',
      message: 'A new administrative login was detected from a secure terminal in Rajasthan.',
      time: '1 day ago',
      isRead: true,
      icon: <ShieldCheck className="text-blue-500" />
    }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <Sparkles size={16} className="text-accent-gold" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">Dispatch Bulletins</span>
           </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-text-primary tracking-tight">
            Heritage <span className="italic font-light text-accent-maroon">Chronicles.</span>
          </h1>
          <p className="text-text-secondary text-sm font-medium max-w-xl leading-relaxed">
            Stay synchronized with your artisanal acquisitions, archive concessions, and portal security updates.
          </p>
        </div>
        <button 
          onClick={markAllRead}
          className="flex items-center gap-3 px-10 py-5 bg-primary/5 text-text-primary rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-accent-maroon hover:text-white group"
        >
          <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" /> Acknowledge All
        </button>
      </div>

      {/* Content */}
      <div className="max-w-5xl space-y-10">
        <div className="flex items-center gap-6 overflow-x-auto pb-4 scrollbar-hide border-b border-accent-gold/10">
           {['All', 'Acquisition', 'Archive', 'Security'].map(f => (
             <button 
               key={f}
               onClick={() => setFilter(f)}
               className={cn(
                 "text-[11px] font-bold uppercase tracking-[0.3em] px-8 py-3 rounded-2xl transition-all whitespace-nowrap border",
                 filter === f 
                   ? 'bg-accent-maroon text-white border-accent-maroon shadow-lg shadow-accent-maroon/20' 
                   : 'bg-primary/5 text-text-secondary border-transparent hover:border-accent-gold/20'
               )}
             >
                {f}
             </button>
           ))}
        </div>

        <div className="space-y-6">
           <AnimatePresence mode="popLayout">
              {notifications.length > 0 ? (
                notifications.map((notif, idx) => (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 50, opacity: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={cn(
                      "relative p-8 md:p-10 rounded-[3rem] border-2 transition-all duration-700 group overflow-hidden",
                      notif.isRead 
                        ? 'bg-primary/5 border-transparent opacity-60 grayscale-[0.3]' 
                        : 'bg-white border-accent-gold/10 shadow-2xl shadow-accent-maroon/5'
                    )}
                  >
                    <div className="flex flex-col sm:flex-row gap-8 items-start relative z-10">
                       <div className={cn(
                         "w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 transition-all duration-500",
                         notif.isRead ? 'bg-primary/10 opacity-50' : 'bg-primary/5 group-hover:bg-accent-maroon group-hover:text-white shadow-sm'
                       )}>
                          {React.cloneElement(notif.icon, { size: 24 })}
                       </div>
                       
                       <div className="flex-1 space-y-2">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                             <div className="space-y-1">
                               <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold opacity-80">{notif.type}</span>
                               <h4 className="text-2xl font-heading font-bold text-text-primary tracking-tight">
                                  {notif.title}
                               </h4>
                             </div>
                             <span className="text-[11px] font-bold text-text-secondary whitespace-nowrap flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-xl">
                                <Clock size={14} className="text-accent-gold" /> {notif.time}
                             </span>
                          </div>
                          
                          <p className="text-base text-text-secondary font-medium leading-relaxed max-w-2xl">
                             {notif.message}
                          </p>
                          
                          <div className="pt-6 flex flex-wrap gap-6 items-center">
                             <button className="text-[11px] uppercase tracking-[0.3em] font-bold text-accent-maroon flex items-center gap-2 group/btn">
                                Details <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
                             </button>
                             {!notif.isRead && (
                                <button className="text-[11px] uppercase tracking-[0.3em] font-bold text-text-secondary hover:text-text-primary transition-colors">
                                   Mark Archive
                                </button>
                             )}
                          </div>
                       </div>
                       
                       <button 
                         onClick={() => deleteNotification(notif.id)}
                         className="absolute top-0 right-0 p-3 text-text-secondary/20 hover:text-red-500 transition-all lg:opacity-0 lg:group-hover:opacity-100"
                       >
                          <Trash2 size={20} />
                       </button>
                    </div>

                    {/* Background Detail */}
                    {!notif.isRead && (
                      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-accent-gold/5 rounded-full blur-3xl pointer-events-none group-hover:bg-accent-gold/10 transition-colors" />
                    )}
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-40 text-center"
                >
                   <div className="w-32 h-32 bg-primary/5 rounded-[3rem] flex items-center justify-center mx-auto mb-8 text-accent-gold relative overflow-hidden group">
                      <div className="absolute inset-0 bg-accent-gold/10 scale-0 group-hover:scale-100 transition-transform duration-1000 rounded-full blur-2xl" />
                      <Bell size={48} className="relative z-10" />
                   </div>
                   <h3 className="text-4xl font-heading font-bold text-text-primary tracking-tight">The Archive is Silent</h3>
                   <p className="text-text-secondary text-base font-medium mt-4 max-w-sm mx-auto leading-relaxed">
                      All artisanal chronicles have been acknowledged. Your heritage timeline is up to date.
                   </p>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>

    </div>
  );
};

export default AccountNotifications;
