const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. You can login."});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = parseInt(req.params.isbn);
    const book = books[isbn];
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter((book) => book.author.toLowerCase() === author.toLowerCase());
    if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor);
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter((book) => book.title.toLowerCase().includes(title.toLowerCase()));
    if (booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle);
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const reviewsByIsbn = books[isbn].reviews;
  res.send(reviewsByIsbn);
});

// Task 10 Promise or Async-Await list of books
const getListOfBooks = async (url) => {
    const outcome = await axios.get(url);
    let listOfBooks = outcome.data;

    console.log('----------------');
    console.log('Get List Of Books');
    console.log('----------------');
    Object.values(listOfBooks).forEach((book) => {
        console.log(`Author: ${book.author}`);
        console.log(`Title: ${book.title}`);
        console.log(`Reviews: ${JSON.stringify(book.reviews)}`);
        console.log('----------------');
    });
    console.log('\n');
}

getListOfBooks(
    'https://jdefoggia-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/'
).catch(err => console.log(err.toString()));

// Task 11 Promis or Async-Await Book based on ISBN
const getBookByISBN = async (url, isbn) => {
    const outcome = await axios.get(url + isbn);
    let book = outcome.data;
    console.log('----------------');
    console.log('Get Book By ISBN');
    console.log('----------------');

    console.log(`Author: ${book.author}`);
    console.log(`Title: ${book.title}`);
    console.log(`Reviews: ${JSON.stringify(book.reviews)}`);
    console.log('----------------');
    console.log('\n');
}

getBookByISBN(
    'https://jdefoggia-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/',
    2
).catch(err => console.log(err.toString()));

// Task 12 Promis Asyn-Await Based on Author
const getBookByAuthor = async (url, author) => {
    const outcome = await axios.get(url + author);
    let book = outcome.data.booksbyauthor;
    console.log('----------------');
    console.log('Get Book By Author');
    console.log('----------------');

    Object.values(book).forEach(item => {
        console.log(`ISBN: ${item.isbn}`);
        console.log(`Title: ${item.title}`);
        console.log(`Reviews: ${JSON.stringify(item.reviews)}`);
        console.log('----------------');
    });

    console.log('\n');
}

getBookByAuthor(
    'https://jdefoggia-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/',
    'Jane Austen'
).catch(err => console.log(err.toString()));


// Task 13 Async-Await Book by Title

const getBookByTitle = async (url, title) => {
    const outcome = await axios.get(url + title);
    let book = outcome.data.booksbytitle;
    console.log('----------------');
    console.log('Get Book By Title');
    console.log('----------------');

    book.forEach(item => {
        console.log(`ISBN: ${item.isbn}`);
        console.log(`Author: ${item.author}`);
        console.log(`Reviews: ${JSON.stringify(item.reviews)}`);
        console.log('----------------');
    });

    console.log('\n');
}

getBookByTitle(
    'https://jdefoggia-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/',
    'The Book of Job'
).catch(err => console.log(err.toString()));

module.exports.general = public_users;
