console.log("Starting app.js");
// Express
const express = require('express');

// Create  express server
const app = express();
var PORT = process.env.PORT || 3000;


app.get('./', function(req,res) {
    res.send('Hello World');
})


// LISTENER
// Listen on port.
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
  });