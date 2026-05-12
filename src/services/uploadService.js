import api from './axios';

export const uploadService = {
  uploadImage: (file, folder = 'products', productId = null, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    if (productId) {
      formData.append('productId', productId);
    }
    
    return api.post('/admin/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      }
    });
  },

  deleteImage: (publicId) => {
    return api.post('/admin/upload/delete', { publicId });
  }
};
