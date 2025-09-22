const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    deadline: { type: Date, required: true },
    importance: { type: String, enum: ["low", "medium", "high"], required: true },
  },
  { timestamps: true }
);

todoSchema.virtual("daysLeft").get(function () {
  if (!this.deadline) return undefined;
  const today = new Date();
  const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dueLocal = new Date(this.deadline.getFullYear(), this.deadline.getMonth(), this.deadline.getDate());
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((dueLocal - todayLocal) / msPerDay);
});

todoSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("Todo", todoSchema);
