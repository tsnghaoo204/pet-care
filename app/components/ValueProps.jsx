export function ValueProps() {
  const values = [
    {
      id: 1,
      icon: '🚚',
      title: 'Giao Nhanh Hỏa Tốc',
      desc: 'Nhận hàng nhanh chóng trong 24h để thú cưng không phải chờ đợi.',
    },
    {
      id: 2,
      icon: '🛡️',
      title: 'Chất Liệu Safe & Non-Toxic',
      desc: '100% cao su tự nhiên và nhựa mầm an toàn không gây độc hại khi cắn.',
    },
    {
      id: 3,
      icon: '🔄',
      title: 'Đổi Trả Dễ Dàng trong 7 Ngày',
      desc: 'Thú cưng không hứng thú? Hỗ trợ đổi sang mẫu đồ chơi khác miễn phí.',
    },
    {
      id: 4,
      icon: '📞',
      title: 'Tư Vấn Chọn Đồ Dùng',
      desc: 'Đội ngũ tư vấn theo kích thước, cân nặng và thói quen cắn của bé.',
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
