/* global gsap */

const container = document.getElementById('particles');
const iconFamilies = [
  'futbol',
  'basketball',
  'volleyball',
  'music',
  'headphones',
  'person-dancing',
  'book',
  'guitar',
  'microphone',
  'leaf',
  'palette',
  'paintbrush',
  'brain',
  'person-running'
];

function createParticle() {
  if (!container) return;

  const particle = document.createElement('div');
  const icon = iconFamilies[Math.floor(Math.random() * iconFamilies.length)];
  const startX = Math.random() * container.offsetWidth;
  const drift = (Math.random() * 120) - 60;
  const duration = 11 + Math.random() * 10;
  const size = 18 + Math.random() * 28;
  const sway = 16 + Math.random() * 24;

  particle.className = 'particle';
  particle.innerHTML = `<i class="fa-solid fa-${icon}"></i>`;
  particle.style.left = `${startX}px`;
  particle.style.bottom = `${-40 - Math.random() * 40}px`;
  particle.style.fontSize = `${size}px`;
  particle.style.opacity = `${0.08 + Math.random() * 0.14}`;

  container.appendChild(particle);

  gsap.timeline({
    defaults: { ease: 'none' },
    onComplete: () => particle.remove()
  })
    .to(
      particle,
      {
        y: -container.offsetHeight - 180,
        duration
      },
      0
    )
    .to(
      particle,
      {
        x: drift,
        duration
      },
      0
    )
    .to(
      particle,
      {
        keyframes: [
          { x: `+=${sway}`, duration: duration * 0.28, ease: 'sine.inOut' },
          { x: `-=${sway * 1.8}`, duration: duration * 0.32, ease: 'sine.inOut' },
          { x: `+=${sway * 1.35}`, duration: duration * 0.4, ease: 'sine.inOut' }
        ]
      },
      0
    )
    .to(
      particle,
      {
        rotation: Math.random() * 110 - 55,
        scale: 0.72 + Math.random() * 0.48,
        opacity: 0,
        duration
      },
      0
    );
}

document.addEventListener('DOMContentLoaded', () => {
  for (let index = 0; index < 10; index += 1) {
    setTimeout(createParticle, index * 240);
  }

  setInterval(createParticle, 1400);
});
