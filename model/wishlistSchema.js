import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  bookID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",  
    required: true
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",   
    required: true
  }
});

const Wishlist = mongoose.model("Wishlist", WishlistSchema);

export default Wishlist;
