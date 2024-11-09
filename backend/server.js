const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'social_media_db',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});

app.post('/signup', (req, res) => {
  const { email, password } = req.body;
  const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      res.status(500).send('Error signing up');
    } else {
      res.status(200).send('User registered');
    }
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
app.put('/updateUser', (req, res) => {
  const { email, password, newEmail, newPassword } = req.body;
  const query = 'UPDATE users SET email = ?, password = ? WHERE email = ? AND password = ?';
  db.query(query, [newEmail, newPassword, email, password], (err, results) => {
    if (err) {
      res.status(500).send('Error updating user');
    } else if (results.affectedRows > 0) {
      res.status(200).send('User updated successfully');
    } else {
      res.status(404).send('User not found');
    }
  });
});

app.delete('/deleteUser', (req, res) => {
  const { email, password } = req.body;
  const query = 'DELETE FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      res.status(500).send('Error deleting user');
    } else if (results.affectedRows > 0) {
      res.status(200).send('User deleted successfully');
    } else {
      res.status(404).send('User not found');
    }
  });
});

app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error fetching users');
    } else {
      res.status(200).json(results);
    }
  });
});