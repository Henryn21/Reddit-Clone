var express = require('express');
var session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcrypt');
const salt = 10;
require('dotenv').config();

var PORT = process.env.PORT || 8080;

var app = express();

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
	origin: true,
	credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));

var users = {};

var sessionChecker = (req, res, next) => {  
  console.log("Session Test", req.session)  
  if (req.session.user) {
      console.log(`Found User Session`.green);
      next();
  } else {
      console.log(`No User Session Found`.red);
      res.send('No User Session Found');
  }
};

app.post("/auth/signup", function(req, res) {
  console.log(req.body);
  const password = bcrypt.hashSync(req.body.password, salt);
  req.body.password = password;
  console.log(req.body);
  users[req.body.email] = req.body;
  res.json(req.body);
});

app.post("/auth/login", function(req, res) {
  var user = users[req.body.email];
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
        delete user.password;
        req.session.user = user;
    }
    else {
        req.session.user = false;
        req.session.error = "Authorization Failure";
    }
    res.json(req.session);
  }
  else {
    res.send("user " + req.body.email + " not found in database")
  }
});

app.get("/auth/logout", function(req, res) {
  req.session.destroy(function () {
      res.redirect('/');
  })
});

app.get("/feature", sessionChecker, function(req, res) {
  res.send("Secret feature used!")
})

app.get("/", sessionChecker, function(req, res) {
  res.send("Logged in: " + !!req.session)
})

app.get("/users", function(req, res) {
  res.json(users)
})

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});