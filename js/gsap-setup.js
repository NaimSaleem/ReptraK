/* global gsap */

function animateScreenIn(screenId) {
  const screen = document.getElementById(`screen-${screenId}`);
  if (!screen || typeof gsap === 'undefined') return;

  const animatedItems = screen.querySelectorAll(
    '.glass-card, .glass-btn, .hero-orb, .topbar, .bottom-nav, .activity-row, .price-pill, .view-pill, .liquid-button'
  );

  gsap.fromTo(
    animatedItems,
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
}

window.animateScreenIn = animateScreenIn;
