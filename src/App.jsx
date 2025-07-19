import { useState } from "react";
import Home from "./components/Home.jsx";
import SongList from "./components/SongList.jsx";
import AddSong from "./components/AddSong.jsx";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");

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
        {page === "songs" && <SongList />}
        {page === "add" && <AddSong />}
      </main>
    </div>
  );
}

export default App;
