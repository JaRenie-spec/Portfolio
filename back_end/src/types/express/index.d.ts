import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: string;
        role?: string;
      };
      file?: Express.Multer.File;
    }
  }
}
