import React from 'react';
import ImageUploader from '../ImageUploader';

const MediaGallery = ({ images, setImages, productId }) => {
  const handleUploadSuccess = (imageData) => {
    setImages(prev => [...prev, {
      id: imageData.publicId,
      url: imageData.secureUrl,
      publicId: imageData.publicId,
      isMain: prev.length === 0
    }]);
  };

  const handleDelete = (publicId) => {
    setImages(prev => prev.filter(img => img.publicId !== publicId));
  };

  return (
    <div className="p-8 bg-white border border-accent-gold/10 rounded-[2.5rem]">
      <ImageUploader 
        productId={productId}
        existingImages={images}
        onUploadSuccess={handleUploadSuccess}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default MediaGallery;
