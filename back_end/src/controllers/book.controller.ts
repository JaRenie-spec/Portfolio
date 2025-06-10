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

export const createBookHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const book = await createBook(req.body);
    res.status(201).json({ success: true, data: book });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getAllBooksHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const minPrice = req.query.minPrice
      ? Number(req.query.minPrice)
      : undefined;
    const maxPrice = req.query.maxPrice
      ? Number(req.query.maxPrice)
      : undefined;
    const minRating = req.query.minRating
      ? Number(req.query.minRating)
      : undefined;

    const books = await getAllBooks({
      page,
      limit,
      minPrice,
      maxPrice,
      minRating,
    });
    res.status(200).json({ success: true, data: books });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getBookByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const book = await getBookById(id);
    res.status(200).json({ success: true, data: book });
  } catch (err: any) {
    const status = err.message === "Livre non trouvé" ? 404 : 500;
    res.status(status).json({ success: false, error: err.message });
  }
};

export const updateBookHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const book = await updateBook(id, req.body);
    res.status(200).json({ success: true, data: book });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteBookHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await deleteBook(id);
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const searchBooksByTitleHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const title = String(req.query.title || "");
    const books = await searchBooksByTitle(title);
    res.status(200).json({ success: true, data: books });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const searchBooksByAuthorHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authorId = Number(req.params.authorId);
    const books = await searchBooksByAuthor(authorId);
    res.status(200).json({ success: true, data: books });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const uploadBookFileHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!req.file) {
      res.status(400).json({ success: false, error: "Aucun fichier uploadé." });
      return;
    }
    const filePath = path.join("/uploads", req.file.filename);
    const updated = await updateBookFileUrl(id, filePath);
    res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
