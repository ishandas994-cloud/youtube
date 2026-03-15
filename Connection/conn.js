const mongoose = require("mongoose");
const seedDatabase = require("./seed");

const mongoUri = process.env.MONGO_URL;
if (!mongoUri) {
  console.error("MongoDB connection URI is missing. Please set MONGO_URL in .env.");
  process.exit(1);
}

console.log("Connecting to MongoDB at:", mongoUri);

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("MongoDB Connected ✅");
  })
  .catch((err) => console.log("Mongo Error:", err));