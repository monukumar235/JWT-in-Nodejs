import mongoose from "mongoose";

const connectToDb = async ()=>{
    try {
        await mongoose.connect("mongodb://localhost:27017/jwtdemo");
        console.log("Connected to server.....");
    } catch (error) {
        console.log("error while connecting to server...",error);
    }
}

export default connectToDb;