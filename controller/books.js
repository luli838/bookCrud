
import {Book} from "../model/mongoDB/book.js"

export const bookController = {
  async getAll(req, res) {
    const bookCollection = await Book.find();
    bookCollection
      ? res.status(200).json({
          success: true,
          message: "List of books",
          data: bookCollection,
        })
      : res
          .status(404)
          .json({ success: false, message: "Books database empty" });
  },
  async getByTitle(req, res) {
    const { title } = req.query;
    if (!title)
      res
        .status(400)
        .json({ success: false, message: "Missing 'title' query param" });
  
    try {
      const books = await Book.find({
        title: { $regex: title, $options: "i" },
      });
      if (!books.length) {
        return res.status(404).json({
          success: false,
          message: `No books with ${title}  in the title`,
        });
      }

      return res.status(200).json({
        success: true,
        message: "books by query title",
        data: books,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: `Internal Error: ${err.message}` });
    }
  },

  async createOne(req, res) {
    const { title, author, year, genre } = req.body;
    try {
      const newBook = new Book({
        title,
        author,
        year,
        genre,
      });
      const savedBook = await newBook.save();
      res
        .status(200)
        .json({ success: true, message: "Book created", data: savedBook });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async updateBook(req, res) {
    const allowedFields = [
      "title",
      "author",
      "year",
      "genre",
    ];
    try {
      const updates = Object.keys(req.body);
      const isValidOperation = updates.every((update) =>
        allowedFields.includes(update)
      );
      if (!isValidOperation) {
        return res.status(400).json({
          success: false,
          message: "Invalid field in the request body. Operation aborted.",
        });
      }

      const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!book) {
        return res.status(404).json({
          success: false,
          message: `Book Not Found`,
        });
      }
      res
        .status(200)
        .json({ success: true, message: "Book updated", data: book });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Internal Server Error ${error.message}`,
      });
    }
  },

  async deleteOne(req, res) {
    try {
      const book = await Book.findByIdAndDelete(req.params.id);
      if (!book) {
        return res.status(404).json({
          success: false,
          message: `Book Not Found`,
        });
      }
      res.send(200);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
