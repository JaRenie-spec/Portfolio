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

/**
 * @openapi
 * /api/books:
 *   post:
 *     summary: Crée un nouveau livre
 *     tags:
 *       - Books
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - isbn
 *               - price
 *               - authorId
 *             properties:
 *               title:
 *                 type: string
 *               isbn:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *               fileUrl:
 *                 type: string
 *               authorId:
 *                 type: string
 *                 format: uuid
 *               createdByAdminId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Livre créé
 */
router.post(
  "/",
  requireRole(["admin", "author"]),
  validateCreateBook,
  createBookHandler
);

/**
 * @openapi
 * /api/books:
 *   get:
 *     summary: Récupère tous les livres
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: Liste des livres
 */
router.get("/", getAllBooksHandler);

/**
 * @openapi
 * /api/books/search:
 *   get:
 *     summary: Recherche des livres par titre
 *     tags:
 *       - Books
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Résultats de la recherche
 */
router.get("/search", searchBooksByTitleHandler);

/**
 * @openapi
 * /api/books/author/{authorId}:
 *   get:
 *     summary: Recherche des livres par auteur
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Livres de l’auteur
 */
router.get("/author/:authorId", searchBooksByAuthorHandler);

/**
 * @openapi
 * /api/books/{id}:
 *   get:
 *     summary: Récupère un livre par ID
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Livre trouvé
 */
router.get("/:id", getBookByIdHandler);

/**
 * @openapi
 * /api/books/{id}:
 *   put:
 *     summary: Met à jour un livre
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               isbn:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *               fileUrl:
 *                 type: string
 *               authorId:
 *                 type: string
 *                 format: uuid
 *               createdByAdminId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Livre mis à jour
 */
router.put(
  "/:id",
  requireRole(["admin", "author"]),
  validateUpdateBook,
  updateBookHandler
);

/**
 * @openapi
 * /api/books/{id}:
 *   delete:
 *     summary: Supprime un livre
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Livre supprimé
 */
router.delete("/:id", requireRole(["admin"]), deleteBookHandler);

/**
 * @openapi
 * /api/books/{id}/upload:
 *   post:
 *     summary: Upload un fichier pour un livre
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Fichier uploadé
 */
router.post(
  "/:id/upload",
  requireRole(["admin", "author"]),
  upload.single("file"),
  uploadBookFileHandler
);

export default router;
