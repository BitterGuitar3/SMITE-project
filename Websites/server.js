// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Serve static files (HTML, CSS, JS) from the 'public' folder
app.use(express.static('public'));

// Create or connect to SQLite database
const db = new sqlite3.Database('./SmiteDB.db');

// Middleware to parse JSON
app.use(express.json());

// Route to handle GET request to fetch data from the database
app.get('/api/data', (req, res) => {
  db.all('SELECT * FROM Gods', [], (err, rows) => {
    if (err) {
      res.status(500).json({error: err.message});
      return;
    }
    res.json({
      message: "success",
      data: rows
    });
  });
});

// Route to handle POST request to insert data into the database of a basic DB.
/*app.post('/api/data', (req, res) => {
  const { name, age } = req.body;
  const sql = 'INSERT INTO myTable (name, age) VALUES (?, ?)';
  const params = [name, age];
  
  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({error: err.message});
      return;
    }
    res.json({
      message: "success",
      data: { id: this.lastID }
    });
  });
});*/

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
