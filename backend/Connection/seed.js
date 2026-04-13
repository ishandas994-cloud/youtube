const User = require("../Models/user");
const Video = require("../Models/video");
const bcrypt = require("bcrypt");

const seedDatabase = async () => {
  try {
    console.log("Refreshing demo data...");

    // 🔥 Clear old demo data
    await Video.deleteMany({});
    await User.deleteMany({ userName: "naturechannel" });

    // Hash dummy password
    const hashedPassword = await bcrypt.hash("demo123", 10);

    // ✅ Create demo channel
    const demoUser = await User.create({
      channelName: "Nature Channel",
      userName: "naturechannel",
      password: hashedPassword,
      about: "Wildlife and Nature Videos",
      profilePic:
        "https://res.cloudinary.com/duxonqe5o/image/upload/v1771352210/cld-sample-5.jpg",
    });

    const thumbnails = [
      "https://res.cloudinary.com/duxonqe5o/image/upload/v1771352210/main-sample.png",
      "https://res.cloudinary.com/duxonqe5o/image/upload/v1771352210/cld-sample-4.jpg",
      "https://res.cloudinary.com/duxonqe5o/image/upload/v1771352209/cld-sample-2.jpg",
      "https://res.cloudinary.com/duxonqe5o/image/upload/v1771352202/samples/breakfast.jpg",
      "https://res.cloudinary.com/duxonqe5o/image/upload/v1771352206/samples/coffee.jpg",
    ];

    const titles = [
      "Beautiful Elephants in Nature",
      "Wildlife Safari Adventure",
      "Amazing Nature Documentary",
      "Elephants Walking in Forest",
      "Relaxing Nature Cinematic Video",
    ];

    // ✅ Create 5 videos
    for (let i = 0; i < 5; i++) {
      await Video.create({
        user: demoUser._id,
        title: titles[i],
        description: "Enjoy this amazing nature video.",
        videoLink:
          "https://res.cloudinary.com/duxonqe5o/video/upload/v1771434803/ibtmddvtc4ow5ab0xizn.mp4",
        thumbnail: thumbnails[i],
        videoType: "All",
        like: Math.floor(Math.random() * 500),
        dislike: Math.floor(Math.random() * 20),
      });
    }

    console.log("5 Demo videos inserted successfully 🚀");

  } catch (error) {
    console.log("Seed Error:", error);
  }
};

module.exports = seedDatabase;