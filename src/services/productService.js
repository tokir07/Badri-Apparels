import api from './axios';

export const productService = {
  getAllProducts: async (params = {}) => {
    // Remove undefined/null params
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v != null && v !== '')
    );
    const response = await api.get('/products', { params: cleanParams });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData, imageFiles = []) => {
    try {
      const transformedData = {
        title: productData.name,
        price: parseFloat(productData.mrp) || 0,
        discountPrice: parseFloat(productData.sellingPrice) || 0,
        description: productData.description,
        brand: productData.brand || 'BADRIBHAI',
        type: productData.type,
        collection: productData.collection,
        fabric: productData.fabric,
        printType: productData.printType,
        occasion: productData.occasion,
        featured: productData.features?.isArtisanPick || false,
        trending: productData.features?.isNewArrival || false,
        categoryId: productData.categoryId ? parseInt(productData.categoryId) : null,
        sizes: [...new Set(productData.variants?.flatMap(v => v.sizes?.filter(s => s.enabled).map(s => s.size)) || [])],
        colors: [...new Set(productData.variants?.map(v => v.colorName) || [])],
        stock: productData.variants?.reduce((acc, v) => acc + (v.sizes?.reduce((sAcc, s) => sAcc + (s.enabled ? parseInt(s.quantity) || 0 : 0), 0) || 0), 0) || 0
      };

      const formData = new FormData();
      
      // If images are already uploaded objects from Cloudinary, put them in the productData
      if (imageFiles.length > 0 && typeof imageFiles[0] === 'object' && imageFiles[0].publicId) {
        transformedData.images = imageFiles.map(img => ({
          url: img.url || img.secureUrl,
          publicId: img.publicId,
          isMain: img.isMain || false
        }));
      }

      const productBlob = new Blob([JSON.stringify(transformedData)], { type: 'application/json' });
      formData.append('product', productBlob);
      
      // Legacy support: if they are actual File objects, append as 'images'
      if (imageFiles && imageFiles.length > 0 && imageFiles[0] instanceof File) {
        imageFiles.forEach(file => {
          formData.append('images', file);
        });
      }

      const response = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error("API Error in createProduct:", error.response?.data || error.message);
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    const transformedData = {
      ...productData,
      title: productData.name,
      price: parseFloat(productData.mrp),
      discountPrice: parseFloat(productData.sellingPrice),
      featured: productData.features?.isFeatured || false,
      trending: productData.features?.isTrending || false,
      sizes: [...new Set(productData.variants.flatMap(v => v.sizes.filter(s => s.enabled).map(s => s.size)))],
      colors: [...new Set(productData.variants.map(v => v.colorName))],
      images: productData.images || [],
      stock: productData.variants.reduce((acc, v) => acc + v.sizes.reduce((sAcc, s) => sAcc + (s.enabled ? parseInt(s.quantity) || 0 : 0), 0), 0)
    };
    const response = await api.put(`/products/${id}`, transformedData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Variant Management
  addVariant: (productId, data) => api.post(`/products/admin/${productId}/variants`, data),
  updateVariant: (productId, variantId, data) => api.put(`/products/admin/${productId}/variants/${variantId}`, data),
  deleteVariant: (productId, variantId) => api.delete(`/products/admin/${productId}/variants/${variantId}`),
  
  // Inventory Management
  getLowStockVariants: () => api.get('/products/admin/inventory/low-stock'),
  bulkUpdateStock: (items) => api.post('/products/admin/inventory/bulk-stock-update', items)
};
