import { useState, useEffect } from "react";

function SongList({ onEditSong }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/songs`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch songs");
      }

      // Backend now returns { success: true, data: songs }
      setSongs(result.data || []);
    } catch (err) {
      console.error("Error fetching songs:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteSong = async (songId) => {
    if (!window.confirm("Are you sure you want to delete this song?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/songs/${songId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete song");
      }

      // Remove the song from local state
      setSongs(songs.filter((song) => song._id !== songId));
      alert("Song deleted successfully! ✅");
    } catch (err) {
      console.error("Error deleting song:", err);
      alert("Error deleting song: " + err.message);
    }
  };

  // Render loading state, error state, or song list
  if (loading) {
    return (
      <div className="loading">
        <h2>📚 Loading songs...</h2>
        <p>Please wait while we fetch the latest song information.</p>
      </div>
    );
  }

  // If there's an error, show it
  if (error) {
    return (
      <div className="error">
        <h2>❌ Error Loading Songs</h2>
        <p>{error}</p>
        <button
          onClick={fetchSongs}
          className="retry-btn"
        >
          Try Again
        </button>
      </div>
    );
  }

  // If no songs, show empty state
  return (
    <div className="song-list">
      <div className="page-header">
        <h1>📚 Available Songs</h1>
        <p>
          Total songs: <strong>{songs.length}</strong>
        </p>
      </div>

      {songs.length === 0 ? (
        <div className="empty-state">
          <h3>📝 No songs available yet</h3>
          <p>Add some songs to get started!</p>
          <button
            onClick={() => (window.location.hash = "add")}
            className="cta-btn"
          >
            Add Your First Song
          </button>
        </div>
      ) : (
        <div className="songs-table-container">
          <table className="songs-table">
            <thead>
              <tr>
                <th>🎵 Title</th>
                <th>🎤 Artist</th>
                <th>🎸 Genre</th>
                <th>🌟 Popularity</th>
                <th>📅 Release Date</th>
                <th>📝 Added</th>
                <th>⚙️ Actions</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song) => (
                <tr key={song._id}>
                  <td className="song-title">{song.title}</td>
                  <td className="song-artist">{song.artist}</td>
                  <td className="song-genre">
                    {song.genre && song.genre.length > 0
                      ? song.genre.join(", ")
                      : "Not specified"}
                  </td>
                  <td className="song-popularity">
                    {song.popularity !== undefined
                      ? `${song.popularity}/10`
                      : "N/A"}
                  </td>
                  <td className="song-date">
                    {new Date(song.releaseDate).toLocaleDateString()}
                  </td>
                  <td className="song-added">
                    {new Date(song.createdAt).toLocaleDateString()}
                  </td>
                  <td className="song-actions">
                    <button
                      onClick={() => onEditSong(song._id)}
                      className="edit-btn table-btn"
                      title="Edit song"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteSong(song._id)}
                      className="delete-btn table-btn"
                      title="Delete song"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SongList;
