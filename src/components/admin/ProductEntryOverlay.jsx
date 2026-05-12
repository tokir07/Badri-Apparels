import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  X, Save, Sparkles, Info
} from 'lucide-react';
import { toast } from 'sonner';

import { productService } from '../../services/productService';

// Sub-components
import CoreIdentity from './product-entry/CoreIdentity';
import ProtocolToggles from './product-entry/ProtocolToggles';
import PricingMatrix from './product-entry/PricingMatrix';
import VariantArchitecture from './product-entry/VariantArchitecture';
import MediaGallery from './product-entry/MediaGallery';
import LivePrototype from './product-entry/LivePrototype';

const ProductEntryOverlay = ({ isOpen, onClose, onAdd, productData = null }) => {
  const [mounted, setMounted] = useState(false);
  const [images, setImages] = useState([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    setMounted(true);
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm({
    defaultValues: productData || {
      name: '',
      brand: 'BADRIBHAI',
      categoryId: '',
      type: 'Kurti',
      collection: 'BlockPrint',
      fabric: 'OrganicCotton',
      printType: 'HandBlock',
      occasion: 'Daily',
      mrp: '',
      sellingPrice: '',
      description: '',
      hasVariants: true,
      variants: [
        { size: 'M', color: 'Royal Maroon', colorHex: '#800000', mrp: 2499, price: 1999, stock: 10, active: true }
      ],
      features: { isNewArrival: true, isArtisanPick: false, isLimited: false, isSustainable: false }
    }
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: "variants"
  });

  const watchFields = watch();
  const discount = (watchFields.mrp && watchFields.sellingPrice) 
    ? Math.round(((watchFields.mrp - watchFields.sellingPrice) / watchFields.mrp) * 100) 
    : 0;

  const onSubmit = (data) => {
    if (onAdd) onAdd(data, images);
    onClose();
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-12 overflow-hidden bg-black/60 backdrop-blur-md"
        data-lenis-prevent
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-background/40 backdrop-blur-3xl"
          onClick={onClose}
        />

        <motion.div 
          initial={{ y: 20, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.98 }}
          className="relative w-full h-full max-h-[90vh] max-w-7xl bg-white rounded-[3rem] border border-accent-gold/20 shadow-2xl overflow-hidden flex flex-col"
        >
          {/* PREMIUM ARTISANAL HEADER */}
          <div className="h-24 px-12 flex items-center justify-between border-b border-accent-gold/10 bg-background/50 shrink-0">
             <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center rotate-12 shadow-lg shadow-primary/20">
                   <Sparkles size={20} className="text-white -rotate-12" />
                </div>
                <div>
                   <h2 className="text-2xl font-heading font-bold tracking-tighter text-text-primary">Heritage <span className="italic font-light text-accent-maroon">Curation Portal</span></h2>
                   <p className="text-[10px] text-text-secondary/60 font-bold uppercase tracking-[0.2em]">Registering a New Artisanal Masterpiece</p>
                </div>
             </div>
             
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 px-4 py-2 bg-accent-gold/5 rounded-xl border border-accent-gold/10">
                   <div className="w-2 h-2 bg-accent-gold rounded-full animate-pulse" />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-accent-gold">Artisanal Sync Active</span>
                </div>
                <button onClick={onClose} className="p-4 bg-muted hover:bg-accent-maroon/5 rounded-2xl text-text-secondary hover:text-accent-maroon transition-all group">
                   <X size={20} className="group-hover:rotate-90 transition-transform" />
                </button>
             </div>
          </div>

          {/* MAIN GRID - ARTISANAL SECTIONS */}
          <div className="flex-1 p-10 grid grid-cols-12 gap-8 overflow-y-auto custom-scrollbar" data-lenis-prevent>
             
             {/* LEFT COLUMN: IDENTITY & TOGGLES (4/12) */}
             <div className="col-span-4 space-y-8">
                <CoreIdentity register={register} watchFields={watchFields} setValue={setValue} categories={categories} />
                <ProtocolToggles watchFields={watchFields} setValue={setValue} />
             </div>

             {/* RIGHT COLUMN: PRICING, VARIANTS, MEDIA (8/12) */}
             <div className="col-span-8 space-y-8 flex flex-col">
                <PricingMatrix register={register} watchFields={watchFields} discount={discount} />
                <VariantArchitecture fields={variantFields} append={appendVariant} remove={removeVariant} register={register} watchFields={watchFields} setValue={setValue} />
                
                <div className="grid grid-cols-2 gap-8">
                   <MediaGallery 
                      images={images} 
                      setImages={setImages} 
                      productId={productData?.id}
                    />
                   <LivePrototype watchFields={watchFields} discount={discount} />
                </div>
             </div>
          </div>

          {/* PREMIUM ARTISANAL FOOTER */}
          <div className="h-28 px-12 border-t border-accent-gold/10 flex items-center justify-between bg-background/50 shrink-0">
             <div className="flex items-center gap-8">
                <div className="p-4 bg-accent-gold/10 rounded-2xl text-accent-gold">
                   <Info size={20} />
                </div>
                <div className="max-w-md">
                   <p className="text-[10px] text-text-secondary italic leading-relaxed">This masterpiece will be archived in the Badri collection, automatically synchronizing inventory and preserving its artisanal narrative across our global heritage network.</p>
                </div>
             </div>
             
             <div className="flex items-center gap-6">
                <button onClick={onClose} className="px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:text-text-primary hover:bg-black/5 transition-all">Cancel Registration</button>
                <button 
                  onClick={handleSubmit(onSubmit)}
                  className="bg-primary text-white px-14 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent-maroon transition-all shadow-xl flex items-center gap-4 group"
                >
                  Archive Masterpiece <Save size={18} className="group-hover:scale-110 transition-transform" />
                </button>
             </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default ProductEntryOverlay;
