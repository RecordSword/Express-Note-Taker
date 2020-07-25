console.log("Starting app.js");
// Express
const express = require('express');
var path = require("path");
const database = require("./Develop/db/db.json");
var fs = require("fs");

// Create  express server
const app = express();
var PORT = process.env.PORT || 3000;


// Set up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))
app.use("/assets", express.static(__dirname + "/assets"));


// LISTENER
// Listen on port.
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
  });