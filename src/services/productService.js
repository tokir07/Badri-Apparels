import api from './axios';

export const productService = {
  getAllProducts: async (params = {}) => {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null && v !== '')
      );
      const response = await api.get('/products', { params: cleanParams });
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to fetch products' };
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to fetch product' };
    }
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
      
      if (imageFiles.length > 0 && typeof imageFiles[0] === 'object' && imageFiles[0].publicId) {
        transformedData.images = imageFiles.map(img => ({
          url: img.url || img.secureUrl,
          publicId: img.publicId,
          isMain: img.isMain || false
        }));
      }

      const productBlob = new Blob([JSON.stringify(transformedData)], { type: 'application/json' });
      formData.append('product', productBlob);
      
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
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to create product' };
    }
  },

  updateProduct: async (id, productData) => {
    try {
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
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update product' };
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete product' };
    }
  },

  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to fetch categories' };
    }
  },

  // Variant Management
  addVariant: async (productId, data) => {
    try {
      const response = await api.post(`/products/admin/${productId}/variants`, data);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to add variant' };
    }
  },

  updateVariant: async (productId, variantId, data) => {
    try {
      const response = await api.put(`/products/admin/${productId}/variants/${variantId}`, data);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update variant' };
    }
  },

  deleteVariant: async (productId, variantId) => {
    try {
      const response = await api.delete(`/products/admin/${productId}/variants/${variantId}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete variant' };
    }
  },
  
  // Inventory Management
  getLowStockVariants: async () => {
    try {
      const response = await api.get('/products/admin/inventory/low-stock');
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to fetch low stock variants' };
    }
  },

  bulkUpdateStock: async (items) => {
    try {
      const response = await api.post('/products/admin/inventory/bulk-stock-update', items);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update stock' };
    }
  }
};
