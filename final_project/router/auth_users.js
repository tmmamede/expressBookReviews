const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if username has been registered
const isValid = (username) => {
  let filteredUsername = users.filter((user) => {
    return user.username === username;
  });
  if (filteredUsername.length > 0) {
    return true;
  } else {
    return false;
  }
}

// Authenticate user
const authenticatedUser = (username, password) => {
  let filteredUser = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  if (filteredUser.length > 0) {
    return true;
  } else {
    return false;
  }
}

// Login user
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in." });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).json({ message: "User successfully logged in." });
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password." });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let review = req.query.review;
  let username = req.session.authorization.username;
  let isbn = req.params.isbn;
  let msg = books[isbn].reviews[username] ? "Review updated successfully." : "Review added successfully.";
  books[isbn].reviews[username] = review;
  return res.json({ message: msg , reviews: { [isbn]: books[isbn].reviews } });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let username = req.session.authorization.username;
  let isbn = req.params.isbn;
  delete books[isbn].reviews[username];
  return res.json({ message: "Review deleted successfully", reviews: { [isbn]: books[isbn].reviews } });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
