import { useEffect } from 'react';
import { gsap } from 'gsap';

export function useScreenAnimations(activeScreen) {
  useEffect(() => {
    const screen = document.querySelector(`[data-screen="${activeScreen}"]`);
    if (!screen) return;

    const items = screen.querySelectorAll(
      '.glass-card, .glass-btn, .hero-orb, .topbar, .bottom-nav, .activity-row, .price-pill, .view-pill, .liquid-button'
    );

    gsap.fromTo(
      items,
      { y: 18, opacity: 0, filter: 'blur(6px)' },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.7,
        stagger: 0.04,
        ease: 'power2.out',
        overwrite: 'auto'
      }
    );
  }, [activeScreen]);
}
