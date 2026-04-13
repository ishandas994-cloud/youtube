const mongoose = require("mongoose");

const mongoUri = process.env.MONGO_URL;

if (!mongoUri) {
  console.error("FATAL ERROR: MONGO_URL is missing");
  process.exit(1);
}

console.log("Connecting to MongoDB at:", mongoUri);

mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });