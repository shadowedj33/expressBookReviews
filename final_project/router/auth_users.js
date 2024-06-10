const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("Customer successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
    let book = books[isbn]
    if (book) { //Check book exists
        let review = req.query.review;

        //if review the reviews has been changed, update the reviews 
        if (review) {
            book["reviews"] = review
            console.log("Hepp---", book["reviews"])
        }
        
        books[isbn] = book;
        res.send(`Review for the book with IBN ${isbn} was added/updated. \n ${JSON.stringify(books[isbn])}`);
    }
    else {
        res.send("Unable to find book with IBN!");
    }
});

// Remove book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    //Check book exists
    delete book["reviews"];
    book["reviews"] = {};
    books[isbn] = book;
    res.send(
      `Review for the book with ISBN ${isbn} posted by ${JSON.stringify(
        req.session.authorization.username
      )} has been Deleted. \n ${JSON.stringify(books[isbn])}`
    );
  } else {
    res.send("Unable to find book with ISBN!");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
