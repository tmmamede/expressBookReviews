const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. You can now login." });
    } else {
      return res.status(404).json({ message: "User already exists." });
    }
  }

  return res.status(404).json({ message: "Unable to register user." });
});

// Get book list sync
// public_users.get('/', function (req, res) {
//   return res.json(books);
// });

// Get book list async
public_users.get('/', async function (req, res) {
  try {
    const bookList = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(books);
      }, 100);
    });
    return res.json(bookList);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get book by ISBN sync
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  return res.json({[isbn]: books[isbn]});
});

// Get book by ISBN async
// public_users.get('/isbn/:isbn', async function (req, res) {
//   try {
//     const bookList = await new Promise((resolve, reject) => {
//       setTimeout(() => {
//         let isbn = req.params.isbn;
//         resolve({ [isbn]: books[isbn] });
//       }, 100);
//     });
//     return res.json(bookList);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// });

// Get books by author sync
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author;
  return res.json(Object.entries(books)
    .filter(([_, value]) => value.author === author)
    .reduce((result, [key, value]) => {
      result[key] = value;
      return result;
    }, {})
  );
});

// Get books by author async
// public_users.get('/author/:author', async function (req, res) {
//   try {
//     const bookList = await new Promise((resolve, reject) => {
//       setTimeout(() => {
//         let author = req.params.author;
//         resolve(Object.entries(books)
//           .filter(([_, value]) => value.author === author)
//           .reduce((result, [key, value]) => {
//             result[key] = value;
//             return result;
//           }, {})
//         );
//       }, 100);
//     });
//     return res.json(bookList);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// });

// Get books by title sync
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;
  return res.json(Object.entries(books)
    .filter(([_, value]) => value.title === title)
    .reduce((result, [key, value]) => {
      result[key] = value;
      return result;
    }, {})
  );
});

// Get books by title async
// public_users.get('/title/:title', async function (req, res) {
//   try {
//     const bookList = await new Promise((resolve, reject) => {
//       setTimeout(() => {
//         let title = req.params.author;
//         resolve(Object.entries(books)
//           .filter(([_, value]) => value.title === title)
//           .reduce((result, [key, value]) => {
//             result[key] = value;
//             return result;
//           }, {})
//         );
//       }, 100);
//     });
//     return res.json(bookList);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// });

//  Get book reviews sync
public_users.get('/review/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  return res.json({ [isbn]: books[isbn].reviews });
});

//  Get book reviews async
// public_users.get('/review/:isbn', async function (req, res) {
//   try {
//     const bookList = await new Promise((resolve, reject) => {
//       setTimeout(() => {
//         let isbn = req.params.isbn;
//         resolve({ [isbn]: books[isbn].reviews });
//       }, 100);
//     });
//     return res.json(bookList);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// });

module.exports.general = public_users;
