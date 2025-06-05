import { Request, Response } from "express";
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  searchBooksByTitle,
  updateBookFileUrl,
  searchBooksByAuthor,
} from "../services/book.service";
import path from "path";

export const createBookHandler = async (req: Request, res: Response) => {
  try {
    const book = await createBook(req.body);
    res.status(201).json({ success: true, data: book });
  } catch (err) {
    console.error("Erreur création livre:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getAllBooksHandler = async (_req: Request, res: Response) => {
  try {
    const books = await getAllBooks();
    res.status(200).json({ success: true, data: books });
  } catch (err) {
    console.error("Erreur récupération livres:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getBookByIdHandler = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const book = await getBookById(id);
    res.status(200).json({ success: true, data: book });
  } catch (err) {
    const status = err.message === "Livre non trouvé" ? 404 : 500;
    res.status(status).json({ success: false, error: err.message });
  }
};

export const updateBookHandler = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const book = await updateBook(id, req.body);
    res.status(200).json({ success: true, data: book });
  } catch (err) {
    console.error("Erreur mise à jour livre:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteBookHandler = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteBook(id);
    res.status(204).send();
  } catch (err) {
    console.error("Erreur suppression livre:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const searchBooksByTitleHandler = async (req: Request, res: Response) => {
  try {
    const title = req.query.title as string;
    const books = await searchBooksByTitle(title);
    res.status(200).json({ success: true, data: books });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const searchBooksByAuthorHandler = async (req: Request, res: Response) => {
  try {
    const authorId = parseInt(req.params.authorId);
    const books = await searchBooksByAuthor(authorId);
    res.status(200).json({ success: true, data: books });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const uploadBookFileHandler = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const filePath = path.join("/uploads", req.file.filename);
    const updated = await updateBookFileUrl(id, filePath);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("Erreur upload fichier:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
