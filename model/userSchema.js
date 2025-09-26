import mongoose from "mongoose";

const userSchema =new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['buyer', 'seller'],
        required:true
    },
      wishlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book"
    }],
cart: [{
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  quantity: { type: Number, default: 1 }
}]

  },
  { timestamps: true })
const User = mongoose.model("User", userSchema);

export default User;