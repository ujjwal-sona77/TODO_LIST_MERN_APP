import app from "./app.js";
import http from "http";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/database.js";
connectDB();
const server = http.createServer(app);

server.listen(process.env.PORT, () => {
    console.log(`Server Started Correctly`);
});

export default server;

