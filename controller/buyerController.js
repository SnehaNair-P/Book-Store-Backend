import Book from "../model/bookSchema.js";
import Wishlist from "../model/wishlistSchema.js";
import mongoose from "mongoose";
import User from "../model/userSchema.js";

const { ObjectId } = mongoose.Types;

// ===================== ADD TO WISHLIST =====================
export const addToWishlist = async (req, res) => {
  const userId = req.user._id; 
  const { bookId } = req.params;

  if (!ObjectId.isValid(bookId)) {
    return res.status(400).json({ success: false, message: "Invalid book ID" });
  }

  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });

    const existing = await Wishlist.findOne({ userID: userId, bookID: bookId });
    if (existing) return res.status(400).json({ success: false, message: "Book already in wishlist" });

    const newWishlistItem = await Wishlist.create({ userID: userId, bookID: bookId });

    res.status(200).json({ success: true, message: "Book added to wishlist", wishlist: newWishlistItem });
  } catch (error) {
    console.error("Wishlist Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===================== VIEW WISHLIST =====================
export const getWishlist = async (req, res) => {
  const userId = req.user._id; 

  try {
    if (req.user.role !== "buyer") {
      return res.status(403).json({ success: false, message: "Only buyers have wishlist" });
    }

    const wishlistItems = await Wishlist.find({ userID: userId }).populate("bookID");
    res.status(200).json({ success: true, wishlist: wishlistItems });
  } catch (error) {
    console.error("Wishlist Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===================== REMOVE FROM WISHLIST =====================
export const removeFromWishlist = async (req, res) => {
  const userId = req.user._id; 
  const { bookId } = req.params;

  try {
    if (req.user.role !== "buyer") {
      return res.status(403).json({ success: false, message: "Only buyers can remove from wishlist" });
    }

    const deletedItem = await Wishlist.findOneAndDelete({ userID: userId, bookID: bookId });

    if (!deletedItem) {
      return res.status(404).json({ success: false, message: "Wishlist item not found" });
    }

    res.status(200).json({ success: true, message: "Book removed from wishlist" });
  } catch (error) {
    console.error("Remove Wishlist Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// ===================== ADD TO CART =====================

export const addToCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { bookId } = req.params;
    const quantity = Number(req.body.quantity) || 1;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!mongoose.Types.ObjectId.isValid(bookId))
      return res.status(400).json({ message: "Invalid book ID" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (!Array.isArray(user.cart)) user.cart = [];

    const cartItem = user.cart.find(item => item.book.toString() === bookId);

    if (cartItem) {
      cartItem.quantity = quantity; // ✅ set quantity explicitly
    } else {
      user.cart.push({ book: bookId, quantity });
    }

    await user.save();

    return res.status(200).json({ message: "Cart updated", cart: user.cart });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    return res.status(500).json({ message: "Server error while updating cart" });
  }
};





// ===================== GET CART =====================
export const getCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).populate("cart.book");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ cart: user.cart });
  } catch (error) {
    console.error("Get Cart Error:", error.message);
    return res.status(500).json({ message: "Server error while fetching cart" });
  }
};

// ===================== REMOVE FROM CART =====================
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { bookId } = req.params;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!mongoose.Types.ObjectId.isValid(bookId))
      return res.status(400).json({ message: "Invalid book ID" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove broken items
    user.cart = user.cart.filter(item => item.book);

    const cartItemIndex = user.cart.findIndex(item => item.book.toString() === bookId);
    if (cartItemIndex === -1) {
      return res.status(404).json({ message: "Book not in cart" });
    }

    user.cart.splice(cartItemIndex, 1);
    await user.save();

    return res.status(200).json({ message: "Book removed from cart successfully" });
  } catch (error) {
    console.error("Remove from Cart Error:", error);
    return res.status(500).json({ message: "Server error while removing from cart" });
  }
};
