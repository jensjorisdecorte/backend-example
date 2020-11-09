// Creëer Express applicatie
var express = require("express");
var app = express();
const path = require("path");

// Initialiseer de database
const dbFile = path.join("./sqlite.db");
const fs = require("fs");
//fs.unlinkSync(dbFile); // uncomment deze lijn tijdelijk als je de database wilt verwijderen
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

// Creëer de database tabellen
// Goede bron voor SQLite naslag: https://www.sqlitetutorial.net/
db.serialize(() => {
  if (!exists) {
    db.run(
      "CREATE TABLE Users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);"
    );
    console.log("Database created");
  }
});

// Nodig om de json data van o.a. POST requests te processen
// De json data van een request is de vinden in het veld req.body
app.use(express.json());

// Sta externe communicatie toe
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*"); // heeft te maken met HTTP headers (indien geïnteresseerd kan je dit nalezen op https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers)
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

// Antwoord met een lijst van alle gebruikers
app.get("/users", (req, res) => {
  db.all("SELECT * from Users", (err, rows) => {
    if (err) {
      res.send({ error: err });
      return;
    }
    res.send(JSON.stringify(rows));
  });
});

var server = app.listen(8081, function () {
  var port = server.address().port;
  console.log("Example app listening on port %s", port);
});
