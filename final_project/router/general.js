const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here

  const username = req.body.username;
  const password = req.body.password;

  if (!username) {
    res.send("Username not provided");
  }
  if (!password) {
    res.send("password not provided");
  }
  // console.log()

  if (isValid(username)) {
    console.log("You can create a new users");
    const newUser = { username: username, password: password };
    users.push(newUser);
    res.send(`The new User ${newUser.username} registered successfully`);
  } else {
    res.send("user already exists please login !");
  }

  // return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const data = await books;

    // Send the book list as a response
    return res
      .status(200)
      .header("Content-Type", "application/json")
      .send(JSON.stringify(data, null, 4));
  } catch (error) {
    // Handle any errors if the promise is rejected
    console.log("Error fetching the data.", error);
    res.status(500).send("Error fetching the books");
  }
});


// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    //Write your code here

    const isbn = req.params.isbn;

    const book = books[isbn];

    return res
      .status(200)
      .header("Content-Type", "application/json")
      .send(JSON.stringify(book, null, 4));
  } catch (error) {
    // here we handle the error if any present
    console.log("Error fetching the books", error);
    res.status(500).send("Error fetching the books.");
  }

  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const reqauthor = req.params.author;

  // bookKeys = Object.keys(books);
  // console.log(bookKeys);

  // console.log(books.length);
  // here we are creating a promise to find the author
  const findAuthorPromise = new Promise((resolve, reject) => {
    let authorFound = false;
    for (author in books) {
      // console.log("Hello")
      if (books.hasOwnProperty(author)) {
        const author_obj = books[author];

        // console.log(author_obj.author);
        // console.log(reqauthor);
        if (reqauthor == author_obj.author) {
          authorFound = true;
          resolve(author_obj);
          break;
        }
      } else {
        return res.status(404).send("Book has no property author");
      }
    }
    if (!authorFound) {
      reject("Author not found");
    }
  });

  // Now here we are handling the promise
  findAuthorPromise.then((author_obj) => {
    res.status(200).header("Content-Type", "application/json").send(JSON.stringify(author_obj,null,4));
  })
  .catch((error)=>{
    console.error(`Error finding the author ${error}`);
    res.status(404).send("Author not found");
  })

  // return res.status(300).json({message: "Yet to be implemented"});
});


// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  try {
    const bookTitle = req.params.title;
    const book = await books;

    for (const oneBook of book) {
      if (oneBook.title === bookTitle) {
        return res.status(200).send(JSON.stringify(oneBook, null, 4));
      }
    }

    // Return 404 status code if book not found
    return res.status(404).json({ message: "Book not found" });
  } catch (error) {
    // Handle any errors that occur during the async operation
    console.error("Error fetching book:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  const bookReview = books[isbn];
  console.log(bookReview.reviews);
  if (bookReview) {
    return res.status(200).send(JSON.stringify(bookReview.reviews, null, 4));
  }
  return res
    .status(300)
    .json({ message: "Sab badia hai guru tu chinta mat kar" });
});

module.exports.general = public_users;
