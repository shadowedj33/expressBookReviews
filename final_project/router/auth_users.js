const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
        "username": "test",
        "password": "test2024"
    }
];

const isValid = (username)=>{ 
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ 
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  if (!username ||!password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const token = jwt.sign({ username }, 'secretkey', { expiresIn: '1h' });
  return res.status(200).json({ message: "User successfully logged in." });
});

// Add a book review
regd_users.put("/auth/review/:isbn", verifyToken, (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.username;

  // Check if the user has already posted a review for this ISBN
  const existingReview = books.find((book) => book.isbn === isbn && book.reviews.find((review) => review.username === username));

  if (existingReview) {
    // Modify the existing review
    const index = existingReview.reviews.findIndex((review) => review.username === username);
    existingReview.reviews[index].review = review;
    res.status(200).json({ message: "Review updated successfully" });
  } else {
    // Add a new review
    const newReview = { username, review };
    books.find((book) => book.isbn === isbn).reviews.push(newReview);
    res.status(201).json({ message: "Review added successfully" });
  }
});

// Verify token middleware
function verifyToken(req, res, next) {
  const token = req.header("Authorization").replace("Bearer ", "");
  jwt.verify(token, "secretkey", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.username = decoded.username;
    next();
  });
}

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
