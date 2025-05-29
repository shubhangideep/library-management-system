import React, { useEffect, useState } from "react";
import axios from "axios";

function Books() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [selectedAuthorIds, setSelectedAuthorIds] = useState([]);
  const [editingBookId, setEditingBookId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [showModal, setShowModal] = useState(false);

  const API = "http://localhost:4000";

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
  }, []);

  const fetchBooks = async () => {
    const res = await axios.get(`${API}/books`);
    setBooks(res.data);
  };

  const fetchAuthors = async () => {
    const res = await axios.get(`${API}/authors`);
    setAuthors(res.data);
  };

  const addBook = async () => {
    if (!newTitle.trim() || selectedAuthorIds.length === 0) {
      return alert("Enter title and select at least one author");
    }

    const newBook = {
      title: newTitle,
      authorIds: selectedAuthorIds.map(Number),
    };

    await axios.post(`${API}/books`, newBook);
    setNewTitle("");
    setSelectedAuthorIds([]);
    setShowModal(false); // close modal
    fetchBooks();
  };

  const deleteBook = async (id) => {
    await axios.delete(`${API}/books/${id}`);
    fetchBooks();
  };

  const getAuthorNames = (authorIds) => {
    return authorIds
      .map(id => authors.find(a => a.id === id)?.name)
      .join(", ");
  };

  const saveEdit = (id) => {
    setBooks(books.map(book => (
      book.id === id ? { ...book, title: editingTitle } : book
    )));
    setEditingBookId(null);
    setEditingTitle("");
  };

  return (
    <div>
      <h2>Books List</h2>
      <ul>
        {books.map(book => (
          <li key={book.id} style={{ marginBottom: "10px" }}>
            {editingBookId === book.id ? (
              <>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                />
                <button onClick={() => saveEdit(book.id)}>Save</button>
                <button onClick={() => setEditingBookId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <strong>{book.title}</strong>
                <button onClick={() => {
                  setEditingBookId(book.id);
                  setEditingTitle(book.title);
                }} style={{ marginLeft: "5px" }}>Edit</button>
              </>
            )}
            <br />
            Authors: {getAuthorNames(book.authorIds)}<br />
            Availability: {book.available ? "✅ Available" : "❌ Issued"}
            <br />
            <button onClick={() => deleteBook(book.id)} style={{ marginTop: "5px" }}>Delete</button>
          </li>
        ))}
      </ul>

      <button onClick={() => setShowModal(true)} style={{ marginTop: "20px" }}>+ Add New Book</button>

      {showModal && (
        <>
          <div style={{
            position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.3)", zIndex: "999"
          }} onClick={() => setShowModal(false)} />

          <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            background: "#fff", padding: "20px", zIndex: "1000", borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
          }}>
            <h3>Add New Book</h3>
            <input
              type="text"
              placeholder="Book Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <br />
            <label>Select Authors:</label><br />
            <select
              multiple
              value={selectedAuthorIds}
              onChange={(e) => {
                const options = Array.from(e.target.selectedOptions);
                setSelectedAuthorIds(options.map(opt => opt.value));
              }}
              style={{ height: "100px", width: "200px" }}
            >
              {authors.map(author => (
                <option key={author.id} value={author.id}>{author.name}</option>
              ))}
            </select>
            <br />
            <button onClick={addBook} style={{ marginTop: "10px" }}>Add Book</button>
            <button onClick={() => setShowModal(false)} style={{ marginLeft: "10px" }}>Cancel</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Books;
