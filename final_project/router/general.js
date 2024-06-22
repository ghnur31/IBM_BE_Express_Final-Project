const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    return users.some((user) => user.username === username);
  };

public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    
    if (!username || !password) {
        return res.status(404).json({ message: "Missing username or password" });
    } else if (doesExist(username)) {
        return res.status(404).json({ message: "user has already exists." });
    } else {
        users.push({ username: username, password: password });
        return res
            .status(200)
            .json({ message: "User registered successfully, user can login" });
    }
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const allBooks = await books;
        return res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (e) {
        res.status(500).send(e);
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    //Write your code here
    const noISBN = parseInt(req.params.isbn);
    const selectedBook = await books[noISBN];
    if (!selectedBook) {
        return res.status(404).json({ message: "Book with that ISBN is not found." });
    } else {
        return res.status(200).json(selectedBook);
    }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    //Write your code here
    const author = Object.values(await books).filter(
        (book) => book.author.toLowerCase() === req.params.author.toLowerCase()
    );
    if (author.length > 0) {
        return res.status(200).send(JSON.stringify(author, null, 4));
    } else {
        return res.status(404).json({ message: "Books from that author is not found" });
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    //Write your code here
    const titleBook = Object.values(await books).filter(
        (book) => book.title.toLowerCase() === req.params.title.toLowerCase()
    );
    if (titleBook) {
        return res.status(200).send(JSON.stringify(titleBook, null, 4));
    } else {
        return res.status(404).json({ message: "Title Book is not found" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const noISBN = req.params.isbn;
    const selectedBook = books[noISBN];
    if (selectedBook) {
        return res.status(200).send(JSON.stringify(selectedBook.reviews, null, 4));
    } else {
        return res.status(404).json({ message: "review book with that isbn not found" });
    }
});

module.exports.general = public_users;
