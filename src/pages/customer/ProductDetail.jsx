import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Truck, ShieldCheck, RefreshCw, Plus, Minus, ShoppingBag, Heart } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { productService } from '../../services/productService';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Pagination, Navigation, Autoplay, EffectFade } from 'swiper/modules';
import ReviewSection from '../../components/ecommerce/ReviewSection';
import SizeGuide from '../../components/ecommerce/SizeGuide';
import { cn } from '../../lib/utils';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const isWishlisted = isInWishlist(id);

  const availableSizes = product?.variants 
    ? [...new Set(product.variants.filter(v => v.active).map(v => v.size))]
    : product?.sizes || [];

  const availableColors = product?.variants
    ? product.variants
        .filter(v => v.active && (!selectedSize || v.size === selectedSize))
        .map(v => ({ name: v.color, hex: v.colorHex, id: v.id }))
    : [];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getProductById(id);
        if (response.success) {
          const prod = response.data;
          setProduct(prod);
          
          if (prod.variants && prod.variants.length > 0) {
            const firstActive = prod.variants.find(v => v.active && v.stock > 0) || prod.variants[0];
            setSelectedSize(firstActive.size);
            setSelectedColor(firstActive.color);
            setSelectedVariant(firstActive);
          } else if (prod.sizes && prod.sizes.length > 0) {
            setSelectedSize(prod.sizes[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Product not found");
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  useEffect(() => {
    if (product?.variants && selectedSize && selectedColor) {
      const variant = product.variants.find(v => v.size === selectedSize && v.color === selectedColor);
      setSelectedVariant(variant || null);
    }
  }, [selectedSize, selectedColor, product]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.hasVariants && !selectedVariant) {
      toast.error("Please select a valid size and color");
      return;
    }

    addItem({ 
      ...product, 
      variantId: selectedVariant?.id,
      price: selectedVariant ? selectedVariant.price : (product.discountPrice || product.price),
      quantity,
      size: selectedSize,
      color: selectedColor
    }, isAuthenticated);
    toast.success("Added to cart");
  };

  const handleWishlist = () => {
    if (!product) return;
    toggleWishlist({ ...product, name: product.title });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-sm font-medium text-muted-foreground italic">Fetching masterpiece...</p>
      </div>
    </div>
  );

  if (!product) return null;

  const images = product.images && product.images.length > 0 
    ? product.images.map(img => img.url) 
    : ['https://placehold.co/600x800?text=No+Image'];

  return (
    <div className="pt-24 pb-20 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Image Gallery (Left) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative rounded-2xl overflow-hidden bg-muted aspect-[3/4] lg:h-[75vh] sticky top-28 border border-border"
          >
            <Swiper
              modules={[Pagination, Navigation, Autoplay, EffectFade]}
              effect="fade"
              pagination={{ clickable: true, dynamicBullets: true }}
              navigation
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              className="w-full h-full"
            >
              {images.map((src, idx) => (
                <SwiperSlide key={idx}>
                  <div className="w-full h-full flex items-center justify-center">
                    <img src={src} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
  
          {/* Product Info (Right) */}
          <div className="flex flex-col py-4 lg:py-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 bg-primary/10 text-primary rounded">Artisanal Heritage</span>
                  <div className="flex items-center gap-1 text-foreground text-xs font-bold">
                    <Star size={14} className="fill-accent text-accent" />
                    <span>{product.rating || '4.9'}</span>
                  </div>
                </div>
                
                <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground leading-tight">
                  {product.title}
                </h1>
                <div className="flex items-baseline gap-4">
                   <p className="text-2xl font-bold text-foreground">
                     ₹{(selectedVariant ? selectedVariant.price : (product.discountPrice || product.price || 0)).toLocaleString()}
                   </p>
                   {(product.discountPrice || (selectedVariant && selectedVariant.mrp > selectedVariant.price)) && (
                     <p className="text-lg text-muted-foreground line-through decoration-primary/30 decoration-2">
                       ₹{(selectedVariant ? selectedVariant.mrp : product.price || 0).toLocaleString()}
                     </p>
                   )}
                   {selectedVariant && selectedVariant.stock === 0 && (
                     <span className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-bold uppercase rounded">Out of Stock</span>
                   )}
                   {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 3 && (
                     <span className="text-amber-600 text-[10px] font-bold animate-pulse">Only {selectedVariant.stock} left!</span>
                   )}
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {product.description || "A timeless masterpiece blending traditional Jaipuri craftsmanship with modern contemporary silhouettes."}
                </p>
              </div>
  
              {/* Size Selector */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Select Size</h3>
                  <button 
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[10px] font-bold text-muted-foreground underline underline-offset-4 hover:text-primary transition-all uppercase tracking-tighter"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "w-12 h-12 rounded-xl border-2 flex items-center justify-center text-xs font-bold transition-all",
                        selectedSize === size 
                          ? 'border-primary bg-primary text-primary-foreground shadow-md scale-105' 
                          : 'border-border text-muted-foreground hover:border-primary/50'
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              {availableColors.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Select Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {availableColors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color.name)}
                        className={cn(
                          "group relative flex items-center justify-center p-1 rounded-full border-2 transition-all",
                          selectedColor === color.name ? "border-primary scale-110" : "border-transparent hover:border-border"
                        )}
                        title={color.name}
                      >
                        <div 
                          className="w-8 h-8 rounded-full border border-black/10 shadow-inner"
                          style={{ backgroundColor: color.hex || '#ccc' }}
                        />
                        {selectedColor === color.name && (
                           <motion.div layoutId="color-active" className="absolute -inset-1 rounded-full border-2 border-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
  
              {/* Quantity and Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center justify-between border-2 border-border rounded-xl px-4 py-3 w-full sm:w-36 bg-background shadow-sm">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-muted-foreground hover:text-primary transition-all"><Minus size={18} /></button>
                  <span className="font-bold text-sm w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="text-muted-foreground hover:text-primary transition-all"><Plus size={18} /></button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  disabled={selectedVariant && selectedVariant.stock === 0}
                  className={cn(
                    "flex-1 flex items-center justify-center px-10 py-4 font-bold text-xs uppercase tracking-widest active:scale-[0.98] transition-all rounded-xl shadow-lg gap-3",
                    selectedVariant && selectedVariant.stock === 0
                      ? "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
                      : "bg-primary text-primary-foreground hover:brightness-110 shadow-lg"
                  )}
                >
                  <ShoppingBag size={18} /> 
                  {selectedVariant && selectedVariant.stock === 0 ? "Sold Out" : "Add to Bag"}
                </button>
  
                <button 
                  onClick={handleWishlist}
                  className={cn(
                    "flex items-center justify-center w-14 h-14 rounded-xl border-2 transition-all shadow-sm",
                    isWishlisted 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-border bg-background text-muted-foreground hover:border-primary hover:text-primary'
                  )}
                >
                  <Heart size={20} className={isWishlisted ? 'fill-primary' : ''} />
                </button>
              </div>

              {/* USP Section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-y border-border">
                {[
                  { icon: Truck, label: 'Swift Delivery', sub: '2-4 business days' },
                  { icon: RefreshCw, label: 'Easy Exchange', sub: '7-day policy' },
                  { icon: ShieldCheck, label: 'Secure Payment', sub: '100% protected' }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-foreground">{item.label}</p>
                      <p className="text-[9px] text-muted-foreground">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Specifications</h3>
                <div className="grid grid-cols-2 gap-y-4 text-[11px]">
                  <div>
                     <p className="text-muted-foreground uppercase tracking-tighter">Fabric</p>
                     <p className="font-bold text-foreground">{product.fabric || 'Pure Cotton'}</p>
                  </div>
                  <div>
                     <p className="text-muted-foreground uppercase tracking-tighter">Print Type</p>
                     <p className="font-bold text-foreground">{product.printType || 'Handblock Print'}</p>
                  </div>
                  <div>
                     <p className="text-muted-foreground uppercase tracking-tighter">Style</p>
                     <p className="font-bold text-foreground">{product.category?.name || 'Ethnic Wear'}</p>
                  </div>
                  <div>
                     <p className="text-muted-foreground uppercase tracking-tighter">Collection</p>
                     <p className="font-bold text-foreground">Jaipur Heritage 2024</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
        </div>

        {/* REVIEWS SECTION */}
        <ReviewSection productId={id} />
      </div>

      <SizeGuide 
        isOpen={isSizeGuideOpen} 
        onClose={() => setIsSizeGuideOpen(false)} 
        category={product?.category?.name}
      />
    </div>
  );
};

export default ProductDetail;
