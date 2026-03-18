export function BottomNav({ current, onNavigate }) {
  const navItems = [
    { id: 'dashboard', icon: 'chart-line', label: 'Dashboard' },
    { id: 'calendar', icon: 'calendar-days', label: 'Calendar' },
    { id: 'profile', icon: 'user', label: 'Profile' },
    { id: 'premium', icon: 'star', label: 'Premium' }
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`bottom-nav__item ${current === item.id ? 'is-active' : ''}`}
          type="button"
          onClick={() => onNavigate(item.id)}
          aria-label={item.label}
        >
          <i className={`fa-solid fa-${item.icon}`}></i>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
