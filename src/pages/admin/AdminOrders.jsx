import React, { useState, useEffect, useRef } from 'react';
import {
   Search, Filter, Calendar, ChevronDown,
   MoreHorizontal, ShoppingBag, Truck, CheckCircle2,
   XCircle, Clock, ExternalLink, Download,
   Mail, User, MapPin, ChevronRight, Sparkles,
   ShieldCheck, Loader2, RefreshCw, PackageCheck, PackageOpen,
   Eye, Receipt, Printer, Copy, Share2, Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminService } from '../../services/adminService';
import { orderService } from '../../services/orderService';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '../../lib/utils';

const AdminOrders = () => {
   useEffect(() => {
      // Add print styles dynamically
      const style = document.createElement('style');
      style.innerHTML = `
      @media print {
        body * {
          visibility: hidden !important;
        }
        #printable-invoice, #printable-invoice * {
          visibility: visible !important;
        }
        #printable-invoice {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
        }
        /* Hide UI elements within the invoice if any */
        .no-print {
          display: none !important;
        }
      }
    `;
      document.head.appendChild(style);
      return () => document.head.removeChild(style);
   }, []);

   const [orders, setOrders] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchQuery, setSearchQuery] = useState('');
   const [statusFilter, setStatusFilter] = useState('All');
   const [selectedOrder, setSelectedOrder] = useState(null);
   const [showDetailModal, setShowDetailModal] = useState(false);
   const [showInvoiceModal, setShowInvoiceModal] = useState(false);
   const [showShipmentModal, setShowShipmentModal] = useState(false);
   const invoiceRef = useRef();

   const fetchOrders = async () => {
      try {
         setLoading(true);
         const response = await adminService.getAllOrders();
         if (response.success) {
            setOrders(response.data);
         }
      } catch (error) {
         toast.error("Failed to fetch artisanal acquisitions");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchOrders();
   }, []);

   const handleStatusUpdate = async (orderId, newStatus) => {
      const promise = adminService.updateOrderStatus(orderId, newStatus);
      toast.promise(promise, {
         loading: 'Updating artisanal status...',
         success: (data) => {
            if (data.success) {
               setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
               if (selectedOrder?.id === orderId) {
                  setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
               }
               return `Acquisition marked as ${newStatus}`;
            }
            throw new Error(data.message);
         },
         error: 'Failed to update status'
      });
   };

   const handleShipmentUpdate = async (orderId, shipmentData) => {
      try {
         const res = await orderService.updateShipment(orderId, shipmentData);
         if (res.success) {
            toast.success("Artisanal consignment details updated successfully");
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: 'SHIPPED' } : o));
            setShowShipmentModal(false);
            fetchOrders();
         } else {
            toast.error(res.message);
         }
      } catch (error) {
         toast.error("Failed to update shipment records");
      }
   };

   const getStatusConfig = (status) => {
      switch (status) {
         case 'DELIVERED': return { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', icon: <CheckCircle2 size={12} />, progress: 100 };
         case 'PENDING': return { color: 'text-accent-gold', bg: 'bg-accent-gold/5', border: 'border-accent-gold/10', icon: <Clock size={12} />, progress: 15 };
         case 'PROCESSING': return { color: 'text-accent-maroon', bg: 'bg-accent-maroon/5', border: 'border-accent-maroon/10', icon: <PackageOpen size={12} />, progress: 40 };
         case 'SHIPPED': return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: <Truck size={12} />, progress: 75 };
         case 'CANCELLED': return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', icon: <XCircle size={12} />, progress: 0 };
         default: return { color: 'text-text-secondary', bg: 'bg-primary/50', border: 'border-accent-gold/5', icon: <Clock size={12} />, progress: 0 };
      }
   };

   const filteredOrders = orders.filter(o => {
      const patronName = `${o.user?.firstName || ''} ${o.user?.lastName || ''}`.toLowerCase();
      const matchesSearch = (o.orderNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
         patronName.includes(searchQuery.toLowerCase()) ||
         (o.user?.email || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
      return matchesSearch && matchesStatus;
   });

   const handlePrintInvoice = () => {
      window.print();
   };

   if (loading) {
      return (
         <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-accent-gold animate-spin" />
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">Curating Archive...</p>
         </div>
      );
   }

   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         className="space-y-12"
      >
         {/* Header Area */}
         <div className="flex flex-col md:flex-row justify-between md:items-end gap-10 border-b border-border pb-12">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-[1px] bg-accent" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent">Heritage Fulfillment</span>
               </div>
               <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter text-foreground">
                  Acquisition <span className="italic font-light text-primary">Management.</span>
               </h1>
               <p className="text-muted-foreground text-sm font-medium opacity-80 leading-relaxed max-w-md">Track and curate masterpiece deliveries to our global patrons with artisanal precision.</p>
            </div>
            <div className="flex items-center gap-4">
               <button
                  onClick={fetchOrders}
                  className="p-5 bg-background border border-border rounded-2xl text-primary hover:border-primary transition-all shadow-sm group"
               >
                  <RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-700" />
               </button>
               <button className="bg-primary text-primary-foreground px-10 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/10">
                  Artisan Batch Actions
               </button>
            </div>
         </div>

         {/* Control Bar */}
         <div className="bg-background/40 backdrop-blur-xl border border-border p-8 rounded-[3rem] flex flex-col lg:flex-row justify-between gap-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-6 flex-1">
               <div className="relative group flex-1 w-full max-w-md">
                  <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-accent group-focus-within:text-primary transition-colors" />
                  <input
                     type="text"
                     placeholder="Heritage ID, Patron, or Email..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-14 pr-6 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 transition-all"
                  />
               </div>
               <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
                  {['All', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(status => (
                     <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-6 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest border shrink-0 transition-all shadow-sm ${statusFilter === status
                              ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                              : 'bg-background text-muted-foreground border-border hover:border-primary hover:text-primary'
                           }`}
                     >
                        {status}
                     </button>
                  ))}
               </div>
            </div>
         </div>

         {/* Orders Grid */}
         <div className="space-y-6">
            {filteredOrders.length === 0 ? (
               <div className="py-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-primary/50 rounded-full flex items-center justify-center mx-auto">
                     <ShoppingBag size={32} className="text-accent-gold/30" />
                  </div>
                  <p className="text-sm italic text-text-secondary">No acquisitions found in this anthology.</p>
               </div>
            ) : (
               filteredOrders.map((order) => {
                  const config = getStatusConfig(order.orderStatus);
                  return (
                     <motion.div
                        key={order.id}
                        layoutId={`order-${order.id}`}
                        className="group bg-background/60 backdrop-blur-md border border-border rounded-[2.5rem] p-8 flex flex-col lg:flex-row items-center justify-between gap-10 hover:border-primary/20 transition-all shadow-sm hover:shadow-xl relative overflow-hidden"
                     >
                        <div className="flex items-center gap-8 w-full lg:w-auto">
                           <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex flex-col items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                              <span className="text-2xl font-heading font-bold">{order.items?.length || 0}</span>
                              <span className="text-[8px] font-bold uppercase tracking-widest">Pieces</span>
                           </div>

                           <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-4 mb-2">
                                 <h3 className="text-2xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">{order.orderNumber}</h3>
                                 <div className={`px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border backdrop-blur-md ${config.bg} ${config.color} ${config.border}`}>
                                    {order.orderStatus}
                                 </div>
                              </div>
                              <p className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-[0.2em]">
                                 {new Date(order.createdAt).toLocaleString()}
                              </p>
                           </div>
                        </div>

                        <div className="flex items-center gap-5 w-full lg:w-72 border-t lg:border-t-0 lg:border-x border-border pt-8 lg:pt-0 lg:px-10">
                           <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                              <User size={18} className="text-accent" />
                           </div>
                           <div className="min-w-0">
                              <p className="text-sm font-bold text-foreground truncate">{order.user?.firstName} {order.user?.lastName}</p>
                              <p className="text-[10px] text-muted-foreground italic truncate font-medium">{order.user?.email}</p>
                           </div>
                        </div>

                        <div className="flex items-center justify-between lg:justify-end gap-10 w-full lg:w-auto pt-8 lg:pt-0 border-t lg:border-t-0 border-border">
                           <div className="text-right">
                              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.2em] mb-1.5">Total Amount</p>
                              <p className="text-3xl font-heading font-bold text-primary">₹{order.totalAmount?.toLocaleString()}</p>
                           </div>
                           <div className="flex items-center gap-3">
                              <button
                                 onClick={() => { setSelectedOrder(order); setShowDetailModal(true); }}
                                 className="p-4 bg-muted/50 hover:bg-primary text-muted-foreground hover:text-primary-foreground rounded-2xl transition-all shadow-sm"
                                 title="View Details"
                              >
                                 <Eye size={20} />
                              </button>
                              <button
                                 onClick={() => { setSelectedOrder(order); setShowInvoiceModal(true); }}
                                 className="p-4 bg-muted/50 hover:bg-accent text-muted-foreground hover:text-accent-foreground rounded-2xl transition-all shadow-sm"
                                 title="Artisanal Invoice"
                              >
                                 <Receipt size={20} />
                              </button>
                           </div>
                        </div>
                     </motion.div>

                  );
               })
            )}
         </div>

         {/* Order Detail Modal */}
         <AnimatePresence>
            {showDetailModal && selectedOrder && (
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
                     className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-accent-gold/10"
                  >
                     {/* Modal Header */}
                     <div className="p-8 border-b border-accent-gold/10 flex justify-between items-center bg-primary/20">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-accent-maroon text-white rounded-2xl flex items-center justify-center shadow-lg shadow-accent-maroon/20">
                              <ShoppingBag size={24} />
                           </div>
                           <div>
                              <h2 className="text-2xl font-heading font-bold">{selectedOrder.orderNumber}</h2>
                              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold">Patron Acquisition Record</p>
                           </div>
                        </div>
                        <button onClick={() => setShowDetailModal(false)} className="p-3 bg-white hover:bg-accent-maroon hover:text-white rounded-2xl transition-all border border-accent-gold/10">
                           <XCircle size={20} />
                        </button>
                     </div>

                     {/* Modal Content */}
                     <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                           {/* Column 1: Status & Info */}
                           <div className="space-y-6">
                              <div className="bg-primary/30 p-6 rounded-3xl border border-accent-gold/5 space-y-4">
                                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent-maroon flex items-center gap-2">
                                    <ShieldCheck size={12} /> Status Progress
                                 </h4>
                                 <div className="space-y-3">
                                    {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((status, i) => {
                                       const isCurrent = selectedOrder.orderStatus === status;
                                       const isPast = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].indexOf(selectedOrder.orderStatus) >= i;
                                       return (
                                          <div key={status} className="flex items-center gap-3">
                                             <div className={cn(
                                                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                                isCurrent ? "bg-accent-gold border-accent-gold" : isPast ? "bg-accent-maroon border-accent-maroon" : "border-accent-gold/20"
                                             )}>
                                                {isPast && <CheckCircle2 size={10} className="text-white" />}
                                             </div>
                                             <span className={cn(
                                                "text-[10px] font-bold tracking-widest uppercase",
                                                isCurrent ? "text-accent-maroon" : isPast ? "text-text-primary" : "text-text-secondary/40"
                                             )}>{status}</span>
                                          </div>
                                       );
                                    })}
                                 </div>
                              </div>

                              <div className="bg-white border border-accent-gold/10 p-6 rounded-3xl space-y-4 shadow-sm">
                                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent-gold flex items-center gap-2">
                                    <Truck size={12} /> Shipment Intelligence
                                 </h4>
                                 <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                       <span className="text-[9px] text-text-secondary uppercase">Courier</span>
                                       <span className="text-xs font-bold">{selectedOrder.courierName || 'Pending Assignment'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                       <span className="text-[9px] text-text-secondary uppercase">Tracking ID</span>
                                       <span className="text-xs font-bold font-mono">{selectedOrder.trackingNumber || 'N/A'}</span>
                                    </div>
                                 </div>
                                 {selectedOrder.orderStatus !== 'DELIVERED' && selectedOrder.orderStatus !== 'CANCELLED' && (
                                    <div className="pt-4 border-t border-accent-gold/10">
                                       <p className="text-[8px] font-bold uppercase text-accent-maroon mb-2">Update Acquisition Phase</p>
                                       <div className="grid grid-cols-2 gap-2">
                                          {['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(st => (
                                             <button
                                                key={st}
                                                onClick={() => {
                                                   if (st === 'SHIPPED') {
                                                      setShowDetailModal(false);
                                                      setShowShipmentModal(true);
                                                   } else {
                                                      handleStatusUpdate(selectedOrder.id, st);
                                                   }
                                                }}
                                                className="py-2 bg-primary/50 hover:bg-accent-maroon hover:text-white text-[8px] font-bold rounded-lg transition-all border border-accent-gold/10"
                                             >
                                                {st === 'SHIPPED' ? 'ADD TRACKING' : st}
                                             </button>
                                          ))}
                                       </div>
                                    </div>
                                 )}
                              </div>
                           </div>

                           {/* Column 2 & 3: Items & Address */}
                           <div className="md:col-span-2 space-y-8">
                              <div className="space-y-4">
                                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent-maroon">Artisanal Pieces</h4>
                                 <div className="space-y-4">
                                    {selectedOrder.items?.map((item, i) => (
                                       <div key={i} className="flex gap-4 p-4 bg-primary/20 rounded-3xl border border-accent-gold/5 group hover:bg-white transition-all shadow-sm">
                                          <div className="w-20 h-24 bg-white rounded-2xl overflow-hidden border border-accent-gold/10 shrink-0">
                                             <img src={item.product?.images?.[0]?.url || 'https://placehold.co/100x120'} alt={item.product?.title} className="w-full h-full object-cover" />
                                          </div>
                                          <div className="flex-1 py-1 flex flex-col">
                                             <div className="flex justify-between items-start">
                                                <div>
                                                   <h5 className="font-bold text-sm text-text-primary">{item.product?.title}</h5>
                                                   <p className="text-[9px] text-accent-gold font-bold uppercase tracking-widest mt-1">Size: {item.selectedSize} | Color: {item.selectedColor}</p>
                                                </div>
                                                <p className="font-bold text-sm text-accent-maroon">₹{(item.price || 0).toLocaleString()}</p>
                                             </div>
                                             <div className="mt-auto flex justify-between items-end">
                                                <p className="text-[10px] font-bold text-text-secondary">Quantity: {item.quantity}</p>
                                                <p className="text-xs font-bold text-text-primary">Subtotal: ₹{(item.price * item.quantity).toLocaleString()}</p>
                                             </div>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                 <div className="bg-primary/10 p-6 rounded-3xl border border-accent-gold/5 space-y-3">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent-gold flex items-center gap-2">
                                       <MapPin size={12} /> Delivery Canvas
                                    </h4>
                                    <p className="text-xs text-text-primary leading-relaxed italic">{selectedOrder.shippingAddress}</p>
                                 </div>
                                 <div className="bg-primary/10 p-6 rounded-3xl border border-accent-gold/5 space-y-3">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent-gold flex items-center gap-2">
                                       <Receipt size={12} /> Financial Dossier
                                    </h4>
                                    <div className="space-y-1 text-xs">
                                       <div className="flex justify-between">
                                          <span className="text-text-secondary">Method</span>
                                          <span className="font-bold uppercase tracking-tighter">{selectedOrder.paymentMethod}</span>
                                       </div>
                                       <div className="flex justify-between">
                                          <span className="text-text-secondary">Status</span>
                                          <span className="font-bold text-green-600 uppercase">{selectedOrder.paymentStatus}</span>
                                       </div>
                                       <div className="pt-2 flex justify-between text-base border-t border-accent-gold/10 mt-2">
                                          <span className="font-heading font-bold">Total</span>
                                          <span className="font-heading font-bold text-accent-maroon">₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Modal Footer */}
                     <div className="p-8 border-t border-accent-gold/10 flex justify-end gap-4 bg-primary/10">
                        <button
                           onClick={() => { setShowDetailModal(false); setShowInvoiceModal(true); }}
                           className="flex items-center gap-3 px-8 py-3 bg-white border border-accent-gold/10 text-accent-gold hover:text-accent-maroon rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm"
                        >
                           <Receipt size={16} /> Generate Invoice
                        </button>
                        <button className="flex items-center gap-3 px-8 py-3 bg-accent-maroon text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-text-primary transition-all shadow-xl shadow-accent-maroon/20">
                           <Box size={16} /> Mark as Packed
                        </button>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         {/* Invoice Modal (Printable) */}
         <AnimatePresence>
            {showInvoiceModal && selectedOrder && (
               <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     onClick={() => setShowInvoiceModal(false)}
                     className="absolute inset-0 bg-background/90 backdrop-blur-xl"
                  />
                  <motion.div
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0.9, opacity: 0 }}
                     className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
                  >
                     <div className="p-4 border-b border-border flex justify-between items-center bg-primary/5">
                        <h3 className="text-sm font-bold uppercase tracking-widest">Artisanal Invoice View</h3>
                        <div className="flex gap-2">
                           <button onClick={handlePrintInvoice} className="p-2 bg-accent-maroon text-white rounded-lg hover:brightness-110 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-4">
                              <Printer size={14} /> Print
                           </button>
                           <button onClick={() => setShowInvoiceModal(false)} className="p-2 bg-muted rounded-lg hover:bg-destructive hover:text-white transition-all">
                              <XCircle size={14} />
                           </button>
                        </div>
                     </div>

                     <div className="flex-1 overflow-y-auto p-10 no-scrollbar" id="printable-invoice" ref={invoiceRef}>
                        {/* Artisanal Invoice Structure */}
                        <div className="max-w-[800px] mx-auto border-[10px] border-primary/20 p-10 relative">
                           {/* Logo & Header */}
                           <div className="flex justify-between items-start border-b-2 border-accent-gold/20 pb-8 mb-10">
                              <div>
                                 <h1 className="text-4xl font-heading font-bold text-accent-maroon tracking-tighter">BADRI APPAREL.</h1>
                                 <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent-gold mt-1">Jaipur Heritage Boutique</p>
                                 <div className="mt-6 text-[9px] text-text-secondary leading-relaxed uppercase tracking-widest font-medium">
                                    Plot No. 42, Artisans Lane<br />
                                    Johari Bazaar, Jaipur, RJ 302003<br />
                                    GSTIN: 08AAAAA0000A1Z5
                                 </div>
                              </div>
                              <div className="text-right">
                                 <h2 className="text-5xl font-heading font-bold text-primary/10 absolute top-10 right-10">INVOICE</h2>
                                 <div className="mt-16 space-y-1">
                                    <p className="text-[10px] font-bold text-text-secondary uppercase">Invoice Number</p>
                                    <p className="text-lg font-bold font-mono">{selectedOrder.orderNumber?.replace('#', 'INV-')}</p>
                                    <p className="text-[10px] font-bold text-text-secondary uppercase mt-4">Order Date</p>
                                    <p className="text-xs font-bold">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                                 </div>
                              </div>
                           </div>

                           {/* Addresses */}
                           <div className="grid grid-cols-2 gap-20 mb-12">
                              <div className="space-y-4">
                                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-accent-gold border-b border-accent-gold/10 pb-2">Patron Details</h3>
                                 <div className="text-xs space-y-1">
                                    <p className="font-bold text-sm uppercase">{selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</p>
                                    <p className="text-text-secondary font-medium">{selectedOrder.user?.email}</p>
                                    <p className="text-text-secondary font-medium">{selectedOrder.user?.phoneNumber}</p>
                                 </div>
                              </div>
                              <div className="space-y-4">
                                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-accent-gold border-b border-accent-gold/10 pb-2">Shipping Destination</h3>
                                 <p className="text-xs text-text-primary leading-relaxed font-medium italic">
                                    {selectedOrder.shippingAddress}
                                 </p>
                              </div>
                           </div>

                           {/* Items Table */}
                           <table className="w-full mb-12">
                              <thead>
                                 <tr className="bg-primary/10 text-[9px] font-bold uppercase tracking-[0.2em] text-accent-maroon">
                                    <th className="py-4 px-4 text-left">Masterpiece</th>
                                    <th className="py-4 px-4 text-center">Specifications</th>
                                    <th className="py-4 px-4 text-center">Price</th>
                                    <th className="py-4 px-4 text-center">Qty</th>
                                    <th className="py-4 px-4 text-right">Total</th>
                                 </tr>
                              </thead>
                              <tbody className="text-xs">
                                 {selectedOrder.items?.map((item, idx) => (
                                    <tr key={idx} className="border-b border-accent-gold/5">
                                       <td className="py-5 px-4">
                                          <p className="font-bold text-text-primary uppercase tracking-tight">{item.product?.title}</p>
                                          <p className="text-[8px] text-text-secondary font-bold tracking-widest mt-0.5 uppercase">HSN: 6204</p>
                                       </td>
                                       <td className="py-5 px-4 text-center">
                                          <span className="text-[9px] font-bold bg-muted px-2 py-1 rounded uppercase tracking-tighter">{item.selectedSize} / {item.selectedColor}</span>
                                       </td>
                                       <td className="py-5 px-4 text-center font-medium">₹{item.price?.toLocaleString()}</td>
                                       <td className="py-5 px-4 text-center font-bold">{item.quantity}</td>
                                       <td className="py-5 px-4 text-right font-bold">₹{(item.price * item.quantity).toLocaleString()}</td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>

                           {/* Footer: Totals & QR */}
                           <div className="flex justify-between items-end border-t-2 border-accent-gold/20 pt-10">
                              <div className="flex gap-10 items-center bg-primary/5 p-6 rounded-2xl border border-accent-gold/10">
                                 <div>
                                    <p className="text-[8px] font-bold uppercase tracking-widest text-accent-gold mb-2">Delhivery Waybill QR</p>
                                    <div className="bg-white p-2 rounded-lg border border-accent-gold/5 inline-block">
                                       <QRCodeSVG
                                          value={JSON.stringify({
                                             o: selectedOrder.orderNumber,
                                             c: "BADRI_APPAREL",
                                             p: `${selectedOrder.user?.firstName} ${selectedOrder.user?.lastName}`,
                                             a: selectedOrder.shippingAddress,
                                             t: selectedOrder.trackingNumber || "PENDING"
                                          })}
                                          size={100}
                                          level="H"
                                          includeMargin={false}
                                          fgColor="#4A0404"
                                       />
                                    </div>
                                 </div>
                                 <div className="space-y-1 text-[8px] font-bold uppercase tracking-widest text-text-secondary opacity-60 max-w-[150px]">
                                    Please scan for digital verification of artisanal authenticity and shipment tracking.
                                 </div>
                              </div>

                              <div className="w-64 space-y-3">
                                 <div className="flex justify-between text-xs">
                                    <span className="text-text-secondary font-medium uppercase tracking-tighter">Subtotal (Pre-Tax)</span>
                                    <span className="font-bold">₹{(selectedOrder.totalAmount * 0.88).toFixed(2)}</span>
                                 </div>
                                 <div className="flex justify-between text-xs">
                                    <span className="text-text-secondary font-medium uppercase tracking-tighter">GST (12%)</span>
                                    <span className="font-bold">₹{(selectedOrder.totalAmount * 0.12).toFixed(2)}</span>
                                 </div>
                                 <div className="flex justify-between text-xl font-heading font-bold text-accent-maroon pt-4 border-t border-accent-gold/10">
                                    <span>TOTAL</span>
                                    <span>₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                                 </div>
                                 <p className="text-[8px] text-right text-text-secondary italic mt-4">
                                    Includes applied coupons and complimentary artisanal shipping.
                                 </p>
                              </div>
                           </div>

                           {/* Signature Area */}
                           <div className="mt-20 flex justify-between items-end">
                              <div className="text-[8px] font-bold uppercase tracking-[0.3em] text-text-secondary/40">
                                 Authentic Jaipuri Handblock Collection<br />
                                 © 2026 Badri Apparel Private Limited
                              </div>
                              <div className="text-center w-48 border-t border-accent-gold/40 pt-4">
                                 <p className="text-[9px] font-bold uppercase tracking-widest text-accent-maroon">Authorized Signatory</p>
                                 <p className="text-[7px] text-text-secondary uppercase mt-1 tracking-tighter italic">Digital Verification Sealed</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         {/* Load More Button */}
         <div className="flex justify-center pb-20">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => toast.info("Artisan Batch Actions: Selection protocol initiated")}
                className="p-5 bg-white border border-accent-gold/10 rounded-2xl text-accent-gold hover:border-accent-maroon transition-all shadow-sm"
              >
                 <Package size={24} />
              </button>
              <button 
                onClick={() => toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
                  loading: 'Synchronizing historical anthology...',
                  success: 'Previous heritage cycles loaded',
                  error: 'Synchronization failed'
                })}
                className="group flex items-center gap-5 px-12 py-5 bg-white border border-accent-gold/10 rounded-[2.5rem] hover:border-accent-maroon transition-all shadow-sm"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-text-secondary group-hover:text-accent-maroon transition-colors">Load Historical Anthology</span>
                <ChevronRight size={18} className="text-accent-gold group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
         </div>
          {/* Shipment Info Modal */}
          <AnimatePresence>
             {showShipmentModal && selectedOrder && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
                   <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowShipmentModal(false)}
                      className="absolute inset-0 bg-background/90 backdrop-blur-xl"
                   />
                   <motion.div
                      initial={{ scale: 0.9, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.9, opacity: 0, y: 20 }}
                      className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl p-10 border border-accent-gold/10"
                   >
                      <div className="flex justify-between items-center mb-10">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-accent-gold text-white rounded-2xl flex items-center justify-center">
                               <Truck size={24} />
                            </div>
                            <div>
                               <h3 className="text-xl font-heading font-bold">Consignment Dispatch</h3>
                               <p className="text-[9px] font-bold uppercase tracking-widest text-accent-gold">Order {selectedOrder.orderNumber}</p>
                            </div>
                         </div>
                         <button onClick={() => setShowShipmentModal(false)} className="p-3 hover:bg-accent-maroon hover:text-white rounded-2xl transition-all border border-accent-gold/10">
                            <XCircle size={18} />
                         </button>
                      </div>

                      <form onSubmit={(e) => {
                         e.preventDefault();
                         const formData = new FormData(e.target);
                         handleShipmentUpdate(selectedOrder.id, {
                            carrier: formData.get('carrier'),
                            awbCode: formData.get('awbCode'),
                            trackingUrl: formData.get('trackingUrl'),
                            estimatedDelivery: formData.get('estimatedDelivery')
                         });
                      }} className="space-y-8">
                         <div className="space-y-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Premium Logistics Carrier</label>
                               <select 
                                  name="carrier" 
                                  required
                                  className="w-full bg-primary/5 border border-accent-gold/10 rounded-2xl px-6 py-4 text-xs font-bold focus:outline-none focus:border-accent-maroon transition-all appearance-none"
                               >
                                  <option value="Delhivery">Delhivery Express</option>
                                  <option value="Shiprocket">Shiprocket (Multi-Courier)</option>
                                  <option value="BlueDart">BlueDart DHL</option>
                                  <option value="DTDC">DTDC Premium</option>
                                  <option value="India Post">India Post (Speed Post)</option>
                                  <option value="Other">Other Artisanal Carrier</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                               <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">AWB / Tracking Credentials</label>
                               <input 
                                  type="text" 
                                  name="awbCode" 
                                  placeholder="e.g. 1234567890" 
                                  required
                                  className="w-full bg-primary/5 border border-accent-gold/10 rounded-2xl px-6 py-4 text-xs font-bold focus:outline-none focus:border-accent-maroon transition-all"
                               />
                            </div>

                            <div className="space-y-2">
                               <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Tracking Interface URL</label>
                               <input 
                                  type="url" 
                                  name="trackingUrl" 
                                  placeholder="https://carrier.com/track/..." 
                                  className="w-full bg-primary/5 border border-accent-gold/10 rounded-2xl px-6 py-4 text-xs font-bold focus:outline-none focus:border-accent-maroon transition-all"
                               />
                            </div>

                            <div className="space-y-2">
                               <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Expected Arrival Date</label>
                               <input 
                                  type="date" 
                                  name="estimatedDelivery" 
                                  required
                                  className="w-full bg-primary/5 border border-accent-gold/10 rounded-2xl px-6 py-4 text-xs font-bold focus:outline-none focus:border-accent-maroon transition-all"
                               />
                            </div>
                         </div>

                         <div className="pt-6">
                            <button type="submit" className="w-full py-5 bg-accent-maroon text-white rounded-[2rem] text-[10px] font-bold uppercase tracking-[0.4em] hover:brightness-110 transition-all shadow-2xl shadow-accent-maroon/20">
                               Authorize Dispatch
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

export default AdminOrders;

