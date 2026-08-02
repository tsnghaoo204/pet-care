export function ValueProps() {
  const values = [
    {
      id: 1,
      icon: '🚀',
      title: 'Worldwide Express Shipping',
      desc: 'Fast, tracked shipping direct to your door so your pet never waits.',
    },
    {
      id: 2,
      icon: '🛡️',
      title: '100% Safe & Non-Toxic',
      desc: 'Made from natural rubber and food-grade BPA-free pet safe materials.',
    },
    {
      id: 3,
      icon: '🔄',
      title: '30-Day Easy Guarantee',
      desc: 'Not a perfect fit for your pet? Enjoy effortless 30-day returns & exchanges.',
    },
    {
      id: 4,
      icon: '💬',
      title: '24/7 Expert Pet Advice',
      desc: 'Our passionate support team is here to assist with sizing & recommendations.',
    },
  ];

  return (
    <section className="pet-container">
      <div className="pet-value-section">
        <div className="pet-value-grid">
          {values.map((v) => (
            <div key={v.id} className="pet-value-card">
              <div className="pet-value-icon">{v.icon}</div>
              <div>
                <h3 className="pet-value-title">{v.title}</h3>
                <p className="pet-value-desc">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
