import { ENV } from "./env.js";
import mongoose from 'mongoose';



export const ConnectDB = async () => {
    try {
        const { MONGO_URI } = ENV;

        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("Error in DB connection", error);
        process.exit(1);
    }
}