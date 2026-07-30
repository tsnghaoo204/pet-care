export function PetProfileFilterBar({activeTab, onSelectTab}) {
  const tabs = [
    {id: 'all', label: 'Tất Cả Đồ Dùng', icon: '🐾'},
    {id: 'dog', label: 'Dành Cho Cún 🐕', icon: '🐶'},
    {id: 'cat', label: 'Dành Cho Mèo 🐱', icon: '🐱'},
    {id: 'tough', label: 'Gặm Siêu Bền 🦴', icon: '🦴'},
    {id: 'puzzle', label: 'Trí Tuệ & Vui Nhộn 🎯', icon: '🎯'},
  ];

  return (
    <div className="pet-filter-bar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`pet-filter-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onSelectTab(tab.id)}
          type="button"
        >
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
