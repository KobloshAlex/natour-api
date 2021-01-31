const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const connectDB = require("./utils/dbconnect");

const app = require("./app");

connectDB();

const port = process.env.PORT;
app.listen(port, () => console.log(`App is running on port ${port}`));
