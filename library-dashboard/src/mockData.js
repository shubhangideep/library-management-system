// src/mockData.js

export const books = [
  { id: 1, title: "Clean Code", authorIds: [1], available: false },
  { id: 2, title: "The Pragmatic Programmer", authorIds: [2], available: true },
];

export const authors = [
  { id: 1, name: "Robert C. Martin" },
  { id: 2, name: "Andrew Hunt" },
];

export const borrowers = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  {id: 3, name: "Shubhangi Deep"}
];

export const loans = [
  {
    id: 1,
    bookId: 1,
    borrowerId: 1,
    issueDate: "2025-05-15",
    returnDate: null,
  },
];
