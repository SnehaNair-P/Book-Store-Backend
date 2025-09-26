import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbConnect = () =>{
    mongoose.connect(process.env.mongodbURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); 
  });
};


export default dbConnect