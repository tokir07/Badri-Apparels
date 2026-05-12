import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GSAPAnimations = {
  reveal: (selector, options = {}) => {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach((el) => {
      gsap.fromTo(el, 
        { 
          y: options.y || 50, 
          opacity: 0 
        }, 
        {
          y: 0,
          opacity: 1,
          duration: options.duration || 1,
          ease: options.ease || 'power3.out',
          stagger: options.stagger || 0,
          scrollTrigger: {
            trigger: el,
            start: options.start || 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );
    });
  },

  parallax: (selector, amount = 100) => {
    gsap.to(selector, {
      y: amount,
      ease: 'none',
      scrollTrigger: {
        trigger: selector,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }
};

export default GSAPAnimations;
