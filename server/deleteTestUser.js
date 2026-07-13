import mongoose from "mongoose";

async function deleteTestUser() {
  try {
    const MONGO_URI =
      process.env.MONGODB_URI ||
      "mongodb+srv://dbuser:Password.123@ncs.6bqd9k0.mongodb.net/?retryWrites=true&w=majority";
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Delete user with the test email
    const result = await mongoose.connection.collection("users").deleteOne({
      email: "ali.siddiquidm760@gmail.com",
    });

    console.log(
      `Deleted ${result.deletedCount} user(s) with email ali.siddiquidm760@gmail.com`,
    );
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

deleteTestUser();
