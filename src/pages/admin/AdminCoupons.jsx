import React, { useState, useEffect } from 'react';
import { 
  Plus, Ticket, Search, Filter, 
  Trash, Edit, Copy, CheckCircle, 
  Tag, Percent, Calendar, TrendingUp, Sparkles,
  ShieldCheck, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import couponService from '../../services/couponService';
import { cn } from '../../lib/utils';

const AdminCoupons = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    discountValue: '',
    discountType: 'PERCENTAGE',
    minOrderAmount: '',
    maxDiscountAmount: '',
    usageLimit: '',
    usageLimitPerUser: 1,
    startsAt: '',
    expiryDate: '',
    active: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const res = await couponService.getAllCoupons();
      if (res.success) {
        setCoupons(res.data);
      }
    } catch (error) {
      toast.error("Failed to load promotion protocols");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discountValue: '',
      discountType: 'PERCENTAGE',
      minOrderAmount: '',
      maxDiscountAmount: '',
      usageLimit: '',
      usageLimitPerUser: 1,
      startsAt: '',
      expiryDate: '',
      active: true
    });
    setEditingCoupon(null);
  };

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        discountValue: coupon.discountValue,
        discountType: coupon.discountType,
        minOrderAmount: coupon.minOrderAmount || '',
        maxDiscountAmount: coupon.maxDiscountAmount || '',
        usageLimit: coupon.usageLimit || '',
        usageLimitPerUser: coupon.usageLimitPerUser || 1,
        startsAt: coupon.startsAt ? coupon.startsAt.substring(0, 16) : '',
        expiryDate: coupon.expiryDate ? coupon.expiryDate.substring(0, 16) : '',
        active: coupon.active
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : null,
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        usageLimitPerUser: parseInt(formData.usageLimitPerUser)
      };

      let res;
      if (editingCoupon) {
        res = await couponService.updateCoupon(editingCoupon.id, data);
      } else {
        res = await couponService.createCoupon(data);
      }

      if (res.success) {
        toast.success(editingCoupon ? 'Protocol Updated' : 'New Protocol Deployed');
        setIsModalOpen(false);
        fetchCoupons();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to save coupon protocol");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Archive this promotional protocol permanently?")) return;
    try {
      const res = await couponService.deleteCoupon(id);
      if (res.success) {
        toast.success("Protocol Archived");
        fetchCoupons();
      }
    } catch (error) {
      toast.error("Failed to archive protocol");
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
          onClick={() => handleOpenModal()}
          className="bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-bold flex items-center gap-4 hover:brightness-110 transition-all shadow-xl shadow-primary/10 group"
        >
          <Plus size={24} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" /> 
          <span className="text-[10px] uppercase tracking-[0.2em] text-primary-foreground">Generate Voucher</span>
        </button>
      </motion.div>
 
      {/* Create/Edit Coupon Modal */}
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
              className="relative w-full max-w-2xl bg-background border border-border rounded-[3rem] p-12 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar"
            >
               <div className="absolute top-0 right-0 p-12 text-primary/5 pointer-events-none">
                  <Sparkles size={200} strokeWidth={0.5} />
               </div>
               
               <div className="flex justify-between items-start mb-12 relative z-10">
                  <div className="space-y-1">
                    <h2 className="text-4xl font-heading font-bold tracking-tighter text-foreground">{editingCoupon ? 'Edit' : 'New'} <span className="italic font-light text-primary">Promotion</span></h2>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest italic opacity-60">Configure institutional-grade incentive protocol</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-3 bg-muted rounded-xl text-muted-foreground hover:text-primary transition-all">
                    <X size={20} />
                  </button>
               </div>
 
               <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest ml-1">Voucher Code</label>
                      <input 
                        required
                        type="text" 
                        placeholder="JAIPUR50" 
                        value={formData.code}
                        onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                        className="w-full bg-muted/50 border border-border rounded-2xl p-5 text-foreground focus:outline-none focus:border-primary/40 transition-all font-bold tracking-widest"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest ml-1">Status</label>
                      <div className="flex items-center gap-4 h-[62px]">
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, active: !formData.active})}
                          className={cn(
                            "px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                            formData.active ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-muted text-muted-foreground border border-border"
                          )}
                        >
                          {formData.active ? 'Active' : 'Inactive'}
                        </button>
                      </div>
                    </div>
                  </div>
 
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest ml-1">Benefit Type</label>
                      <select 
                        value={formData.discountType}
                        onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                        className="w-full bg-muted/50 border border-border rounded-2xl p-5 text-sm text-foreground focus:outline-none focus:border-primary/40 transition-all appearance-none cursor-pointer"
                      >
                        <option value="PERCENTAGE">Percentage (%)</option>
                        <option value="FIXED">Fixed Amount (₹)</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest ml-1">Discount Value</label>
                      <input 
                        required
                        type="number" 
                        value={formData.discountValue}
                        onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                        className="w-full bg-muted/50 border border-border rounded-2xl p-5 text-foreground focus:outline-none focus:border-primary/40 transition-all font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest ml-1">Min Order Value (₹)</label>
                      <input 
                        type="number" 
                        value={formData.minOrderAmount}
                        onChange={(e) => setFormData({...formData, minOrderAmount: e.target.value})}
                        className="w-full bg-muted/50 border border-border rounded-2xl p-5 text-foreground focus:outline-none focus:border-primary/40 transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest ml-1">Max Discount (₹)</label>
                      <input 
                        type="number" 
                        value={formData.maxDiscountAmount}
                        disabled={formData.discountType === 'FIXED'}
                        onChange={(e) => setFormData({...formData, maxDiscountAmount: e.target.value})}
                        className="w-full bg-muted/50 border border-border rounded-2xl p-5 text-foreground focus:outline-none focus:border-primary/40 transition-all disabled:opacity-30"
                      />
                    </div>
                  </div>
 
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest ml-1">Global Limit</label>
                      <input 
                        type="number" 
                        placeholder="Unlimited" 
                        value={formData.usageLimit}
                        onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                        className="w-full bg-muted/50 border border-border rounded-2xl p-5 text-foreground focus:outline-none focus:border-primary/40 transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest ml-1">Limit Per User</label>
                      <input 
                        type="number" 
                        value={formData.usageLimitPerUser}
                        onChange={(e) => setFormData({...formData, usageLimitPerUser: e.target.value})}
                        className="w-full bg-muted/50 border border-border rounded-2xl p-5 text-foreground focus:outline-none focus:border-primary/40 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest ml-1">Starts At</label>
                      <input 
                        type="datetime-local" 
                        value={formData.startsAt}
                        onChange={(e) => setFormData({...formData, startsAt: e.target.value})}
                        className="w-full bg-muted/50 border border-border rounded-2xl p-5 text-sm text-foreground focus:outline-none focus:border-primary/40 transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest ml-1">Expires At</label>
                      <input 
                        type="datetime-local" 
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                        className="w-full bg-muted/50 border border-border rounded-2xl p-5 text-sm text-foreground focus:outline-none focus:border-primary/40 transition-all"
                      />
                    </div>
                  </div>
 
                  <div className="pt-8">
                    <button type="submit" className="w-full bg-primary text-primary-foreground py-6 rounded-2xl font-bold uppercase tracking-[0.4em] text-[10px] hover:brightness-110 transition-all shadow-xl shadow-primary/20">
                       {editingCoupon ? 'Update Protocol' : 'Deploy Campaign'}
                    </button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
 
      {/* Vouchers List */}
      <motion.div variants={itemVariants} className="bg-background/60 backdrop-blur-md border border-border rounded-[3rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted border-b border-border text-muted-foreground/40">
              <tr>
                <th className="px-10 py-8 font-bold text-[10px] uppercase tracking-[0.3em]">Promotion</th>
                <th className="px-10 py-8 font-bold text-[10px] uppercase tracking-[0.3em]">Benefit</th>
                <th className="px-10 py-8 font-bold text-[10px] uppercase tracking-[0.3em]">Usage</th>
                <th className="px-10 py-8 font-bold text-[10px] uppercase tracking-[0.3em]">Dates</th>
                <th className="px-10 py-8 font-bold text-[10px] uppercase tracking-[0.3em]">Protocol Status</th>
                <th className="px-10 py-8 font-bold text-[10px] uppercase tracking-[0.3em] text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Synchronizing Archive...</p>
                    </div>
                  </td>
                </tr>
              ) : coupons.filter(c => !c.deletedAt).map((coupon) => (
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
                        <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest mt-1.5 font-bold italic">{coupon.discountType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-10">
                    <span className="text-3xl font-heading font-bold text-primary">
                      {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                    </span>
                    {coupon.minOrderAmount && (
                      <p className="text-[9px] text-muted-foreground mt-1 uppercase tracking-tighter">Min: ₹{coupon.minOrderAmount}</p>
                    )}
                  </td>
                  <td className="px-10 py-10">
                    <div className="flex flex-col gap-3">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                         {coupon.usedCount} / {coupon.usageLimit || '∞'}
                       </span>
                       <div className="w-40 h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: coupon.usageLimit ? `${(coupon.usedCount / coupon.usageLimit) * 100}%` : '0%' }}
                            className="h-full bg-primary shadow-lg" 
                          />
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-10">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 text-[10px] font-bold text-foreground/60 uppercase tracking-widest">
                        <Calendar size={14} className="text-accent" />
                        {coupon.startsAt ? new Date(coupon.startsAt).toLocaleDateString() : 'Immediate'}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-foreground/60 uppercase tracking-widest opacity-50">
                        <Clock size={14} />
                        {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'No Sunset'}
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-10">
                    <div className={`inline-flex items-center gap-3 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border backdrop-blur-md ${
                      coupon.active 
                        ? 'bg-green-500/10 text-green-700 border-green-500/20' 
                        : 'bg-muted text-muted-foreground border-border'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${coupon.active ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground/20'}`} />
                      {coupon.active ? 'Active' : 'Paused'}
                    </div>
                  </td>
                  <td className="px-10 py-10 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                      <button 
                        onClick={() => handleCopyCode(coupon.code)}
                        className="p-4 bg-muted hover:bg-primary border border-border rounded-2xl text-muted-foreground hover:text-primary-foreground transition-all shadow-sm"
                      >
                        <Copy size={18} />
                      </button>
                      <button 
                        onClick={() => handleOpenModal(coupon)}
                        className="p-4 bg-muted hover:bg-primary border border-border rounded-2xl text-muted-foreground hover:text-primary-foreground transition-all shadow-sm"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(coupon.id)}
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
    </motion.div>
  );
};

export default AdminCoupons;
