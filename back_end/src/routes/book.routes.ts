import { Router } from "express";
import multer from "multer";
import {
  createBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookHandler,
  deleteBookHandler,
  searchBooksByTitleHandler,
  uploadBookFileHandler,
  searchBooksByAuthorHandler,
} from "../controllers/book.controller";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/", createBookHandler);
router.get("/", getAllBooksHandler);
router.get("/search", searchBooksByTitleHandler);
router.get("/author/:authorId", searchBooksByAuthorHandler);
router.get("/:id", getBookByIdHandler);
router.put("/:id", updateBookHandler);
router.delete("/:id", deleteBookHandler);
router.post("/:id/upload", upload.single("file"), uploadBookFileHandler);
