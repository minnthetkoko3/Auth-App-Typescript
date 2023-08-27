import "dotenv/config";
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./routers";

const {PORT, MONGO_URI} = process.env;

const app = express();
const server = http.createServer(app);

app.use(cors({credentials: true}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.use('/api/v1', router());

const connectDB = async () => {
    try {
      // Set Mongoose to use global Promise
      mongoose.Promise = global.Promise;
  
      // Connect to MongoDB
      const conn = await mongoose.connect(MONGO_URI);
  
      console.log(`MongoDB Connected: ${conn.connection.host} || ${MONGO_URI}`);
  
      // Set up error handling
      mongoose.connection.on('error', (error: Error) => {
        console.error('MongoDB connection error:', error);
      });
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  };
  connectDB();

server.listen(PORT, () => {
    console.log(`server running at http://localhost:8080 : PORT:${PORT}`);
});

