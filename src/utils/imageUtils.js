/**
 * Cloudinary image optimization utility
 * Auto-serves optimized format and quality
 */
export const getOptimizedImageUrl = (url, width = 400) => {
  if (!url) return '';
  
  // If not a cloudinary URL, return as is
  if (!url.includes('cloudinary.com')) return url;

  // Replace /upload/ with transformation parameters
  // w_{width}: width
  // q_auto: automatic quality
  // f_auto: automatic format (WebP/AVIF if supported)
  // c_fill: fill the dimensions
  return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto,c_fill/`);
};
