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
import { requireRole } from "../middlewares/requireRole";

const router = Router();

/**
 * @openapi
 * /api/authors:
 *   post:
 *     summary: Créer un auteur
 *     tags:
 *       - Authors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - pseudo
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jean
 *               lastName:
 *                 type: string
 *                 example: Dupont
 *               pseudo:
 *                 type: string
 *                 example: jdupont
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jean.dupont@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: motdepasse123
 *               bio:
 *                 type: string
 *                 maxLength: 2000
 *                 example: Auteur de romans policiers.
 *     responses:
 *       201:
 *         description: Auteur créé avec succès
 */
router.post("/", createAuthorHandler);

/**
 * @openapi
 * /api/authors:
 *   get:
 *     summary: Obtenir la liste de tous les auteurs
 *     tags:
 *       - Authors
 *     responses:
 *       200:
 *         description: Liste des auteurs
 */
router.get("/", getAllAuthorsHandler);

/**
 * @openapi
 * /api/authors/search/book:
 *   get:
 *     summary: Rechercher des auteurs par titre de livre
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: query
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: Le titre du livre à rechercher
 *     responses:
 *       200:
 *         description: Auteurs trouvés
 */
router.get("/search/book", findAuthorsByBookTitleHandler);

/**
 * @openapi
 * /api/authors/pseudo/{pseudo}:
 *   get:
 *     summary: Trouver un auteur par pseudo
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: pseudo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Auteur trouvé
 */
router.get("/pseudo/:pseudo", findAuthorByPseudoHandler);

/**
 * @openapi
 * /api/authors/email/{email}:
 *   get:
 *     summary: Trouver un auteur par email
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Auteur trouvé
 */
router.get("/email/:email", findAuthorByEmailHandler);

/**
 * @openapi
 * /api/authors/{id}:
 *   get:
 *     summary: Obtenir un auteur par ID
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Auteur trouvé
 */
router.get("/:id", getAuthorByIdHandler);

/**
 * @openapi
 * /api/authors/{id}:
 *   put:
 *     summary: Mettre à jour un auteur
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jean
 *               lastName:
 *                 type: string
 *                 example: Dupont
 *               pseudo:
 *                 type: string
 *                 example: jdupont
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               bio:
 *                 type: string
 *               createdByAdminId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Auteur mis à jour
 */
router.put("/:id", requireRole(["admin"]), updateAuthorHandler);

/**
 * @openapi
 * /api/authors/{id}:
 *   delete:
 *     summary: Supprimer un auteur
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Auteur supprimé
 */
router.delete("/:id", requireRole(["admin"]), deleteAuthorHandler);

export default router;
