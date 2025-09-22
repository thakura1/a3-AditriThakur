require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const mongoose = require('mongoose');
require('./config/passport'); // GitHub

const app = express(); // Use express

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'please-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, //false on localhost
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/todos', require('./routes/todos'));

// Auth check
app.get('/me', (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) return res.json({ loggedIn: false });
  res.json({ loggedIn: true, username: req.user.username, id: req.user._id });
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) return res.redirect('/login');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.use((req, res) => res.status(404).send('Not Found'));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// MongoDB connection & start via Mongoose
const MONGO_URI = process.env.MONGODB_URI;
mongoose.set('strictQuery', false);

async function startServer() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB :)');

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}

startServer();