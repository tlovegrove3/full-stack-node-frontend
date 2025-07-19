import { useState, useEffect } from "react";

function EditSong({ songId, onBack }) {
  const [songData, setSongData] = useState({
    title: "",
    artist: "",
    popularity: "",
    releaseDate: "",
    genre: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const API_BASE_URL = "http://localhost:3000/api";

  useEffect(() => {
    if (songId) {
      fetchSong();
    }
  }, [songId]);

  const fetchSong = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/songs/${songId}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch song");
      }

      // Populate form with existing data
      const song = result.data;
      setSongData({
        title: song.title || "",
        artist: song.artist || "",
        popularity: song.popularity || "",
        releaseDate: song.releaseDate ? song.releaseDate.split("T")[0] : "",
        genre: Array.isArray(song.genre)
          ? song.genre.join(", ")
          : song.genre || "",
      });
    } catch (err) {
      console.error("Error fetching song:", err);
      setMessage({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSongData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear any previous messages when user starts typing
    if (message.text) {
      setMessage({ text: "", type: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/songs/${songId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: songData.title,
          artist: songData.artist,
          popularity: parseInt(songData.popularity, 10),
          releaseDate: songData.releaseDate,
          genre: songData.genre
            .split(",")
            .map((g) => g.trim())
            .filter((g) => g),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update song");
      }

      setMessage({
        text: `Song "${result.data.title}" updated successfully! 🎉`,
        type: "success",
      });

      // Auto-redirect back to song list after 2 seconds
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (err) {
      console.error("Error updating song:", err);
      setMessage({ text: err.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>📚 Loading song...</h2>
        <p>Please wait while we fetch the song information.</p>
      </div>
    );
  }

  return (
    <div className="edit-song">
      <div className="page-header">
        <h1>✏️ Edit Song</h1>
        <p>Update the song information below</p>
        <button
          onClick={onBack}
          className="back-btn"
        >
          ← Back to Songs
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="song-form"
      >
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">
              🎵 Song Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={songData.title}
              onChange={handleChange}
              placeholder="e.g., Bohemian Rhapsody"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="artist">
              🎤 Artist <span className="required">*</span>
            </label>
            <input
              type="text"
              id="artist"
              name="artist"
              value={songData.artist}
              onChange={handleChange}
              placeholder="e.g., Queen"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="popularity">🌟 Popularity (0-100)</label>
            <input
              type="number"
              id="popularity"
              name="popularity"
              value={songData.popularity}
              onChange={handleChange}
              placeholder="e.g., 85"
              min="0"
              max="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="releaseDate">📅 Release Date</label>
            <input
              type="date"
              id="releaseDate"
              name="releaseDate"
              value={songData.releaseDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="genre">🎸 Genre</label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={songData.genre}
              onChange={handleChange}
              placeholder="e.g., Rock, Pop (comma separated)"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={saving}
            className="submit-btn"
          >
            {saving ? <>⏳ Updating Song...</> : <>💾 Update Song</>}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}
      </form>
    </div>
  );
}

export default EditSong;
