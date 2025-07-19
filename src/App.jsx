import { useState } from "react";
import Home from "./components/Home.jsx";
import SongList from "./components/SongList.jsx";
import AddSong from "./components/AddSong.jsx";
import EditSong from "./components/EditSong.jsx";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [editingSongId, setEditingSongId] = useState(null);

  const handleEditSong = (songId) => {
    setEditingSongId(songId);
    setPage("edit");
  };

  const handleBackToSongs = () => {
    setEditingSongId(null);
    setPage("songs");
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
        </div>
      </nav>

      <main className="main-content">
        {page === "home" && <Home />}
        {page === "songs" && <SongList onEditSong={handleEditSong} />}
        {page === "add" && <AddSong />}
        {page === "edit" && (
          <EditSong
            songId={editingSongId}
            onBack={handleBackToSongs}
          />
        )}
      </main>
    </div>
  );
}

export default App;
