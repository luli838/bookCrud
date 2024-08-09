import { Router } from "express";
export const router = Router();
import { bookController } from "../controller/books.js";
import { token } from "../services/jwt.js";
//router.get("/", token.validate, bookController.getAll);
router.get("/",  bookController.getAll);
router.get("/s", bookController.getByTitle);
router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.send(`List a book by id: ${id}`);
});
router.post("/", bookController.createOne);
router.patch("/:id", bookController.updateBook);
router.delete("/:id", bookController.deleteOne);
