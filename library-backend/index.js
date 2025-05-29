const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send("Library API is running");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
// GET all books
app.get('/books', (req, res) => {
  res.json(books);
});

// GET a book by ID
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send("Book not found");
  res.json(book);
});

// POST create a new book
app.post('/books', (req, res) => {
  const { title, authorIds } = req.body;
  if (!title || !Array.isArray(authorIds)) {
    return res.status(400).send("Invalid data");
  }
  const newBook = {
    id: Date.now(),
    title,
    authorIds,
    available: true
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT update a book
app.put('/books/:id', (req, res) => {
  const { title, authorIds, available } = req.body;
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send("Book not found");

  if (title) book.title = title;
  if (Array.isArray(authorIds)) book.authorIds = authorIds;
  if (typeof available === "boolean") book.available = available;

  res.json(book);
});

// DELETE a book
app.delete('/books/:id', (req, res) => {
  const index = books.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send("Book not found");
  const deleted = books.splice(index, 1);
  res.json(deleted[0]);
});
let books = [
  { id: 1, title: "Clean Code", authorIds: [1], available: false },
  { id: 2, title: "The Pragmatic Programmer", authorIds: [2], available: true },
];

let authors = [
  { id: 1, name: "Robert C. Martin" },
  { id: 2, name: "Andrew Hunt" },
];

let borrowers = [
  { id: 1, name: "John Doe" },
];

let loans = [
  {
    id: 1,
    bookId: 1,
    borrowerId: 1,
    issueDate: "2025-05-1",
    returnDate: null,
  },
];
// GET all authors
app.get('/authors', (req, res) => {
  res.json(authors);
});

// GET an author by ID
app.get('/authors/:id', (req, res) => {
  const author = authors.find(a => a.id === parseInt(req.params.id));
  if (!author) return res.status(404).send("Author not found");
  res.json(author);
});

// POST create a new author
app.post('/authors', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send("Author name is required");

  const newAuthor = {
    id: Date.now(),
    name,
  };
  authors.push(newAuthor);
  res.status(201).json(newAuthor);
});

// PUT update an author
app.put('/authors/:id', (req, res) => {
  const { name } = req.body;
  const author = authors.find(a => a.id === parseInt(req.params.id));
  if (!author) return res.status(404).send("Author not found");

  author.name = name || author.name;
  res.json(author);
});

// DELETE an author
app.delete('/authors/:id', (req, res) => {
  const index = authors.findIndex(a => a.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send("Author not found");

  const deleted = authors.splice(index, 1);
  res.json(deleted[0]);
});
// GET all borrowers
app.get('/borrowers', (req, res) => {
  res.json(borrowers);
});

// GET a borrower by ID
app.get('/borrowers/:id', (req, res) => {
  const borrower = borrowers.find(b => b.id === parseInt(req.params.id));
  if (!borrower) return res.status(404).send("Borrower not found");
  res.json(borrower);
});

// POST create a new borrower
app.post('/borrowers', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send("Borrower name is required");

  const newBorrower = {
    id: Date.now(),
    name,
  };
  borrowers.push(newBorrower);
  res.status(201).json(newBorrower);
});

// PUT update a borrower
app.put('/borrowers/:id', (req, res) => {
  const { name } = req.body;
  const borrower = borrowers.find(b => b.id === parseInt(req.params.id));
  if (!borrower) return res.status(404).send("Borrower not found");

  borrower.name = name || borrower.name;
  res.json(borrower);
});

// DELETE a borrower
app.delete('/borrowers/:id', (req, res) => {
  const index = borrowers.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send("Borrower not found");

  const deleted = borrowers.splice(index, 1);
  res.json(deleted[0]);
});
// GET all loans
app.get('/loans', (req, res) => {
  res.json(loans);
});

// POST borrow a book
app.post('/loans', (req, res) => {
  const { bookId, borrowerId } = req.body;

  const book = books.find(b => b.id === bookId);
  if (!book) return res.status(404).send("Book not found");
  if (!book.available) return res.status(400).send("Book is already issued");

  const borrower = borrowers.find(b => b.id === borrowerId);
  if (!borrower) return res.status(404).send("Borrower not found");

  const newLoan = {
    id: Date.now(),
    bookId,
    borrowerId,
    issueDate: new Date().toISOString().split("T")[0],
    returnDate: null,
  };

  loans.push(newLoan);
  book.available = false;

  res.status(201).json(newLoan);
});

// PUT return a book
app.put('/loans/:id/return', (req, res) => {
  const loan = loans.find(l => l.id === parseInt(req.params.id));
  if (!loan) return res.status(404).send("Loan not found");
  if (loan.returnDate) return res.status(400).send("Book already returned");

  loan.returnDate = new Date().toISOString().split("T")[0];

  const book = books.find(b => b.id === loan.bookId);
  if (book) book.available = true;

  res.json(loan);
});

// GET overdue loans
app.get('/loans/overdue', (req, res) => {
  const today = new Date();
  const overdueLoans = loans.filter(loan => {
    if (loan.returnDate) return false;
    const issued = new Date(loan.issueDate);
    const diff = Math.ceil((today - issued) / (1000 * 60 * 60 * 24));
    return diff > 14;
  });
  res.json(overdueLoans);
});
