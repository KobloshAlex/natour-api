const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const connectDB = require("../../utils/dbconnect");
const fs = require("fs");
const Tour = require("../../models/Tour");

connectDB();

const tours = JSON.parse(fs.readFileSync(`${__dirname}\\tours-simple.json`, "utf-8"));

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data was loaded");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data was deleted");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
