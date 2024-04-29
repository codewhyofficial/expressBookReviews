const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username":"suraj", "password":"123456"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid

for(const key1 of users){
  console.log(key1.username);
  if(key1.username==username){
    return false;
  }
}
return true;
}

// const isValid = (username) => {
//   for (const user of users) {
//     if (user.username === username) {
//       return false; // Username exists, not valid
//     }
//   }
//   return true; // Username does not exist, valid
// }

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return(user.username===username && user.password ===password) 
  });
  if(validusers.length > 0){
    return true;
  }else{
    return false;
  }
}
const helo = "suaj";

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({message:"Error logging in !!"});
  }
  // const hello = suraj;
  if(authenticatedUser(username, password)){
    req.session.username = username;

    let accessToken = jwt.sign({
      data:password,
    }, 'access', {expiresIn:60*60});

    console.log(accessToken); 

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  }
  else{
    return res.status(208).json({message:"Invalid Login.Check username and password"});
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.username;
  console.log(isbn);
  console.log(review);

  console.log(req.session.username);

  if (books[isbn].reviews[username]) {
    // Update existing review
    books[isbn].reviews[username] = review;
    console.log(books[isbn]);
    return res.status(200).json({ message: 'Review updated successfully.' });
} else {
    // Add new review
    books[isbn].reviews[username] = review;
    return res.status(201).json({ message: 'Review posted successfully.' });
}
});

// delete a book review. 
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username;
  console.log(username);

  if(books[isbn].reviews[username]){
    delete books[isbn].reviews[username];
    return res.status(200).json({message:'Review deleted successfully'});
  }
  else{
    return res.status(404).json({message:"User not found."})
  }

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
