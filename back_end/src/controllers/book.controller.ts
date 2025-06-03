import { Request, Response } from 'express';
import { getAllBooks } from '../services/book.service';

export async function getBooks(req: Request, res: Response) {
  const books = await getAllBooks();
  res.json(books);
}
