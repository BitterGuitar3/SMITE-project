// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Serve static files (HTML, CSS, JS) from the 'public' folder
app.use(express.static('public'));
app.use('/God_Images', express.static('God_Images'));

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

app.get('/api/gods/name_and_portrait', (req, res) => {
  db.all('SELECT name,ImgFilePath  FROM Gods', [], (err, rows) => {
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

app.get('/api/gods/:name', (req, res) => {
  const godName = req.params.name; // Get the god's name from the URL parameter

  db.get('Select * from Gods WHERE name = ?', [godName], (err, row) => {
    if(err) {
      return res.status(500).json({err: err.message});
    }
    if(!row) {
      return res.status(404).json({message: 'God not found'});
    }

    // Initialize an empty array to store the numerical values
    let valuesArray = [];

    // Loop through each column in the row and add it to the array if the value is a number
    for (const key in row) {
      if (typeof row[key] === 'number' && key !== 'ID') {
        valuesArray.push(row[key]);
      }
    }

    res.json ({
      message: 'success',
      data: valuesArray
    });
  });
});

//app.get('/api/gods/stats' , (req, res))

//updating image paths
app.put('/api/gods/updateImagePaths', (req, res) => {
  // Step 1: Fetch all entries
  db.all('SELECT Name FROM Gods', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Step 2: Prepare the update statement
    const sql = 'UPDATE Gods SET ImgFilePath = ? WHERE Name = ?';
    const stmt = db.prepare(sql);

    // Step 3: Loop through the rows and update the file paths
    rows.forEach(row => {
      const newPath = `/God_Images/${row.Name}.png`; // Construct new path
      stmt.run(newPath, row.Name, function(err) {
        if (err) {
          console.error('Error updating image path for', row.Name, err);
        }
      });
    });

    stmt.finalize(err => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Image paths updated successfully' });
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
