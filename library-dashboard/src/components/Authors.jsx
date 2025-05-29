import React, { useEffect, useState } from "react";
import axios from "axios";

function Authors() {
  const [authors, setAuthors] = useState([]); // ✅ lowercase!
  const [newAuthor, setNewAuthor] = useState("");
  const API = "http://localhost:4000";

  const fetchAuthors = async () => {
    const res = await axios.get(`${API}/authors`);
    setAuthors(res.data);
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const addAuthor = async () => {
    if (!newAuthor.trim()) return alert("Author name is required");
    await axios.post(`${API}/authors`, { name: newAuthor });
    setNewAuthor("");
    fetchAuthors();
  };

  const deleteAuthor = async (id) => {
    await axios.delete(`${API}/authors/${id}`);
    fetchAuthors();
  };

  return (
    <div>
      <h2>Authors</h2>
      <ul>
        {authors.map(author => (
          <li key={author.id}>
            {author.name}
            <button onClick={() => deleteAuthor(author.id)} style={{ marginLeft: "10px" }}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <h3>Add New Author</h3>
      <input
        type="text"
        placeholder="Author Name"
        value={newAuthor}
        onChange={(e) => setNewAuthor(e.target.value)}
      />
      <button onClick={addAuthor} style={{ marginLeft: "10px" }}>Add</button>
    </div>
  );
}

export default Authors;
