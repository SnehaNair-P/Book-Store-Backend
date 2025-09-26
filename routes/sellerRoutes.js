// routes/sellerRoutes.js
import express from "express";
import { addBook, getBooksBySeller, getBookById, deleteBook, updateBook } from "../controller/sellerController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Add a new book
router.post("/add", authMiddleware, upload.single("image"), addBook);

// Update a book
router.put("/:bookId", authMiddleware, upload.single("image"), updateBook);

// Get all books by seller
router.get("/:sellerId", getBooksBySeller);

// **New: Get single book by ID**
router.get("/book/:bookId", getBookById);

// Delete a book
router.delete("/:bookId", authMiddleware, deleteBook);

export default router;
