const mongoose = require("mongoose");

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DB_PASSWORD);

const connectDB = async () => {
  const connect = await mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(`DB connected at ${connect.connection.host}`);
};

module.exports = connectDB;