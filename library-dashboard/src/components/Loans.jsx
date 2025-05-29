import React, { useEffect, useState } from "react";
import axios from "axios";

function Loans() {
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [selectedBorrowerId, setSelectedBorrowerId] = useState("");
const [filter, setFilter] = useState("all");

  const API = "http://localhost:4000";

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [loanRes, bookRes, borrowerRes] = await Promise.all([
      axios.get(`${API}/loans`),
      axios.get(`${API}/books`),
      axios.get(`${API}/borrowers`)
    ]);
    setLoans(loanRes.data);
    setBooks(bookRes.data);
    setBorrowers(borrowerRes.data);
  };

  const borrowBook = async () => {
    if (!selectedBookId || !selectedBorrowerId) {
      alert("Select book and borrower");
      return;
    }
    await axios.post(`${API}/loans`, {
      bookId: parseInt(selectedBookId),
      borrowerId: parseInt(selectedBorrowerId)
    });
    setSelectedBookId("");
    setSelectedBorrowerId("");
    fetchAll();
  };

  const returnBook = async (id) => {
    await axios.put(`${API}/loans/${id}/return`);
    fetchAll();
  };

  const getBookTitle = (id) => books.find(b => b.id === id)?.title || "Unknown";
  const getBorrowerName = (id) => borrowers.find(b => b.id === id)?.name || "Unknown";

  // ✅ Check if a loan is overdue (14+ days and not returned)
  const isOverdue = (issueDate, returnDate) => {
    if (returnDate) return false;
    const issued = new Date(issueDate);
    const today = new Date();
    const diff = Math.floor((today - issued) / (1000 * 60 * 60 * 24));
    return diff > 14;
  };

  return (
    <div>
      <h2>Loan Records</h2>
      <label>Filter: </label>
<select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ marginBottom: "10px" }}>
  <option value="all">All</option>
  <option value="active">Active</option>
  <option value="returned">Returned</option>
  <option value="overdue">Overdue</option>
</select>

      <ul>
  {loans
    .filter(loan => {
      if (filter === "all") return true;
      if (filter === "active") return !loan.returnDate;
      if (filter === "returned") return !!loan.returnDate;
      if (filter === "overdue") return isOverdue(loan.issueDate, loan.returnDate);
      return true;
    })
    .map(loan => {
      const overdue = isOverdue(loan.issueDate, loan.returnDate);
      return (
        <li
          key={loan.id}
          style={{
            color: overdue ? "red" : "inherit",
            fontWeight: overdue ? "bold" : "normal"
          }}
        >
          {getBorrowerName(loan.borrowerId)} borrowed{" "}
          <strong>{getBookTitle(loan.bookId)}</strong> on {loan.issueDate}
          {loan.returnDate ? (
            <> | Returned on {loan.returnDate}</>
          ) : (
            <> | <button onClick={() => returnBook(loan.id)}>Return</button></>
          )}
          {overdue && " 🔴 Overdue"}
        </li>
      );
    })}
</ul>


      <h3>Borrow a Book</h3>
      <label>Book: </label>
      <select value={selectedBookId} onChange={(e) => setSelectedBookId(e.target.value)}>
        <option value="">-- Select --</option>
        {books.filter(b => b.available).map(book => (
          <option key={book.id} value={book.id}>{book.title}</option>
        ))}
      </select>

      <label style={{ marginLeft: "10px" }}>Borrower: </label>
      <select value={selectedBorrowerId} onChange={(e) => setSelectedBorrowerId(e.target.value)}>
        <option value="">-- Select --</option>
        {borrowers.map(b => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>


      <button onClick={borrowBook} style={{ marginLeft: "10px" }}>Borrow</button>
    </div>
  );
}

export default Loans;
