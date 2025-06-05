import { Router } from "express";
import {
  createAuthorHandler,
  getAllAuthorsHandler,
  getAuthorByIdHandler,
  updateAuthorHandler,
  deleteAuthorHandler,
  findAuthorByPseudoHandler,
  findAuthorByEmailHandler,
  findAuthorsByBookTitleHandler
} from "../controllers/author.controller";

const router = Router();

router.post("/authors", createAuthorHandler);           // Créer un auteur
router.get("/authors", getAllAuthorsHandler);           // Lister tous les auteurs
router.get("/authors/:id", getAuthorByIdHandler);       // Obtenir un auteur par ID
router.put("/authors/:id", updateAuthorHandler);        // Mettre à jour un auteur
router.delete("/authors/:id", deleteAuthorHandler);     // Supprimer (soft) un auteur
// Recherche par pseudo
router.get("/authors/pseudo/:pseudo", findAuthorByPseudoHandler);
// Recherche par email
router.get("/authors/email/:email", findAuthorByEmailHandler);
// Recherche par titre de livre
router.get("/authors/book", findAuthorsByBookTitleHandler);


export default router;
