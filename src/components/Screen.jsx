export function Screen({ id, activeScreen, children }) {
  return (
    <section className={`screen ${activeScreen === id ? 'active' : ''}`} data-screen={id}>
      {children}
    </section>
  );
}
