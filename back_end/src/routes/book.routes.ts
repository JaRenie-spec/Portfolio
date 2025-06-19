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
 *           example:
 *             title: "Le Petit Prince"
 *             isbn: "978-1234567890"
 *             price: 14.99
 *             description: "Un conte poétique pour petits et grands"
 *             rating: 4.8
 *             fileUrl: "http://example.com/le-petit-prince.pdf"
 *             authorId: "5f8f8c44-3a6b-4e91-8326-29b7a99e9d9d"
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
 *           example: "prince"
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
 *           example: "5f8f8c44-3a6b-4e91-8326-29b7a99e9d9d"
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
 *           example: "c2a6e5d0-44b1-46c5-83b4-90de3c1d4c3a"
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
 *           example: "c2a6e5d0-44b1-46c5-83b4-90de3c1d4c3a"
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
 *           example:
 *             title: "Le Petit Prince (édition mise à jour)"
 *             isbn: "978-1234567890"
 *             price: 16.99
 *             description: "Version révisée avec illustrations"
 *             rating: 5
 *             fileUrl: "http://example.com/le-petit-prince-new.pdf"
 *             authorId: "5f8f8c44-3a6b-4e91-8326-29b7a99e9d9d"
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
 *           example: "c2a6e5d0-44b1-46c5-83b4-90de3c1d4c3a"
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
 *           example: "c2a6e5d0-44b1-46c5-83b4-90de3c1d4c3a"
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
 *             required:
 *               - file
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
