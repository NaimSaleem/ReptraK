/* global user, saveUser, updateDashboard, logPractice, subscribe */

function isOnboarded() {
  return Boolean(user.name && user.habit && user.frequency);
}

function updateLandingState() {
  const loginButton = document.getElementById('btn-login');
  const signupButton = document.getElementById('btn-signup');

  if (!loginButton || !signupButton) return;

  if (isOnboarded()) {
    loginButton.textContent = 'Dashboard';
    signupButton.textContent = 'Continue';
  } else {
    loginButton.textContent = 'Log in';
    signupButton.textContent = 'Start Tracking';
  }
}

function setActiveNav(screenId) {
  document.querySelectorAll('.nav-pill').forEach((pill) => {
    pill.classList.toggle('is-active', pill.dataset.target === screenId);
  });
}

function nextScreen(screenId) {
  document.querySelectorAll('.screen').forEach((screen) => {
    screen.classList.toggle('active', screen.id === `screen-${screenId}`);
  });
  setActiveNav(screenId);

  if (typeof window.animateScreenIn === 'function') {
    window.animateScreenIn(screenId);
  }
}

function saveName() {
  const nameInput = document.getElementById('name-input');
  const value = nameInput.value.trim();
  if (value) {
    user.name = value;
    saveUser();
  }
  updateLandingState();
  updateDashboard();
  nextScreen('habit');
}

function saveHabit() {
  const habitInput = document.getElementById('habit-input');
  const selectedChip = document.querySelector('[data-habit-choice].is-selected');
  const value = habitInput.value.trim() || (selectedChip ? selectedChip.dataset.habitChoice : '');

  if (value) {
    user.habit = value;
    if (Array.isArray(user.activities) && user.activities[0]) {
      user.activities[0].name = value;
    }
    saveUser();
  }
  updateLandingState();
  updateDashboard();
  nextScreen('frequency');
}

function saveFrequency() {
  const frequencyInput = document.getElementById('frequency-input');
  const value = parseInt(frequencyInput.value, 10);

  if (value) {
    user.frequency = value;
    if (Array.isArray(user.activities) && user.activities[0]) {
      user.activities[0].targetCount = value;
    }
    saveUser();
  }
  updateLandingState();
  updateDashboard();
  nextScreen('dashboard');
}

function bindTargetButtons() {
  document.querySelectorAll('[data-target]').forEach((button) => {
    button.addEventListener('click', () => nextScreen(button.dataset.target));
  });
}

function bindHabitChoices() {
  const chips = document.querySelectorAll('[data-habit-choice]');
  const input = document.getElementById('habit-input');

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((item) => item.classList.remove('is-selected'));
      chip.classList.add('is-selected');
      input.value = chip.dataset.habitChoice;
    });
  });

  input.addEventListener('input', () => {
    chips.forEach((chip) => chip.classList.remove('is-selected'));
  });
}

function bindFrequencyChoices() {
  const pills = document.querySelectorAll('[data-frequency]');
  const input = document.getElementById('frequency-input');

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((item) => item.classList.remove('is-selected'));
      pill.classList.add('is-selected');
      input.value = pill.dataset.frequency;
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('name-input').value = user.name;
  document.getElementById('habit-input').value = user.habit;
  document.getElementById('frequency-input').value = user.frequency;

  bindTargetButtons();
  bindHabitChoices();
  bindFrequencyChoices();

  document.getElementById('btn-signup').addEventListener('click', () => {
    nextScreen(isOnboarded() ? 'dashboard' : 'account');
  });

  document.getElementById('btn-login').addEventListener('click', () => {
    nextScreen(isOnboarded() ? 'dashboard' : 'account');
  });
  document.getElementById('btn-save-name').addEventListener('click', saveName);
  document.getElementById('btn-save-habit').addEventListener('click', saveHabit);
  document.getElementById('btn-save-frequency').addEventListener('click', saveFrequency);
  document.getElementById('btn-log-practice').addEventListener('click', logPractice);
  document.getElementById('btn-subscribe').addEventListener('click', subscribe);

  updateLandingState();
  updateDashboard();
  nextScreen('landing');
});
