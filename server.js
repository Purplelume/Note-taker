// Importing dependencies
const fs = require("fs");
const express = require("express");
const path = require("path");

// Using express
const app = express();

// Heroku chooses the port, othewise is setted to 8080
const PORT = process.env.PORT || 8080;

// Using static elements in the public folder
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// GET method to go to notes.html
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// GET method to read db.json and display the files within
app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

// GET method to go to index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// POST method to read the request body, assign it to a number id, and disply it on the page
app.post("/api/notes", (req, res) => {
    let newNote = req.body;
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let notelength = (noteList.length).toString();

    newNote.id = notelength;

    // Pushing the new note to db.json
    noteList.push(newNote);

    // Writing the new data to db.json
    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);
})

// EXTRA POINTS

// Deleting the notes according to their id assigned before
app.delete("/api/notes/:id", (req, res) => {
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteId = (req.params.id).toString();

    // Saving all notes that have a matching array in a new array that will be deleted
    noteList = noteList.filter(selected =>{
        return selected.id != noteId;
    })

    // Writing new data to db.json
    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);
});


// Port listening when deployed
app.listen(PORT, () => console.log("Server is available and listening on port " + PORT + "!"));