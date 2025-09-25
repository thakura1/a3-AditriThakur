require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo"); //For database sessions
const passport = require("passport");
const path = require("path");
const mongoose = require("mongoose");
require("./config/passport"); // GitHub

const app = express(); // Use express

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy when in production
if (process.env.NODE_ENV === "production" || process.env.TRUST_PROXY === "1") {
  app.set("trust proxy", 1);
}

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // true on Railway
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/todos", require("./routes/todos"));

// Auth check
app.get("/me", (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated())
    return res.json({ loggedIn: false });
  res.json({ loggedIn: true, username: req.user.username, id: req.user._id });
});

app.get("/app", (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) return res.redirect("/");
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res) => res.status(404).send("Not Found"));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

// MongoDB connection & start via Mongoose
const MONGO_URI = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);

async function startServer() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB :)");

    const port = process.env.PORT || 3000;
    app.listen(port, () =>
      console.log(`Server listening on http://localhost:${port}`)
    );
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

startServer();
