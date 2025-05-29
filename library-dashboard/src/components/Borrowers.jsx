import React, { useEffect, useState } from "react";
import axios from "axios";

function Borrowers() {
  const [borrowers, setBorrowers] = useState([]);
  const [newBorrower, setNewBorrower] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const API = "http://localhost:4000";

  useEffect(() => {
    fetchBorrowers();
  }, []);

  const fetchBorrowers = async () => {
    const res = await axios.get(`${API}/borrowers`);
    setBorrowers(res.data);
  };

  const addBorrower = async () => {
    if (!newBorrower.trim()) return alert("Enter borrower name");
    await axios.post(`${API}/borrowers`, { name: newBorrower });
    setNewBorrower("");
    fetchBorrowers();
  };

  const updateBorrower = async (id) => {
    await axios.put(`${API}/borrowers/${id}`, { name: editingName });
    setEditingId(null);
    setEditingName("");
    fetchBorrowers();
  };

  const deleteBorrower = async (id) => {
    await axios.delete(`${API}/borrowers/${id}`);
    fetchBorrowers();
  };

  return (
    <div>
      <h2>Borrowers</h2>
      <ul>
        {borrowers.map(b => (
          <li key={b.id}>
            {editingId === b.id ? (
              <>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
                <button onClick={() => updateBorrower(b.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                {b.name}
                <button onClick={() => {
                  setEditingId(b.id);
                  setEditingName(b.name);
                }} style={{ marginLeft: "5px" }}>Edit</button>
              </>
            )}
            <button onClick={() => deleteBorrower(b.id)} style={{ marginLeft: "10px" }}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Add New Borrower</h3>
      <input
        type="text"
        placeholder="Borrower Name"
        value={newBorrower}
        onChange={(e) => setNewBorrower(e.target.value)}
      />
      <button onClick={addBorrower} style={{ marginLeft: "10px" }}>Add</button>
    </div>
  );
}

export default Borrowers;
