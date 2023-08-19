var express = require('express');
var session = require('express-session');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const bcrypt = require('bcrypt');
const salt = 10;
require('dotenv').config();
//mongodb setup
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MYDB;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
let dbName="users";
let collectionName="users";

var app = express();
app.use(cookieParser());
var PORT = process.env.PORT || 8080;

app.use(express.static(__dirname+"/../"));


// Express functions, setting up session, json
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
  saveUninitialized: true,
  cookie:{
    sameSite:"lax"
  }
}));
// "database" object for storing users
var users = {};

// function to check if there is a user in a session
var sessionChecker = (req, res, next) => {  
    console.log("Session Test", req.session)
    console.log(req.session.id); 
    if (req.session.user) {
        console.log(`Found User Session`.green);
        next();
    } else {
        console.log(`No User Session Found`.red);
        res.send('No User Session Found');
    }
};
//route to add user(info) to users(object/db)
app.post("/auth/signup", async function(req, res) { 
  try {
    //get db
    await client.connect();
    let collection= client.db(dbName).collection(collectionName);
    console.log(req.body);
    //check if user exists
    let foundUsers= await collection.find({name:req.body.email}).toArray();
    console.log("User exists?", foundUsers)
    if(!foundUsers.length>=1){
      //encrypt password
      const password = bcrypt.hashSync(req.body.password, salt);
      req.body.password = password;
      console.log(req.body);
      //save user to db
      const result = await collection.insertOne({name:req.body.email, password:password});
      res.json(req.body);
      // res.status(200).send(result);
    }
    else{
      console.log("Signup failed")
    }
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});
//login route
app.post("/auth/login", async function(req, res) {
  try {
    //get db
    await client.connect();
    let collection=client.db(dbName).collection(collectionName);
    //search db
    const result=await collection.find({name:req.body.email}).toArray();
    console.log(result)
    //set found user to current
    var user = result[0].name;
    console.log("Found user ",result[0].name, req.body.email);
    console.log("Password match?",bcrypt.compareSync(req.body.password.toString(), result[0].password.toString()));
    if (result[0].name==req.body.email) {
      console.log("email matches")
      if (bcrypt.compareSync(req.body.password, result[0].password)) {
        console.log("password matches")
          //set session
          req.session.user = user;
          console.log("Yipee, Session user is:", req.session.user);
          console.log(req.session.id);
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
  }
  catch (error) {
    console.log("Log in failed, sad",error);
    res.sendStatus(500);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
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

app.get("/users",  async function(req, res) {
  try {
    //get db
    await client.connect();
    let collection=client.db(dbName).collection(collectionName);
    //get users
    const result=await collection.find({}).toArray();
    console.log(result);
    res.json(result);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
})

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});