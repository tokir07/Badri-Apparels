import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Mail, Ban, MoreHorizontal, 
  Users, UserPlus, Star, ShieldCheck, ArrowRight,
  TrendingUp, Download, MessageSquare, ChevronRight,
  Sparkles, Palette, Trash2, CheckCircle2, XCircle, 
  Loader2, RefreshCw, Eye, Edit3, UserCheck, UserX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminService } from '../../services/adminService';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSegment, setFilterSegment] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      toast.error("Failed to synchronize patron archives");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    const promise = adminService.updateUserStatus(userId, newStatus);
    
    toast.promise(promise, {
      loading: 'Adjusting patron privileges...',
      success: (data) => {
        if (data.success) {
          setUsers(prev => prev.map(u => u.id === userId ? { ...u, active: newStatus } : u));
          return `Patron ${newStatus ? 'Access Restored' : 'Access Suspended'}`;
        }
        throw new Error(data.message);
      },
      error: 'Failed to update protocol'
    });
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    const promise = adminService.deleteUser(userToDelete.id);
    
    toast.promise(promise, {
      loading: 'Archiving patron records...',
      success: () => {
        setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
        setShowDeleteModal(false);
        setUserToDelete(null);
        return 'Patron records permanently archived';
      },
      error: 'Failed to complete archival removal'
    });
  };

  const getTierConfig = (role, spent = 0) => {
    if (role === 'ADMIN') return { label: 'Grand Curator', color: 'text-accent-maroon', bg: 'bg-accent-maroon/5', border: 'border-accent-maroon/20', icon: <ShieldCheck size={14} /> };
    if (spent > 100000) return { label: 'Platinum Patron', color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/20', icon: <Star size={14} /> };
    if (spent > 50000) return { label: 'Gold Patron', color: 'text-accent-gold', bg: 'bg-accent-gold/5', border: 'border-accent-gold/20', icon: <Sparkles size={14} /> };
    return { label: 'Artisan Initiate', color: 'text-muted-foreground', bg: 'bg-muted/50', border: 'border-transparent', icon: <Palette size={14} /> };
  };

  const filteredUsers = users.filter(u => {
    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || 
                         (u.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const tier = getTierConfig(u.role, u.totalSpent || 0).label;
    const matchesSegment = filterSegment === 'All' || tier.includes(filterSegment);
    
    return matchesSearch && matchesSegment;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Synchronizing Archive...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-12"
    >
      {/* Header Area */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between md:items-end gap-10 border-b border-border pb-12">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-10 h-[1px] bg-accent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent">Patron Relations</span>
           </div>
           <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter text-foreground">
             Artisan <span className="italic font-light text-primary">Clientele.</span>
           </h1>
           <p className="text-muted-foreground text-sm font-medium opacity-80 leading-relaxed max-w-md">Managing our global network of artisanal patrons and heritage enthusiasts with cultural precision.</p>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={fetchUsers}
             className="p-5 bg-background border border-border rounded-2xl text-primary hover:border-primary transition-all shadow-sm group"
           >
              <RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-700" />
           </button>
           <button className="bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-bold flex items-center gap-4 hover:brightness-110 transition-all shadow-xl shadow-primary/10">
             <UserPlus size={20} />
             <span className="text-[10px] uppercase tracking-[0.2em]">Enroll New Patron</span>
           </button>
        </div>
      </motion.div>

      {/* Control Bar */}
      <motion.div variants={itemVariants} className="bg-background/40 backdrop-blur-xl border border-border p-8 rounded-[3rem] flex flex-col lg:flex-row justify-between gap-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-6 flex-1">
          <div className="relative group flex-1 w-full max-w-md">
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-accent group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Query patrons by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-14 pr-6 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 transition-all"
            />
          </div>
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            {['All', 'Platinum', 'Gold', 'Initiate'].map((segment) => (
              <button 
                key={segment}
                onClick={() => setFilterSegment(segment)}
                className={cn(
                  "px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                  filterSegment === segment 
                    ? "bg-primary text-primary-foreground shadow-lg" 
                    : "bg-background border border-border text-muted-foreground hover:border-primary hover:text-primary"
                )}
              >
                {segment === 'All' ? 'All Patrons' : `${segment}s`}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Patrons Gallery */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {filteredUsers.length === 0 ? (
          <div className="col-span-full py-20 text-center space-y-4">
             <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary/30">
                <Users size={32} />
             </div>
             <p className="text-sm italic text-muted-foreground opacity-60">No patrons matching your query were found in the anthology.</p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const tier = getTierConfig(user.role, user.totalSpent || 0);
            return (
              <motion.div
                key={user.id}
                variants={itemVariants}
                className="group bg-background/60 backdrop-blur-md border border-border rounded-[3.5rem] p-10 flex items-start gap-10 hover:border-primary/20 transition-all shadow-sm hover:shadow-2xl hover:shadow-primary/5 relative overflow-hidden"
              >
                {/* Profile Identity Section */}
                <div className="relative shrink-0">
                  <div className="w-24 h-24 rounded-[2rem] bg-muted p-1 border border-border group-hover:border-primary/20 transition-all duration-700">
                     <div className="w-full h-full bg-background rounded-[1.8rem] flex items-center justify-center overflow-hidden">
                        {user.profileImage ? (
                          <img src={user.profileImage} alt={user.firstName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-heading font-bold">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </div>
                        )}
                     </div>
                  </div>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-10 h-10 rounded-xl flex items-center justify-center border-4 border-background shadow-lg transition-colors",
                    user.active ? "bg-green-500 text-white" : "bg-destructive text-white"
                  )}>
                     {user.active ? <UserCheck size={16} /> : <UserX size={16} />}
                  </div>
                </div>

                {/* Patron Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-heading font-bold text-foreground group-hover:text-primary transition-colors truncate">
                            {user.firstName} {user.lastName}
                          </h3>
                       </div>
                       <div className={cn(
                          "px-4 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border backdrop-blur-md flex items-center gap-2",
                          tier.bg, tier.color, tier.border
                       )}>
                          {tier.icon} {tier.label}
                       </div>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium opacity-60 truncate">{user.email}</p>
                    {user.phoneNumber && <p className="text-[10px] text-muted-foreground/40 mt-1">{user.phoneNumber}</p>}
                  </div>

                  <div className="flex items-center gap-8 border-t border-border/50 pt-6">
                    <div>
                      <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-40 mb-1">Spent</p>
                      <p className="text-lg font-bold text-primary">₹{(user.totalSpent || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-40 mb-1">Acquisitions</p>
                      <p className="text-lg font-bold text-foreground">{(user.ordersCount || 0)}</p>
                    </div>
                  </div>
                </div>

                {/* Actions Menu */}
                <div className="flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  <button 
                    onClick={() => { setSelectedUser(user); setShowDetailModal(true); }}
                    className="p-3 bg-background border border-border rounded-xl text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm"
                    title="View Portfolio"
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    onClick={() => handleStatusToggle(user.id, user.active)}
                    className={cn(
                      "p-3 border rounded-xl transition-all shadow-sm",
                      user.active 
                        ? "bg-background border-border text-muted-foreground hover:text-destructive hover:border-destructive" 
                        : "bg-green-500/10 border-green-500/20 text-green-600 hover:bg-green-500 hover:text-white"
                    )}
                    title={user.active ? "Suspend Access" : "Restore Access"}
                  >
                    {user.active ? <Ban size={18} /> : <UserCheck size={18} />}
                  </button>
                  <button 
                    onClick={() => { setUserToDelete(user); setShowDeleteModal(true); }}
                    className="p-3 bg-background border border-border rounded-xl text-muted-foreground hover:text-destructive hover:border-destructive transition-all shadow-sm"
                    title="Archive Record"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* CRM Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-24">
         {[
           { label: 'New Patrons', value: users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length, icon: <UserPlus size={24} />, color: 'bg-primary' },
           { label: 'Active Spirits', value: users.filter(u => u.active).length, icon: <UserCheck size={24} />, color: 'bg-accent' },
           { label: 'Total Anthology', value: users.length, icon: <Users size={24} />, color: 'bg-primary/80' },
           { label: 'Suspended Flow', value: users.filter(u => !u.active).length, icon: <UserX size={24} />, color: 'bg-accent/80' },
         ].map((stat, i) => (
           <motion.div 
             key={i} 
             variants={itemVariants}
             className="p-10 bg-background/60 backdrop-blur-md border border-border rounded-[2.5rem] flex items-center justify-between shadow-sm group hover:border-primary/20 transition-all"
           >
              <div className="space-y-2">
                 <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                 <h4 className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors font-heading">{stat.value}</h4>
              </div>
              <div className={`p-6 ${stat.color} rounded-2xl text-primary-foreground shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                 {stat.icon}
              </div>
           </motion.div>
         ))}
      </div>

      {/* Patron Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailModal(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-accent-gold/10"
            >
              <div className="p-8 border-b border-border flex justify-between items-center bg-primary/5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg">
                    <Users size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-heading font-bold">{selectedUser.firstName} {selectedUser.lastName}</h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold">Artisanal Patron Profile</p>
                  </div>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="p-3 hover:bg-destructive hover:text-white rounded-2xl transition-all border border-border">
                  <XCircle size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-40">Email Protocol</p>
                    <p className="text-sm font-medium">{selectedUser.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-40">Patron Status</p>
                    <p className={cn("text-sm font-bold", selectedUser.active ? "text-green-600" : "text-destructive")}>
                      {selectedUser.active ? 'Active Engagement' : 'Engagement Suspended'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-40">Member Since</p>
                    <p className="text-sm font-medium">{new Date(selectedUser.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-40">Artisanal Role</p>
                    <p className="text-sm font-bold uppercase tracking-tighter text-primary">{selectedUser.role}</p>
                  </div>
                </div>

                <div className="pt-10 border-t border-border">
                   <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent-maroon mb-6">Heritage Shipping Dossier</h4>
                   <div className="p-6 bg-muted/30 rounded-3xl border border-border italic text-sm text-muted-foreground">
                      {selectedUser.addressLine ? (
                        <p>{selectedUser.addressLine}, {selectedUser.city}, {selectedUser.state} - {selectedUser.pincode}</p>
                      ) : (
                        <p className="opacity-40">No shipping records found for this patron.</p>
                      )}
                   </div>
                </div>
              </div>

              <div className="p-8 border-t border-border flex justify-end gap-4 bg-primary/5">
                <button 
                  onClick={() => handleStatusToggle(selectedUser.id, selectedUser.active)}
                  className={cn(
                    "px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border shadow-sm",
                    selectedUser.active ? "bg-white text-destructive border-destructive/20 hover:bg-destructive hover:text-white" : "bg-green-500 text-white border-green-600 hover:brightness-110"
                  )}
                >
                  {selectedUser.active ? 'Suspend Patron' : 'Restore Patron'}
                </button>
                <button className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/10">
                  Secure Portfolio Update
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && userToDelete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-background/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl border border-destructive/20 text-center space-y-8"
            >
              <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={32} />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-heading font-bold text-foreground">Archival Removal Protocol</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You are about to permanently remove <span className="font-bold text-foreground">{userToDelete.firstName} {userToDelete.lastName}</span> from the heritage anthology. This action is irreversible.
                </p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-4 bg-muted text-muted-foreground rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-muted/80 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteUser}
                  className="flex-1 py-4 bg-destructive text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-destructive/20"
                >
                  Archive Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminUsers;
