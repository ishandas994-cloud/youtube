const mongoose = require("mongoose");
const seedDatabase = require("./seed");

mongoose.connect(process.env.MONGO_URL)
.then(() => {
  console.log("MongoDB Connected ✅");
})
.catch((err) => console.log("Mongo Error:", err));