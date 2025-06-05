import { Request, Response } from 'express';
import { CreateUserDTO } from '../types/user.types';
import { UserService } from '../services/UserService';

const userService = new UserService();

export const createUser = async (req: Request, res: Response) => {
	const data = req.body as CreateUserDTO;
	const user = await userService.create(data);
	res.status(201).json(user);
};
