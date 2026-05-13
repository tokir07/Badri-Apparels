import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, UserPlus, Search, Filter, 
  MoreHorizontal, Trash2, Edit3, Mail, 
  Smartphone, Clock, Shield, CheckCircle2,
  XCircle, Loader2, RefreshCw, Star, Lock,
  ChevronRight, ArrowRight, UserCircle, Key
} from 'lucide-react';
import { toast } from 'sonner';
import { adminService } from '../../services/adminService';
import { cn } from '../../lib/utils';

const AdminStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const roles = [
    { id: 'SUPER_ADMIN', label: 'Super Admin', desc: 'Full institutional authority', color: 'bg-accent-maroon', text: 'text-white' },
    { id: 'MANAGER', label: 'Manager', desc: 'Curate inventory & acquisitions', color: 'bg-accent-gold', text: 'text-white' },
    { id: 'STAFF', label: 'Staff', desc: 'Manage acquisitions & patrons', color: 'bg-accent-rust', text: 'text-white' },
    { id: 'DELIVERY', label: 'Delivery', desc: 'Consignment & Logistics', color: 'bg-accent-sage', text: 'text-white' },
  ];

  const fetchStaff = async () => {
    try {
      setLoading(true);
      // Using adminService.getAllUsers and filtering by non-customer roles
      const response = await adminService.getAllUsers();
      if (response.success) {
        setStaff(response.data.filter(u => u.role !== 'CUSTOMER'));
      }
    } catch (error) {
      toast.error("Failed to synchronize staff archives");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleInvite = (e) => {
    e.preventDefault();
    toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
      loading: 'Issuing institutional invitation...',
      success: 'Artisan invitation dispatched via secure channel',
      error: 'Invitation protocol failure'
    });
    setShowInviteModal(false);
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-16 h-16 text-accent-gold animate-spin opacity-20" />
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold animate-pulse">Synchronizing Staff Hierarchy...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 pb-20"
    >
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-10 border-b border-accent-gold/10 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-[1px] bg-accent-gold" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">RBAC Hierarchy</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter">
            Staff <span className="italic font-light text-accent-maroon">Curation.</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium opacity-80 leading-relaxed max-w-md">Orchestrate your institutional team with high-fidelity permissions and role-based authority matrix.</p>
        </div>
        <div className="flex gap-4">
           <button onClick={fetchStaff} className="p-5 bg-white border border-accent-gold/10 rounded-2xl text-accent-maroon hover:border-accent-maroon transition-all shadow-sm group">
              <RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-700" />
           </button>
           <button 
             onClick={() => setShowInviteModal(true)}
             className="flex items-center gap-4 bg-accent-maroon text-white px-10 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-2xl shadow-accent-maroon/20"
           >
              <UserPlus size={18} /> Invite New Artisan
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Staff List */}
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white border border-accent-gold/10 rounded-[3.5rem] p-12 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                 <div className="relative group w-full max-w-md">
                    <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-accent-gold" />
                    <input 
                       type="text" 
                       placeholder="Search artisans by name or email..." 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full bg-accent-gold/5 border border-accent-gold/10 rounded-2xl py-4 pl-14 pr-6 text-xs focus:outline-none focus:border-accent-maroon/20 transition-all"
                    />
                 </div>
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Staff: {staff.length}</span>
                 </div>
              </div>

              <div className="space-y-6">
                 {staff.length === 0 ? (
                    <div className="py-20 text-center space-y-4">
                       <Shield size={48} className="mx-auto text-accent-gold/20" />
                       <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground italic">No administrative artisans found in the archive.</p>
                    </div>
                 ) : (
                    staff.map((member) => (
                       <div key={member.id} className="flex flex-col md:flex-row items-center justify-between p-8 bg-accent-gold/5 border border-accent-gold/10 rounded-[2.5rem] group hover:border-accent-maroon/20 transition-all gap-8">
                          <div className="flex items-center gap-6 w-full md:w-auto">
                             <div className="w-16 h-16 rounded-2xl bg-accent-maroon text-white flex items-center justify-center font-heading font-bold text-2xl shadow-lg shrink-0">
                                {member.firstName?.[0]}
                             </div>
                             <div>
                                <h4 className="text-[13px] font-bold uppercase tracking-widest text-text-primary mb-1">{member.firstName} {member.lastName}</h4>
                                <p className="text-[10px] text-muted-foreground lowercase tracking-widest">{member.email}</p>
                             </div>
                          </div>
                          
                          <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-end">
                             <div className="text-center">
                                <span className={cn(
                                   "px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border",
                                   member.role === 'ADMIN' ? "bg-accent-maroon text-white border-accent-maroon" : "bg-accent-gold/10 text-accent-gold border-accent-gold/20"
                                )}>
                                   {member.role === 'ADMIN' ? 'Super Admin' : 'Manager'}
                                </span>
                             </div>
                             <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-3 bg-white border border-accent-gold/10 rounded-xl text-muted-foreground hover:text-accent-maroon transition-all shadow-sm"><Edit3 size={16} /></button>
                                <button className="p-3 bg-white border border-accent-gold/10 rounded-xl text-muted-foreground hover:text-red-500 transition-all shadow-sm"><Trash2 size={16} /></button>
                             </div>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>
        </div>

        {/* Permissions Intelligence Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-text-primary text-white rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent-gold/10 rounded-full blur-[80px]" />
              <div className="relative z-10">
                 <h3 className="text-xl font-heading font-bold mb-10 flex items-center gap-3">
                    <Lock className="text-accent-gold" size={20} /> RBAC Matrix
                 </h3>
                 <div className="space-y-6">
                    {roles.map((role) => (
                       <div key={role.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl group hover:border-accent-gold/30 transition-all">
                          <div className="flex justify-between items-center mb-2">
                             <h4 className="text-[11px] font-bold uppercase tracking-widest text-accent-gold">{role.label}</h4>
                             <Shield size={14} className="opacity-20 group-hover:opacity-100 transition-opacity text-accent-gold" />
                          </div>
                          <p className="text-[10px] text-white/40 leading-relaxed font-medium uppercase tracking-tighter">{role.desc}</p>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="bg-white border border-accent-gold/10 rounded-[3rem] p-10 shadow-sm text-center space-y-6">
              <div className="w-16 h-16 bg-accent-gold/10 rounded-full flex items-center justify-center mx-auto text-accent-gold">
                 <Key size={28} />
              </div>
              <div className="space-y-2">
                 <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-maroon">Access Logs</h4>
                 <p className="text-[9px] text-muted-foreground uppercase tracking-widest italic opacity-60">Monitor institutional gateway entries</p>
              </div>
              <button className="w-full py-4 bg-primary/5 border border-accent-gold/10 rounded-2xl text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-accent-maroon hover:text-white transition-all">
                 View Security Dossier
              </button>
           </div>
        </div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
         {showInviteModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setShowInviteModal(false)}
                 className="absolute inset-0 bg-background/90 backdrop-blur-xl"
               />
               <motion.div
                 initial={{ scale: 0.9, opacity: 0, y: 20 }}
                 animate={{ scale: 1, opacity: 1, y: 0 }}
                 exit={{ scale: 0.9, opacity: 0, y: 20 }}
                 className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl p-12 border border-accent-gold/10"
               >
                  <h3 className="text-3xl font-heading font-bold mb-2">Issue <span className="italic font-light text-accent-maroon">Invitation.</span></h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-accent-gold mb-10">Dispatch a secure access link to a new artisan</p>
                  
                  <form onSubmit={handleInvite} className="space-y-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Patron Email Address</label>
                        <input 
                           type="email" 
                           required
                           className="w-full bg-accent-gold/5 border border-accent-gold/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-accent-maroon transition-all"
                           placeholder="artisan@badribhai.com"
                        />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Institutional Role</label>
                        <select className="w-full bg-accent-gold/5 border border-accent-gold/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-accent-maroon transition-all appearance-none font-bold">
                           {roles.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                        </select>
                     </div>
                     <div className="pt-4">
                        <button type="submit" className="w-full py-5 bg-accent-maroon text-white rounded-[2rem] text-[10px] font-bold uppercase tracking-[0.4em] shadow-2xl shadow-accent-maroon/20 hover:brightness-110 transition-all">
                           Dispatch Invitation
                        </button>
                     </div>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminStaff;
