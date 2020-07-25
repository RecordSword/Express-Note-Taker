console.log("Starting app.js");
// Express
const express = require('express');
var path = require("path");
var database = require("./db/db.json");
var fs = require("fs");

// Create  express server
const app = express();
var PORT = process.env.PORT || 3000;


// Set up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))
app.use("/assets", express.static(__dirname + "/assets"));

// ROUTES
// Point the app to the route files.

app.get("/notes", function (request, response) {
    response.sendFile(path.join(__dirname, "public/notes.html"));
});

// access notes stored in db.json, parse and deliver these to client
app.get("/api/notes", function (request, response) {
    fs.readFile('./db/db.json', 'utf8', (error, data) => {
        if (error) throw error;
        if (data) {
            response.json(JSON.parse(data));
        } else {
            response.json([]);
        }
    });
});

// access request body for new notes and previously savedNotes from database. 
// if saved notes is empty, assign new note id to 1. if not empty, id will call the ID of the last object in savedNotes and increase the value of that ID by 1, so as not to have duplicate IDs once elements start being deleted. 
// push new note to savedNote array and write to database file syncronosly, then send new array as response. 
app.post("/api/notes", function (request, response) {
    let savedNotes = database;
    let newNote = request.body;
    if (savedNotes.length === 0) {
        newNote.id = 1;
    } else {
        let positionOfObjectToAccess = savedNotes.length - 1;
        let lastIdUsed = savedNotes[positionOfObjectToAccess].id;
        newNote.id = lastIdUsed + 1;
    }
    savedNotes.push(newNote);
    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    return response.json(savedNotes);
});

// filter through the database, finding the object ID that matches the request.params.id. Returns new array containing all objects expect matching IDs. Write this new array to Database synchronously and send as repsonse. 
app.delete("/api/notes/:id", function (req, res) {
    // assigning a variable to the parametered request
    var deletedNote = parseInt(req.params.id);
    // result will have the object that matches id with the task that is to be deleted, it is then filter out of the database
    var result = database.filter(({ id }) => id !== deletedNote);
    // setting the value of database to the filtered result without the deleted task
    database = result;

  // Overwriting the db.json with the new filtered array of objects
  fs.writeFile("db/db.json", JSON.stringify(database), function(err) {
    if (err) {
        console.log(err)
    }
    console.log("Deleted a Task");
    res.json(database)
})
});

    // deliver index.html to client - fallback behaviour
    app.get("*", function (request, response) {
    response.sendFile(path.join(__dirname, "public/index.html"));
});

// LISTENER
// Listen on port.
app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT);
});