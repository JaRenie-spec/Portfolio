import { Request, Response } from "express";
import {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
	findAuthorByPseudo,
  findAuthorByEmail,
  findAuthorsByBookTitle
} from "../services/author.service";
import { CreateAuthorDTO } from "../types/author";

// 🔹 POST /authors
export const createAuthorHandler = async (req: Request, res: Response) => {
  try {
    const data: CreateAuthorDTO = req.body;
    const newAuthor = await createAuthor(data);
    res.status(201).json({ success: true, data: newAuthor });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔹 GET /authors
export const getAllAuthorsHandler = async (_req: Request, res: Response) => {
  try {
    const authors = await getAllAuthors();
    res.status(200).json({ success: true, data: authors });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔹 GET /authors/:id
export const getAuthorByIdHandler = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const author = await getAuthorById(id);
    res.status(200).json({ success: true, data: author });
  } catch (err) {
    const status = err.message === "Auteur non trouvé." ? 404 : 500;
    res.status(status).json({ success: false, error: err.message });
  }
};

// 🔹 PUT /authors/:id
export const updateAuthorHandler = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updatedAuthor = await updateAuthor(id, req.body);
    res.status(200).json({ success: true, data: updatedAuthor });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔹 DELETE /authors/:id
export const deleteAuthorHandler = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteAuthor(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
// 🔹 GET /authors/pseudo/:pseudo
export const findAuthorByPseudoHandler = async (req: Request, res: Response) => {
  try {
    const author = await findAuthorByPseudo(req.params.pseudo);
    if (!author) {
      return res.status(404).json({ success: false, error: "Auteur non trouvé." });
    }
    res.status(200).json({ success: true, data: author });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔹 GET /authors/email/:email
export const findAuthorByEmailHandler = async (req: Request, res: Response) => {
  try {
    const author = await findAuthorByEmail(req.params.email);
    if (!author) {
      return res.status(404).json({ success: false, error: "Auteur non trouvé." });
    }
    res.status(200).json({ success: true, data: author });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔹 GET /authors/book?title=mot-cle
export const findAuthorsByBookTitleHandler = async (req: Request, res: Response) => {
  try {
    const { title } = req.query;
    if (!title || typeof title !== "string") {
      return res.status(400).json({ success: false, error: "Paramètre title manquant." });
    }
    const authors = await findAuthorsByBookTitle(title);
    res.status(200).json({ success: true, data: authors });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
