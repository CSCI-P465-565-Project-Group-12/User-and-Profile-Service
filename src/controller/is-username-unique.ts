import { Request, Response, NextFunction } from "express";
import { getUser, getUserById } from "../db/users-db";


// Route to check if a username exists
export const isUsernameUnique = async (req:Request, res:Response) => {
	const { username } = req.query || ""; // Using query parameters for simplicity
	if (!username) {
		return res.status(400).json({ message: "Please provide a username." });
	}
	try {
		const user = await getUser(username.toString());
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

export const getUserReq = async (req: Request, res: Response) => {
	const { userId } = req.params;
	try {
		const user = await getUserById(userId);
		res.status(200).json(user);
	} catch (error) {
		console.error("Get user error:", error);
		res.status(500).json({ message: "An error occurred during user retrieval." });
	}
};