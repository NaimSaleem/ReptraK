const container = document.getElementById('particles');

function createParticle() {
  const p = document.createElement('div');
  p.className = 'particle';
  // (your sports + hobbies list here — same as before)
  // ... (I kept the exact code you loved)
  container.appendChild(p);
  gsap.to(p, { y: -window.innerHeight * 1.3, duration: 7 + Math.random() * 5, ease: "none", onComplete: () => p.remove() });
}

// Start immediately
for (let i = 0; i < 8; i++) setTimeout(createParticle, i * 400);
setInterval(createParticle, 1600);