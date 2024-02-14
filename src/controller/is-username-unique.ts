import { Request, Response, NextFunction } from "express";
import { checkUserNameAvailability } from "../db/users-db";


// Route to check if a username exists
export const isUsernameUnique = async (req:Request, res:Response) => {
	const { username } = req.query || ''; // Using query parameters for simplicity
	if (!username) {
		return res.status(400).json({ message: "Please provide a username." });
	}
	try {
		const user = await checkUserNameAvailability(username.toString());
		if (user) {
			res.json({ exists: false, message: "Username already exists." });
		} else {
			res.json({ exists: true, message: "Username is available." });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "An error occurred while checking the username." });
	}
};