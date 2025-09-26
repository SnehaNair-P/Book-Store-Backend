import express from "express";
import {addToWishlist, getWishlist, removeFromWishlist, addToCart, getCart, removeFromCart } from "../controller/buyerController.js";
import {getAllBooks} from '../controller/bookController.js';
import {  authMiddleware } from '../middleware/authMiddleware.js';
var router = express.Router();

router.get("/getAllBooks", getAllBooks);
router.post("/wishlist/:bookId", authMiddleware, addToWishlist);
router.get("/wishlist", authMiddleware, getWishlist);
router.delete("/wishlist/:bookId", authMiddleware, removeFromWishlist);

//cart
router.post("/cart/:bookId", authMiddleware, addToCart);
router.get("/cart", authMiddleware, getCart);
router.delete("/cart/:bookId", authMiddleware, removeFromCart);

export default router;
