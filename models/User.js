const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  githubId: { type: String, unique: true, sparse: true }, // OAuth
  username: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
