function Home({ onNavigate, isAuthenticated }) {
  const handleSongManagementClick = () => {
    if (isAuthenticated) {
      onNavigate && onNavigate("songs");
    } else {
      onNavigate && onNavigate("login");
    }
  };

  return (
    <div className="home">
      <h1>🎓 Welcome to the Songs Manager</h1>
      <p>Manage your music collection with ease.</p>

      <div className="system-status">
        <h3>✅ System Status</h3>
        <ul className="status-list">
          <li>🔌 Backend API: Connected</li>
          <li>🗄️ Database: MongoDB Atlas</li>
          <li>⚛️ Frontend: React + Vite</li>
        </ul>
      </div>

      <div className="action-cards">
        <div
          className="action-card clickable"
          onClick={handleSongManagementClick}
        >
          <h4>📚 Song Management</h4>
          <p>
            {isAuthenticated
              ? "Create, view, edit, and delete songs"
              : "Login required to manage songs"}
          </p>
          <div className="card-arrow">{isAuthenticated ? "→" : "🔐"}</div>
        </div>
      </div>
    </div>
  );
}

export default Home;
