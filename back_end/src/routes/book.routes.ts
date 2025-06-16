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
import { validateCreateBook, validateUpdateBook } from "../middlewares/book.validator";
import { requireRole } from "../middlewares/requireRole";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/",
  requireRole(["admin", "author"]),
  validateCreateBook,
  createBookHandler
);

router.get("/", getAllBooksHandler);
router.get("/search", searchBooksByTitleHandler);
router.get("/author/:authorId", searchBooksByAuthorHandler);
router.get("/:id", getBookByIdHandler);

router.put(
  "/:id",
  requireRole(["admin", "author"]),
  validateUpdateBook,
  updateBookHandler
);

router.delete("/:id", requireRole(["admin"]), deleteBookHandler);

router.post(
  "/:id/upload",
  requireRole(["admin", "author"]),
  upload.single("file"),
  uploadBookFileHandler
);

export default router;
