import { useState } from "react";

function AddSong() {
  const [songData, setSongData] = useState({
    title: "",
    artist: "",
    popularity: "",
    releaseDate: new Date().toISOString().split("T")[0], // Just date format
    genre: [],
    // Remove createdAt/updatedAt - let backend handle these
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

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
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/songs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: songData.title,
          artist: songData.artist,
          popularity: parseInt(songData.popularity, 10),
          releaseDate: songData.releaseDate,
          genre: songData.genre,
          // Let backend handle createdAt/updatedAt timestamps
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create song");
      }

      setMessage({
        text: `Song "${result.data.title}" created successfully! 🎉`,
        type: "success",
      });

      // Reset form
      setSongData({
        title: "",
        artist: "",
        popularity: "",
        releaseDate: new Date().toISOString().split("T")[0],
        genre: "",
      });

      // Auto-clear success message after 5 seconds
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 5000);
    } catch (err) {
      console.error("Error creating song:", err);
      setMessage({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-song">
      <div className="page-header">
        <h1>➕ Add New Song</h1>
        <p>Fill out the form below to create a new song</p>
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
            <label htmlFor="popularity">
              🌟 Popularity (0-10) <span className="required">*</span>
            </label>
            <input
              type="number"
              id="popularity"
              name="popularity"
              value={songData.popularity}
              onChange={handleChange}
              placeholder="e.g., 8"
              min="0"
              max="10"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="releaseDate">
              📅 Release Date <span className="required">*</span>
            </label>
            <input
              type="date"
              id="releaseDate"
              name="releaseDate"
              value={songData.releaseDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="genre">
              🎸 Genre <span className="required">*</span>
            </label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={songData.genre}
              onChange={handleChange}
              placeholder="e.g., Rock"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="submit-btn"
        >
          {loading ? <>⏳ Creating Song...</> : <>✨ Create Song</>}
        </button>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}
      </form>
    </div>
  );
}

export default AddSong;
