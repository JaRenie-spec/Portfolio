import { Router } from "express";
import {
  createAuthorHandler,
  getAllAuthorsHandler,
  getAuthorByIdHandler,
  updateAuthorHandler,
  deleteAuthorHandler,
  findAuthorByPseudoHandler,
  findAuthorByEmailHandler,
  findAuthorsByBookTitleHandler,
} from "../controllers/author.controller";
import {
  validateCreateAuthor,
  validateUpdateAuthor,
} from "../middlewares/author.validator";
import { requireRole } from "../middlewares/requireRole";

const router = Router();

router.post("/", requireRole(["admin"]), validateCreateAuthor, createAuthorHandler);

router.get("/", getAllAuthorsHandler);
router.get("/search/book", findAuthorsByBookTitleHandler);
router.get("/pseudo/:pseudo", findAuthorByPseudoHandler);
router.get("/email/:email", findAuthorByEmailHandler);
router.get("/:id", getAuthorByIdHandler);

router.put("/:id", requireRole(['admin']), validateUpdateAuthor, updateAuthorHandler);

router.delete("/:id", requireRole(['admin']), deleteAuthorHandler);

export default router;
