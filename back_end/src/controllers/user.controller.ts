import { Request, Response } from 'express';
import { CreateUserDTO } from '../types/user.types';
import { UserService } from '../services/UserService';

const userService = new UserService();

export const createUser = async (req: Request, res: Response) => {
	const data = req.body as CreateUserDTO;
	const user = await userService.create(data);
	res.status(201).json(user);
};

export const updateUser = async (req: Request, res: Response) => {
	try {
		const userId = req.params.id; // récupère l'ID depuis l'URL
		const updatedUser = await userService.update(userId, req.body);
		return res.status(200).json(updatedUser);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
	}
};
