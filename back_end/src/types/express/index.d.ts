import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: number;
        role?: string;
      };
      file?: Express.Multer.File;
    }
  }
}
