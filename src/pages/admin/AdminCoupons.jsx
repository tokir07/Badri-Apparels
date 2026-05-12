import React, { useState } from 'react';
import { 
  Plus, Ticket, Search, Filter, MoreVertical, 
  Trash, Edit, Copy, CheckCircle, Clock, 
  Tag, Percent, Calendar, TrendingUp, Sparkles,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const AdminCoupons = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coupons, setCoupons] = useState([
    { id: 'BADRI-772', code: 'WELCOME25', discount: '25%', type: 'Percentage', usage: '154/500', expiry: 'Oct 30, 2026', status: 'Active' },
    { id: 'BADRI-773', code: 'FESTIVE500', discount: '₹500', type: 'Fixed Amount', usage: '82/100', expiry: 'Nov 12, 2026', status: 'Active' },
    { id: 'BADRI-774', code: 'LUXURYGOLD', discount: '15%', type: 'Percentage', usage: '12/50', expiry: 'Oct 20, 2026', status: 'Expired' },
    { id: 'BADRI-775', code: 'FIRSTBUY', discount: '10%', type: 'Percentage', usage: '412/Unlimited', expiry: 'Dec 31, 2026', status: 'Active' },
  ]);

  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    type: 'Percentage',
    usageLimit: '',
    expiry: ''
  });

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    const newCoupon = {
      id: `BADRI-${Math.floor(Math.random() * 1000)}`,
      code: formData.code.toUpperCase(),
      discount: formData.type === 'Percentage' ? `${formData.discount}%` : `₹${formData.discount}`,
      type: formData.type,
      usage: `0/${formData.usageLimit || 'Unlimited'}`,
      expiry: formData.expiry || 'No Expiry',
      status: 'Active'
    };
    setCoupons([newCoupon, ...coupons]);
    setIsModalOpen(false);
    setFormData({ code: '', discount: '', type: 'Percentage', usageLimit: '', expiry: '' });
    toast.success('Promotional Protocol Deployed', {
      description: `Voucher ${newCoupon.code} is now live in the heritage collection.`
    });
  };

  const handleDeleteCoupon = (id) => {
    if (window.confirm("Archive this promotional protocol permanently?")) {
      setCoupons(coupons.filter(c => c.id !== id));
      toast.success("Voucher archived successfully");
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Voucher Code Replicated", { description: "Copied to clipboard for institutional use." });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

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
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent">Promotion Protocol</span>
           </div>
           <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter text-foreground">
             Festive <span className="italic font-light text-primary">Vouchers.</span>
           </h1>
           <p className="text-muted-foreground text-sm font-medium opacity-80 leading-relaxed max-w-md">Orchestrate exclusive incentives to celebrate the spirit of heritage wear with curated promotional protocols.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-bold flex items-center gap-4 hover:brightness-110 transition-all shadow-xl shadow-primary/10 group"
        >
          <Plus size={24} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" /> 
          <span className="text-[10px] uppercase tracking-[0.2em] text-primary-foreground">Generate Voucher</span>
        </button>
      </motion.div>
 
      {/* Create Coupon Modal Placeholder - Updating backgrounds to match */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-background border border-border rounded-[3rem] p-12 shadow-2xl overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-12 text-primary/5 pointer-events-none">
                  <Sparkles size={200} strokeWidth={0.5} />
               </div>
               
               <div className="flex justify-between items-start mb-12 relative z-10">
                  <div className="space-y-1">
                    <h2 className="text-4xl font-heading font-bold tracking-tighter text-foreground">New <span className="italic font-light text-primary">Promotion</span></h2>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest italic opacity-60">Configure institutional-grade incentive protocol</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-3 bg-muted rounded-xl text-muted-foreground hover:text-primary transition-all">
                    <CheckCircle size={20} className="rotate-45" />
                  </button>
               </div>
 
               <form onSubmit={handleCreateCoupon} className="space-y-8 relative z-10">
                  <div className="space-y-3">
                    <label className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest ml-1">Voucher Code</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. JAIPUR50" 
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      className="w-full bg-muted/50 border border-border rounded-2xl p-5 text-foreground placeholder:text-muted-foreground/20 focus:outline-none focus:border-primary/40 transition-all font-bold tracking-widest"
                    />
                  </div>
 
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest ml-1">Type</label>
                      <select 
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="w-full bg-muted/50 border border-border rounded-2xl p-5 text-sm text-foreground focus:outline-none focus:border-primary/40 transition-all appearance-none cursor-pointer"
                      >
                        <option value="Percentage">Percentage (%)</option>
                        <option value="Fixed Amount">Fixed Amount (₹)</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest ml-1">Value</label>
                      <input 
                        required
                        type="number" 
                        placeholder="0" 
                        value={formData.discount}
                        onChange={(e) => setFormData({...formData, discount: e.target.value})}
                        className="w-full bg-muted/50 border border-border rounded-2xl p-5 text-foreground focus:outline-none focus:border-primary/40 transition-all font-bold"
                      />
                    </div>
                  </div>
 
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest ml-1">Patron Limit</label>
                      <input 
                        type="number" 
                        placeholder="Unlimited" 
                        value={formData.usageLimit}
                        onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                        className="w-full bg-muted/50 border border-border rounded-2xl p-5 text-foreground focus:outline-none focus:border-primary/40 transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest ml-1">Sunset Date</label>
                      <input 
                        type="date" 
                        value={formData.expiry}
                        onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                        className="w-full bg-muted/50 border border-border rounded-2xl p-5 text-sm text-foreground focus:outline-none focus:border-primary/40 transition-all cursor-pointer"
                      />
                    </div>
                  </div>
 
                  <div className="pt-8">
                    <button type="submit" className="w-full bg-primary text-primary-foreground py-6 rounded-2xl font-bold uppercase tracking-[0.4em] text-[10px] hover:brightness-110 transition-all shadow-xl shadow-primary/20">
                       Deploy Campaign
                    </button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
 
      {/* Advanced Control Bar */}
      <motion.div variants={itemVariants} className="bg-background/40 backdrop-blur-xl border border-border p-8 rounded-[3rem] flex flex-col lg:flex-row justify-between gap-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-6 flex-1">
          <div className="relative group flex-1 w-full max-w-md">
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-accent group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search codes or IDs..." 
              className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-14 pr-6 text-xs text-foreground focus:outline-none focus:border-primary/40 transition-all"
            />
          </div>
          <button 
            onClick={() => toast.info("Filter Protocol: Percentage and Fixed incentives active")}
            className="px-8 py-4 bg-background border border-border rounded-2xl text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary transition-all flex items-center gap-3 shadow-sm"
          >
             <Filter size={18} /> Protocol Type
          </button>
        </div>
        
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          {['All Active', 'Scheduled', 'Expired', 'Archived'].map((t) => (
            <button key={t} className={`px-8 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all shadow-sm ${
              t === 'All Active' ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary'
            }`}>
               {t}
            </button>
          ))}
        </div>
      </motion.div>
.       {/* Vouchers List - Cinematic Gallery */}
      <motion.div variants={itemVariants} className="bg-background/60 backdrop-blur-md border border-border rounded-[3rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted border-b border-border text-muted-foreground/40">
              <tr>
                <th className="px-10 py-8 font-bold text-[10px] uppercase tracking-[0.3em]">Promotion</th>
                <th className="px-10 py-8 font-bold text-[10px] uppercase tracking-[0.3em]">Benefit</th>
                <th className="px-10 py-8 font-bold text-[10px] uppercase tracking-[0.3em]">Usage</th>
                <th className="px-10 py-8 font-bold text-[10px] uppercase tracking-[0.3em]">Sunset</th>
                <th className="px-10 py-8 font-bold text-[10px] uppercase tracking-[0.3em]">Protocol Status</th>
                <th className="px-10 py-8 font-bold text-[10px] uppercase tracking-[0.3em] text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {coupons.map((coupon, idx) => (
                <motion.tr 
                  key={coupon.id} 
                  className="hover:bg-primary/[0.02] transition-colors group cursor-default"
                >
                  <td className="px-10 py-10">
                    <div className="flex items-center gap-8">
                      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center border border-border group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-700">
                        <Tag size={20} className="text-primary group-hover:text-primary-foreground transition-colors" />
                      </div>
                      <div>
                        <p className="font-heading font-bold text-3xl text-foreground group-hover:text-primary transition-colors tracking-widest">{coupon.code}</p>
                        <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest mt-1.5 font-bold italic">{coupon.id} • {coupon.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-10">
                    <span className="text-3xl font-heading font-bold text-primary">{coupon.discount}</span>
                  </td>
                  <td className="px-10 py-10">
                    <div className="flex flex-col gap-3">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{coupon.usage}</span>
                       <div className="w-40 h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: '60%' }}
                            className="h-full bg-primary shadow-lg" 
                          />
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-10">
                    <div className="flex items-center gap-3 text-[11px] font-bold text-foreground/60 uppercase tracking-widest">
                       <Calendar size={16} className="text-accent" />
                       {coupon.expiry}
                    </div>
                  </td>
                  <td className="px-10 py-10">
                    <div className={`inline-flex items-center gap-3 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border backdrop-blur-md ${
                      coupon.status === 'Active' 
                        ? 'bg-green-500/10 text-green-700 border-green-500/20' 
                        : 'bg-muted text-muted-foreground border-border'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${coupon.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground/20'}`} />
                      {coupon.status}
                    </div>
                  </td>
                  <td className="px-10 py-10 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                      <button 
                        onClick={() => handleCopyCode(coupon.code)}
                        className="p-4 bg-muted hover:bg-primary border border-border rounded-2xl text-muted-foreground hover:text-primary-foreground transition-all shadow-sm" title="Replicate"
                      >
                        <Copy size={18} />
                      </button>
                      <button 
                        onClick={() => toast.info("Voucher Modification: Pending deployment")}
                        className="p-4 bg-muted hover:bg-primary border border-border rounded-2xl text-muted-foreground hover:text-primary-foreground transition-all shadow-sm"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="p-4 bg-muted hover:bg-destructive/10 border border-border rounded-2xl text-muted-foreground hover:text-destructive transition-all shadow-sm"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
 
      {/* Promotional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-24">
         {[
           { label: 'Institutional Savings', value: '₹12.4k', icon: <Percent size={24} />, trend: 'Avg. 15%' },
           { label: 'Conversion Lift', value: '+18.2%', icon: <TrendingUp size={24} />, trend: 'This Cycle' },
           { label: 'Active Campaigns', value: '08', icon: <Ticket size={24} />, trend: '02 Expiring' },
         ].map((stat, i) => (
           <motion.div 
            key={i}
            variants={itemVariants}
            className="p-10 bg-background/60 backdrop-blur-md border border-border rounded-[3rem] flex items-center gap-8 group hover:border-primary/20 transition-all shadow-sm"
           >
              <div className="p-6 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                 {stat.icon}
              </div>
              <div className="space-y-2">
                 <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest font-bold">{stat.label}</p>
                 <div className="flex items-end gap-4">
                    <h4 className="text-3xl font-bold text-foreground font-heading">{stat.value}</h4>
                    <span className="text-[10px] font-bold uppercase text-primary pb-1.5">{stat.trend}</span>
                 </div>
              </div>
           </motion.div>
         ))}
      </div>
    </motion.div>
  );
};

export default AdminCoupons;
