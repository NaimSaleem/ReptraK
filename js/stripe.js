/* global user, saveUser, updateDashboard */

function subscribe() {
  user.premium = true;
  saveUser();

  if (typeof updateDashboard === 'function') {
    updateDashboard();
  }

  alert(
    'Premium is now active in the prototype.\n\n' +
    'Unlocked here:\n' +
    '1. Weekly compare-and-contrast positioning.\n' +
    '2. More detailed progress language and analytics framing.\n' +
    '3. Pricing flow that matches your $2.99 intro / $5.99 monthly model.\n\n' +
    'Next real build step: connect Stripe Checkout or RevenueCat.'
  );
}

window.subscribe = subscribe;
