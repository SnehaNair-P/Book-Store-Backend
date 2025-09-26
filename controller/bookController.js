import Book from "../model/bookSchema.js";

// // 1. Get all books


export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ seller: { $ne: null } }) 
      .populate({
        path: "seller",
        select: "name email",
        options: { lean: true }, 
      });

    res.status(200).json({ success: true, books });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch books",
      error: error.message,
    });
  }
};




 