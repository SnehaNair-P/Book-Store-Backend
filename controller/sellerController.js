import Book from "../model/bookSchema.js";
import mongoose from "mongoose";


// 1. Add book
export const addBook = async (req, res) => {
  try {
    const { title, genre, author, price, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newBook = new Book({
      title,
      genre,
      author,
      price,
      description,
      seller: req.user._id, // from authMiddleware
      image: req.file ? `/uploads/${req.file.filename}` : null, // 👈 save file path if uploaded
    });

    await newBook.save();

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      book: newBook,
    });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ success: false, message: "Failed to add book" });
  }
};


//getBooksBySeller
export const getBooksBySeller = async (req, res) => {
  const { sellerId } = req.params;
  console.log("Received sellerId:", sellerId);

  if (!mongoose.Types.ObjectId.isValid(sellerId)) {
    return res.status(400).json({ message: "Invalid seller ID" });
  }

  try {
    console.log("Querying books for seller:", sellerId);
    const books = await Book.find({ seller: sellerId });
    console.log("Found books:", books);

    if (!books || books.length === 0) {
      return res.status(404).json({ message: "No books found for this seller" });
    }

    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching seller's books:", error);
    res.status(500).json({ message: "Failed to fetch seller's books" });
  }
};



// 3. Delete a book 
export const deleteBook = async (req, res) => {
  const { bookId } = req.params;

  try {
    await Book.findByIdAndDelete(bookId);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Failed to delete book" });
  }
};


// 4. Update a book by ID
export const updateBook = async (req, res) => {
  const { bookId } = req.params;

  try {
    // Build update object
    const updates = {
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      description: req.body.description,
    };

    // if a new image was uploaded
    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    const updatedBook = await Book.findByIdAndUpdate(bookId, updates, { new: true });

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ message: "Failed to update book" });
  }
};


// **New: Get single book by ID**
export const getBookById = async (req, res) => {
  const { bookId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ message: "Invalid book ID" });
  }

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    res.status(500).json({ message: "Failed to fetch book" });
  }
};
