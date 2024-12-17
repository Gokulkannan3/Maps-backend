const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    user: 'avnadmin',
    password: 'AVNS_5W135YZrjuwuLR-WHt5',
    host: 'mysql-39af648c-gokul.a.aivencloud.com',
    database: 'Map',
    port: '11941'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
  console.log('connected');
});

app.post('/location', (req, res) => {
    const { latitude, longitude, id = 1 } = req.body;
    if (latitude && longitude) {
      const query = 'UPDATE location SET latitude = ?, longitude = ? WHERE id = ?';
      db.query(query, [latitude, longitude, id], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Internal server error', error: err.message });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Location not found to update' });
        }
        res.status(200).json({ message: 'Location updated successfully', results });
      });
    } else {
      res.status(400).json({ message: 'Latitude and longitude are required' });
    }
  });
  

app.get('/getlocation', (req, res) => {
  const query = 'SELECT latitude, longitude FROM location ORDER BY id DESC LIMIT 1';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ message: 'Location not found' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
