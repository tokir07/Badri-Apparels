import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, ChevronRight, Lock, 
  MapPin, Truck, ShieldCheck, ArrowLeft,
  ShoppingBag, Sparkles
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { paymentService } from '../../services/paymentService';
import { loadRazorpayScript } from '../../utils/razorpayLoader';
import { cn } from '../../lib/utils';

const steps = [
  { id: 1, title: 'Shipping', subtitle: 'Delivery Details' },
  { id: 2, title: 'Delivery', subtitle: 'Shipping Method' },
  { id: 3, title: 'Payment', subtitle: 'Secure Checkout' },
  { id: 4, title: 'Success', subtitle: 'Order Confirmed' }
];

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { items, getSubtotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);

  const subtotalValue = getSubtotal() || 0;

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      shippingMethod: 'Express',
      paymentMethod: 'CreditCard'
    }
  });

  const watchFields = watch();
  const shippingCost = watchFields.shippingMethod === 'Express' ? 499 : 0;
  const totalPayable = subtotalValue + shippingCost;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handlePayment = async (formData) => {
    try {
      setIsProcessing(true);
      
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error("Payment SDK failed to load. Please try again.");
        return;
      }

      const orderRes = await paymentService.createOrder();
      const { razorpayOrderId, amount, currency, keyId, customerName, customerEmail, customerContact } = orderRes.data;

      const options = {
        key: keyId,
        amount: amount * 100,
        currency: currency,
        name: "BADRIBHAI APPAREL",
        description: "Artisanal Ethnic Wear Purchase",
        image: "https://via.placeholder.com/200x200?text=Badri+Apparel",
        order_id: razorpayOrderId,
        handler: async (response) => {
          const toastId = toast.loading("Verifying transaction...");
          try {
            console.log("Razorpay Response:", response);
            const verificationData = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              shippingAddress: `${formData.address}, ${formData.city}, ${formData.zip}`
            };
            
            console.log("Sending Verification Data:", verificationData);
            const verifyRes = await paymentService.verifyPayment(verificationData);
            console.log("Verification Response:", verifyRes);

            if (verifyRes.success) {
              setPlacedOrderId(response.razorpay_payment_id);
              nextStep();
              clearCart();
              toast.success("Order Placed Successfully", { id: toastId });
            } else {
              toast.error(verifyRes.message || "Verification failed", { id: toastId });
            }
          } catch (error) {
            console.error("Verification Error:", error);
            toast.error(error.response?.data?.message || "Verification failed. Please contact support.", { id: toastId });
          }
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerContact
        },
        theme: {
          color: "#000000"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        toast.error("Payment Failed: " + response.error.description);
      });
      rzp.open();

    } catch (error) {
      toast.error(error.response?.data?.message || "Could not initiate payment");
    } finally {
      setIsProcessing(false);
    }
  };

  const onSubmit = (data) => {
    if (currentStep < 3) {
      nextStep();
      return;
    }
    handlePayment(data);
  };

  if (items.length === 0 && currentStep !== 4) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-8">
          <ShoppingBag size={40} className="text-muted-foreground/20" />
        </div>
        <h2 className="text-3xl font-heading font-bold mb-4">Your bag is empty</h2>
        <p className="text-muted-foreground text-sm mb-10 max-w-sm text-center">
          You haven't added any artisanal pieces to your checkout yet.
        </p>
        <Link to="/products" className="px-10 py-4 bg-primary text-primary-foreground rounded-xl font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-lg">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: Multi-step Form */}
        <div className="lg:col-span-8">
           {/* Header */}
           <div className="flex items-center justify-between mb-10">
              <Link to="/cart" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                 <ArrowLeft size={14} /> Review Bag
              </Link>
              <div className="flex items-center gap-2 text-primary">
                 <ShieldCheck size={14} />
                 <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encrypted</span>
              </div>
           </div>
  
           {/* Stepper UI */}
           <div className="mb-12 flex justify-between relative">
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-muted -z-10 -translate-y-1/2" />
              <div 
                className="absolute top-1/2 left-0 h-[2px] bg-primary -z-10 -translate-y-1/2 transition-all duration-500 ease-in-out" 
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }} 
              />
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center gap-3">
                   <div 
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all border-2",
                      currentStep >= step.id 
                        ? 'bg-primary text-primary-foreground border-primary shadow-lg' 
                        : 'bg-background border-muted text-muted-foreground'
                    )}
                   >
                      {currentStep > step.id ? <Check size={18} /> : <span className="text-xs font-bold">{step.id}</span>}
                   </div>
                   <div className="text-center hidden md:block">
                      <p className={cn(
                        "text-[10px] font-bold uppercase tracking-widest",
                        currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                      )}>{step.title}</p>
                   </div>
                </div>
              ))}
           </div>
  
           {/* Step Content */}
           <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-sm relative overflow-hidden">
              <AnimatePresence mode="wait">
                <form key={currentStep} onSubmit={handleSubmit(onSubmit)}>
                   {currentStep === 1 && (
                     <motion.div 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-8"
                     >
                        <div className="space-y-1">
                           <h2 className="text-2xl font-heading font-bold text-foreground">Delivery Information</h2>
                           <p className="text-muted-foreground text-sm">Where should we send your artisanal pieces?</p>
                        </div>
  
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">First Name</label>
                              <input {...register('firstName', { required: true })} className="w-full bg-muted border border-border rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Enter first name" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Last Name</label>
                              <input {...register('lastName', { required: true })} className="w-full bg-muted border border-border rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Enter last name" />
                           </div>
                        </div>
  
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Shipping Address</label>
                           <input {...register('address', { required: true })} className="w-full bg-muted border border-border rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Street name, apartment, area" />
                        </div>
  
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">City</label>
                              <input {...register('city', { required: true })} className="w-full bg-muted border border-border rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Jaipur" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Zip / Postal Code</label>
                              <input {...register('zip', { required: true })} className="w-full bg-muted border border-border rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="302001" />
                           </div>
                        </div>
  
                        <div className="flex justify-end pt-4">
                           <button type="submit" className="flex items-center gap-2 px-10 py-4 bg-primary text-primary-foreground rounded-xl font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-lg group">
                              Proceed to Shipping <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                           </button>
                        </div>
                     </motion.div>
                   )}
  
                   {currentStep === 2 && (
                     <motion.div 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-8"
                     >
                        <div className="space-y-1">
                           <h2 className="text-2xl font-heading font-bold text-foreground">Shipping Method</h2>
                           <p className="text-muted-foreground text-sm">Choose your preferred delivery speed.</p>
                        </div>
  
                        <div className="space-y-4">
                           {[
                             { id: 'Standard', title: 'Standard Delivery', time: '5-7 business days', price: 'Free', icon: <Truck size={20} /> },
                             { id: 'Express', title: 'Express Shipping', time: '1-2 business days', price: '₹499', icon: <Sparkles size={20} /> },
                           ].map(method => (
                             <label key={method.id} className={cn(
                               "flex items-center gap-5 p-5 rounded-2xl border-2 cursor-pointer transition-all",
                               watchFields.shippingMethod === method.id 
                                ? 'border-primary bg-primary/5 shadow-md' 
                                : 'border-border bg-muted/30 hover:border-primary/30'
                             )}>
                                 <input type="radio" {...register('shippingMethod')} value={method.id} className="hidden" />
                                 <div className={cn(
                                   "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                                   watchFields.shippingMethod === method.id ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground border border-border'
                                 )}>
                                    {method.icon}
                                 </div>
                                 <div className="flex-1">
                                    <p className="font-bold text-sm text-foreground">{method.title}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">{method.time}</p>
                                 </div>
                                 <div className="text-right">
                                    <p className="font-bold text-sm text-primary">{method.price}</p>
                                 </div>
                             </label>
                           ))}
                        </div>
  
                        <div className="flex justify-between pt-4">
                           <button type="button" onClick={prevStep} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">Back</button>
                           <button type="submit" className="flex items-center gap-2 px-10 py-4 bg-primary text-primary-foreground rounded-xl font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-lg group">
                              Proceed to Payment <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                           </button>
                        </div>
                     </motion.div>
                   )}
  
                   {currentStep === 3 && (
                     <motion.div 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-8"
                     >
                        <div className="space-y-1">
                           <h2 className="text-2xl font-heading font-bold text-foreground">Secure Payment</h2>
                           <p className="text-muted-foreground text-sm">Finalize your artisanal purchase securely.</p>
                        </div>
  
                        <div className="p-8 bg-muted/50 border border-border rounded-2xl space-y-8">
                           <div className="flex flex-col items-center text-center space-y-4">
                              <div className="w-20 h-20 bg-background rounded-2xl flex items-center justify-center shadow-sm border border-border">
                                 <Lock size={32} className="text-primary" />
                              </div>
                              <div className="space-y-1">
                                 <h3 className="text-xl font-heading font-bold text-foreground">Safe & Secure Transaction</h3>
                                 <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold">128-Bit SSL Encryption Active</p>
                              </div>
                           </div>
  
                           <div className="space-y-4 py-6 border-y border-border">
                              <div className="flex justify-between items-center text-sm font-medium">
                                 <span className="text-muted-foreground">Order Total</span>
                                 <span className="text-2xl font-bold text-foreground font-heading">₹{(totalPayable || 0).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-green-600">
                                 <span className="flex items-center gap-1.5"><ShieldCheck size={12} /> Verified Merchant</span>
                                 <span>PCI-DSS Compliant</span>
                              </div>
                           </div>
                        </div>
  
                        <div className="flex justify-between pt-4 gap-4">
                           <button type="button" onClick={prevStep} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">Back</button>
                           <button 
                             type="submit" 
                             disabled={isProcessing}
                             className={cn(
                               "flex-1 flex items-center justify-center gap-3 px-12 py-4 bg-primary text-primary-foreground rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-xl",
                               isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110 active:scale-[0.98]'
                             )}
                           >
                              {isProcessing ? 'Processing Transaction...' : `Confirm & Pay ₹${(totalPayable || 0).toLocaleString()}`} <ChevronRight size={16} />
                           </button>
                        </div>
                     </motion.div>
                   )}
  
                   {currentStep === 4 && (
                     <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      className="text-center py-12"
                     >
                        <div className="w-24 h-24 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-8">
                           <Check size={48} strokeWidth={3} />
                        </div>
                        <h2 className="text-4xl font-heading font-bold text-foreground mb-3 uppercase tracking-tight">Order Confirmed</h2>
                        <p className="text-muted-foreground text-sm mb-10 max-w-sm mx-auto leading-relaxed">
                           Thank you for choosing BadriBhai Apparels. Your order <span className="font-bold text-foreground">#{placedOrderId || 'SUCCESS'}</span> is being prepared for dispatch.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                           <Link to="/profile/orders" className="px-10 py-4 bg-primary text-primary-foreground rounded-xl font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-lg">
                              Track Shipment
                           </Link>
                           <Link to="/" className="px-10 py-4 border-2 border-border text-foreground rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-muted transition-all">
                              Continue Exploring
                           </Link>
                        </div>
                     </motion.div>
                   )}
                </form>
              </AnimatePresence>
           </div>
        </div>
  
        {/* Right: Order Summary Sidebar (Sticky) */}
        {currentStep !== 4 && (
          <div className="lg:col-span-4">
             <div className="sticky top-28 space-y-6">
                <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                   <h3 className="text-xl font-heading font-bold text-foreground mb-8 flex items-center gap-3">
                      <ShoppingBag size={20} className="text-primary" />
                      Bag Summary
                   </h3>
  
                  <div className="space-y-6 mb-8 max-h-[35vh] overflow-y-auto no-scrollbar pr-2">
                     {items.map((item) => (
                       <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                          <div className="w-16 h-20 bg-muted rounded-xl overflow-hidden shrink-0 border border-border">
                             <img src={item.image || (item.images && item.images[0]?.url)} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 py-1">
                             <h4 className="text-xs font-bold text-foreground line-clamp-1">{item.name}</h4>
                             <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-medium">Size: {item.size} • Qty: {item.quantity}</p>
                             <p className="text-xs font-bold text-primary mt-2">₹{(item.price || 0).toLocaleString()}</p>
                          </div>
                       </div>
                     ))}
                  </div>
  
                   <div className="space-y-4 pt-8 border-t border-border">
                      <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                         <span>Subtotal</span>
                         <span className="text-foreground">₹{(subtotalValue || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                         <span>Shipping Cost</span>
                         <span className={cn(
                           "font-bold",
                           watchFields.shippingMethod === 'Express' ? "text-primary" : "text-green-600"
                         )}>{watchFields.shippingMethod === 'Express' ? '₹499' : 'Complimentary'}</span>
                      </div>
                      <div className="pt-2">
                        <div className="flex justify-between items-end">
                           <div className="space-y-1">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Payable</p>
                              <p className="text-3xl font-heading font-bold text-foreground">
                                 ₹{(totalPayable || 0).toLocaleString()}
                              </p>
                           </div>
                        </div>
                      </div>
                   </div>
                </div>
  
                {/* Assurance Badge */}
                <div className="p-5 bg-primary/5 border border-primary/10 rounded-2xl flex items-center gap-4">
                   <ShieldCheck className="text-primary shrink-0" size={28} />
                   <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-foreground">Purchase Protection</p>
                      <p className="text-[9px] text-muted-foreground leading-relaxed mt-1">Your purchase is fully covered. We use industry-standard encryption for all transactions.</p>
                   </div>
                </div>
             </div>
          </div>
        )}
  
      </div>
    </div>
  );
};

export default Checkout;
