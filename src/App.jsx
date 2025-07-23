import { useState, useEffect } from "react";
import Home from "./components/Home.jsx";
import SongList from "./components/SongList.jsx";
import AddSong from "./components/AddSong.jsx";
import EditSong from "./components/EditSong.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import { authService } from "./services/auth.js";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [editingSongId, setEditingSongId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    if (authService.isAuthenticated()) {
      setIsAuthenticated(true);
      setUsername(authService.getUsername() || "");
    }
  }, []);

  const handleEditSong = (songId) => {
    setEditingSongId(songId);
    setPage("edit");
  };

  const handleBackToSongs = () => {
    setEditingSongId(null);
    setPage("songs");
  };

  const handleLoginSuccess = (result) => {
    setIsAuthenticated(true);
    setUsername(result.username);
    setPage("home");
  };

  const handleRegisterSuccess = (result) => {
    setIsAuthenticated(true);
    setUsername(result.user?.username || "");
    setPage("home");
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUsername("");
    setPage("home");
  };

  return (
    <div className="App">
      <nav className="navbar">
        <h2>🎓 Song Manager</h2>
        <div className="nav-links">
          <button
            onClick={() => setPage("home")}
            className={page === "home" ? "active" : ""}
          >
            🏠 Home
          </button>
          
          {isAuthenticated ? (
            <>
              <button
                onClick={() => setPage("songs")}
                className={page === "songs" ? "active" : ""}
              >
                📚 Songs
              </button>
              <button
                onClick={() => setPage("add")}
                className={page === "add" ? "active" : ""}
              >
                ➕ Add Song
              </button>
              <span className="user-info">👤 {username}</span>
              <button onClick={handleLogout} className="logout-btn">
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setPage("login")}
                className={page === "login" ? "active" : ""}
              >
                🔐 Login
              </button>
              <button
                onClick={() => setPage("register")}
                className={page === "register" ? "active" : ""}
              >
                📝 Register
              </button>
            </>
          )}
        </div>
      </nav>

      <main className="main-content">
        {page === "home" && <Home onNavigate={setPage} isAuthenticated={isAuthenticated} />}
        {page === "login" && <Login onLoginSuccess={handleLoginSuccess} />}
        {page === "register" && <Register onRegisterSuccess={handleRegisterSuccess} />}
        
        {isAuthenticated && (
          <>
            {page === "songs" && <SongList onEditSong={handleEditSong} />}
            {page === "add" && <AddSong />}
            {page === "edit" && (
              <EditSong
                songId={editingSongId}
                onBack={handleBackToSongs}
              />
            )}
          </>
        )}
        
        {!isAuthenticated && (page === "songs" || page === "add" || page === "edit") && (
          <div className="auth-required">
            <h3>🔒 Authentication Required</h3>
            <p>Please log in to access this feature.</p>
            <button onClick={() => setPage("login")}>Go to Login</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
