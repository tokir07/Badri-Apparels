import React from 'react';
import logoImg from '../../assets/image.png';

const BrandLogo = ({ className = "w-10 h-10", color = "currentColor", showImage = true }) => {
  if (showImage) {
    return (
      <img 
        src={logoImg} 
        alt="Badri Apparel Logo" 
        className={`${className} object-contain`}
      />
    );
  }

  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* High-Fidelity Styled 'B' Silhouette (Fallback) */}
      <path 
        d="M25 15H50C65 15 75 25 75 35C75 42 70 48 62 52C72 55 80 62 80 72C80 85 70 95 55 95H25V15Z" 
        fill={color} 
        fillOpacity="0.1"
      />
      <path 
        d="M25 15V95M25 15H50C65 15 75 25 75 35C75 42 70 48 62 52M25 95H55C70 95 80 85 80 72C80 62 72 55 62 52M62 52H25" 
        stroke={color} 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BrandLogo;
