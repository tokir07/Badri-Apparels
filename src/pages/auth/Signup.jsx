import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, User, ArrowRight, ShieldCheck, 
  Check, ArrowLeft, Phone, Calendar, MapPin, Globe,
  Home, Hash, Info, UserCircle, Sparkles
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

const Signup = () => {
  const { signup } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dateOfBirth: '',
    country: 'India',
    state: '',
    city: '',
    pincode: '',
    addressLine: '',
    newsletterSubscribed: true,
    agreeToTerms: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getPasswordStrength = () => {
    const { password } = formData;
    if (password.length === 0) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };
  
  const strength = getPasswordStrength();
  const strengthColor = strength === 0 ? 'bg-muted' : strength <= 25 ? 'bg-red-500' : strength <= 50 ? 'bg-yellow-500' : strength <= 75 ? 'bg-blue-500' : 'bg-green-500';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!formData.agreeToTerms) {
      toast.error('Please agree to the Terms & Conditions');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await signup({
        ...formData,
        role: 'CUSTOMER'
      });

      if (result.success) {
        toast.success('Welcome to BADRIBHAI APPAREL!');
        navigate('/');
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (err) {
      setError('An error occurred during registration.');
      toast.error('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const InputField = ({ label, icon: Icon, name, type = "text", placeholder, required = true, options = null }) => (
    <div className="space-y-1.5 group">
      <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold ml-1">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
          <Icon size={16} strokeWidth={1.5} />
        </div>
        {options ? (
          <select
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            className="w-full pl-11 pr-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm appearance-none"
            required={required}
          >
            <option value="">Select {label}</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : (
          <input 
            type={type} 
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full pl-11 pr-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm text-foreground"
            required={required}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row font-sans">
      
      {/* Left Side: Visual Experience */}
      <div className="hidden lg:flex lg:w-5/12 bg-card relative overflow-hidden">
         <motion.div 
           initial={{ scale: 1.1, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 1.5 }}
           className="absolute inset-0"
         >
            <img src="/images/hero_fashion_model_1778255736176.png" className="w-full h-full object-cover grayscale opacity-40" alt="Brand Experience" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
         </motion.div>

         <div className="relative z-10 p-16 flex flex-col justify-end h-full">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-6"
            >
               <div className="flex items-center gap-2 text-primary">
                  <Sparkles size={24} />
                  <span className="text-xs font-bold uppercase tracking-[0.4em]">Established 2026</span>
               </div>
               <h2 className="text-6xl font-heading font-bold text-foreground leading-none">
                  HANDCRAFTED <br/> <span className="italic font-light text-primary">PERFECTION.</span>
               </h2>
               <p className="text-muted-foreground text-sm font-light max-w-xs leading-relaxed italic">
                  "Join a global community dedicated to the preservation and evolution of Jaipuri artisanal traditions."
               </p>
            </motion.div>
         </div>
      </div>

      {/* Right Side: Form Container */}
      <div className="w-full lg:w-7/12 flex flex-col items-center justify-center p-6 md:p-12 lg:p-20 relative">
        
        <div className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-6 z-20">
           <Link to="/" className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft size={14} /> Home
           </Link>
           {step === 2 && (
             <button onClick={() => setStep(1)} className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-primary hover:text-foreground transition-colors">
                <ArrowLeft size={14} /> Back to Step 1
             </button>
           )}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl space-y-12"
        >
          {/* Header */}
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary">
                <UserCircle size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Client Identity</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tighter">
                {step === 1 ? 'Start Your' : 'Complete Your'} <span className="italic font-light text-primary">Journey.</span>
             </h1>
             <div className="flex items-center gap-2 mt-4">
                <div className={cn("h-1 flex-1 rounded-full transition-all duration-500", step === 1 ? 'bg-primary' : 'bg-muted')} />
                <div className={cn("h-1 flex-1 rounded-full transition-all duration-500", step === 2 ? 'bg-primary' : 'bg-muted')} />
             </div>
          </div>

          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handleSubmit} className="space-y-8">
             <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="First Name" icon={User} name="firstName" placeholder="Badri" />
                        <InputField label="Last Name" icon={User} name="lastName" placeholder="Bhai" />
                     </div>
                     <InputField label="Email Address" icon={Mail} name="email" type="email" placeholder="hello@badriapparels.com" />
                     <InputField label="Phone Number" icon={Phone} name="phoneNumber" placeholder="+91 98765 43210" />
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5 group">
                           <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold ml-1">Password</label>
                           <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-muted-foreground group-focus-within:text-primary transition-colors"><Lock size={16} /></div>
                              <input 
                                type={showPassword ? "text" : "password"} 
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full pl-11 pr-12 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm text-foreground"
                                required
                              />
                              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-4 text-muted-foreground hover:text-primary transition-colors">
                                 {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                           </div>
                           <div className="flex gap-1 h-1 mt-2 px-1">
                              {[...Array(4)].map((_, i) => (
                                <div key={i} className={cn("h-full flex-1 rounded-full", strength > i * 25 ? strengthColor : 'bg-muted')} />
                              ))}
                           </div>
                        </div>
                        <InputField label="Confirm Password" icon={ShieldCheck} name="confirmPassword" type="password" />
                     </div>

                     <button type="submit" className="w-full py-4 bg-primary text-primary-foreground rounded-xl text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-3 shadow-xl">
                        Continue to Details <ArrowRight size={16} />
                     </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Gender" icon={Info} name="gender" options={['Male', 'Female', 'Other', 'Prefer not to say']} />
                        <InputField label="Date of Birth" icon={Calendar} name="dateOfBirth" type="date" />
                     </div>

                     <div className="space-y-5 pt-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Shipping Information</p>
                        <InputField label="Address Line" icon={MapPin} name="addressLine" placeholder="Suite, Street, Landmark" />
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                           <InputField label="City" icon={Home} name="city" placeholder="Jaipur" />
                           <InputField label="State" icon={Globe} name="state" placeholder="Rajasthan" />
                           <InputField label="Pincode" icon={Hash} name="pincode" placeholder="302001" />
                        </div>
                     </div>

                     <div className="space-y-4 pt-4">
                        <label className="flex items-center gap-4 cursor-pointer">
                           <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleInputChange} className="hidden" />
                           <div className={cn("w-5 h-5 rounded-lg border flex items-center justify-center transition-all", formData.agreeToTerms ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-muted border-border')}>
                              <Check size={12} className={cn("text-primary-foreground transition-opacity", formData.agreeToTerms ? 'opacity-100' : 'opacity-0')} />
                           </div>
                           <span className="text-xs text-muted-foreground">I agree to the <span className="text-foreground font-bold underline decoration-primary">Terms & Conditions</span></span>
                        </label>
                     </div>

                     <button 
                       disabled={isLoading}
                       type="submit" 
                       className="w-full py-4 bg-primary text-primary-foreground rounded-xl text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl"
                     >
                        {isLoading ? 'Creating Profile...' : 'Create Account'} <ArrowRight size={16} />
                     </button>
                  </motion.div>
                )}
             </AnimatePresence>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
