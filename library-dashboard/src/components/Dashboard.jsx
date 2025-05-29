// src/components/Dashboard.jsx
import React, { useState } from "react";
import Books from "./Books";
import Authors from "./Authors";
import Borrowers from "./Borrowers";
import Loans from "./Loans";

function Dashboard() {
  const [tab, setTab] = useState("books");

  return (
    <div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => setTab("books")}>Books</button>
        <button onClick={() => setTab("authors")}>Authors</button>
        <button onClick={() => setTab("borrowers")}>Borrowers</button>
        <button onClick={() => setTab("loans")}>Loans</button>
      </div>

      {tab === "books" && <Books />}
      {tab === "authors" && <Authors />}
      {tab === "borrowers" && <Borrowers />}
      {tab === "loans" && <Loans />}
    </div>
  );
}

export default Dashboard;
