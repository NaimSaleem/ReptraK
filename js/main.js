/* global gsap */

// ====================== STRIPE KEY (PUT YOUR TEST KEY HERE) ======================
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51STndZGjQOBos6x5RRIOm74zITj5FF5fNhaRdDMn4l4IFgmLNyYqJDcwqT4QYYN7kiciFU1nOYU4LOBYg7Du8ZND00QxTOvv7r';   // ←←← PASTE YOUR pk_test_ KEY HERE

// ====================== FLOATING ICONS (always running) ======================
const sports = ['futbol','basketball','volleyball','baseball-ball','table-tennis-paddle-ball','hockey-puck','dumbbell','person-running','person-biking','bowling-ball'];
const hobbies = ['music','headphones','person-dancing','book','book-open','pen-nib','palette','paintbrush','yin-yang','spa','leaf','seedling','guitar','microphone','camera','feather','brain'];

const container = document.getElementById('particles');

function createParticle() {
  const p = document.createElement('div');
  p.className = 'particle';
  const isSport = Math.random() < 0.5;
  const list = isSport ? sports : hobbies;
  p.innerHTML = `<i class="fa-solid fa-${list[Math.floor(Math.random() * list.length)]}"></i>`;

  const size = 35 + Math.random() * 52;
  p.style.fontSize = `${size}px`;
  p.style.left = `${Math.random() * 100}%`;
  p.style.bottom = `-${40 + Math.random() * 60}px`;

  container.appendChild(p);
  gsap.to(p, { y: -window.innerHeight * 1.3, duration: 7 + Math.random() * 6, ease: "none", onComplete: () => p.remove() });
}

for (let i = 0; i < 8; i++) setTimeout(createParticle, i * 300);
setInterval(() => createParticle(), 1600);

// ====================== REAL APP LOGIC ======================
let user = {
  name: localStorage.getItem('name') || '',
  habit: localStorage.getItem('habit') || 'Guitar',
  frequency: parseInt(localStorage.getItem('frequency')) || 5,
  count: parseInt(localStorage.getItem('count')) || 0
};

function saveUser() {
  localStorage.setItem('name', user.name);
  localStorage.setItem('habit', user.habit);
  localStorage.setItem('frequency', user.frequency);
  localStorage.setItem('count', user.count);
}

function nextScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + screenId).classList.add('active');
}

function saveName() { user.name = document.getElementById('name-input').value || 'User'; saveUser(); nextScreen('habit'); }
function saveHabit() { user.habit = document.getElementById('habit-input').value || 'Guitar'; saveUser(); nextScreen('frequency'); }
function saveFrequency() { 
  user.frequency = parseInt(document.getElementById('frequency-input').value) || 5; 
  saveUser(); 
  nextScreen('dashboard'); 
  updateDashboard(); 
}

function updateDashboard() {
  document.getElementById('welcome').textContent = `Welcome back, ${user.name}!`;
  document.getElementById('count').textContent = user.count;
}

function logPractice() {
  user.count++;
  saveUser();
  updateDashboard();
}

function subscribe() {
  if (!STRIPE_PUBLISHABLE_KEY.startsWith('pk_test_')) {
    alert("⚠️ Use your TEST key (pk_test_) not live key!");
    return;
  }
  alert(`✅ Stripe loaded with key: ${STRIPE_PUBLISHABLE_KEY.slice(0,15)}... \n\nReal Checkout coming in Batch 3`);
}

// ====================== BUTTONS ======================
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-signup').addEventListener('click', () => nextScreen('account'));
  document.getElementById('btn-login').addEventListener('click', () => nextScreen('account'));
  document.getElementById('btn-save-name').addEventListener('click', saveName);
  document.getElementById('btn-save-habit').addEventListener('click', saveHabit);
  document.getElementById('btn-save-frequency').addEventListener('click', saveFrequency);
  document.getElementById('btn-log-practice').addEventListener('click', logPractice);
  document.getElementById('btn-subscribe').addEventListener('click', subscribe);

  nextScreen('landing');
  updateDashboard();
});