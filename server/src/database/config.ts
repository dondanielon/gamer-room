import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function databaseConnection() {
    try {
        mongoose.set("strictQuery", true);

        if (process.env.NODE_ENV === "test") {
            await mongoose.connect(process.env.MONGODB_URI!, {
                dbName: "gamer-room-testing",
            });
        } else {
            await mongoose.connect(process.env.MONGODB_URI!, {
                dbName: "gamer-room-development",
            });
        }
    } catch (error) {
        console.log(error);
        throw new Error("Error trying to connect to database");
    }
}
