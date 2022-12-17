const mongoose = require("mongoose");
const connectDb = async () => {
  try {
    const conn = mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // if (process.env.NODE_ENV === "development")
    console.log(`MongoDB Connected ${(await conn).connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDb;
