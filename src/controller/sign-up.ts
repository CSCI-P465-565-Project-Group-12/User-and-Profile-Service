import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { createUser, updateUser } from "../db/users-db";
import { duoAuthUrlCreater } from "../helpers/duoAuthUrlCreater";
import dotenv from "dotenv"; 
import { v4 as uuidv4 } from "uuid";
import { redisClient, clientHost, duoClient, jwtSecret } from "../app";
import jwt from "jsonwebtoken";
dotenv.config();


/**
 * /signup
 * @param req 
 * @param res 
 */
export const signUp = async (req:Request, res:Response) => {
	const { email, username, password, role} = req.body;
	const id = uuidv4();
	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await createUser({ id, email, username, password: hashedPassword, role, is_verified: false });
		try{
			const url = await duoAuthUrlCreater(username);
			res.status(302).json({ url });
		}
		catch (error) {
			console.error(error);
			res.status(500).json({ message: error });
		}
	} catch (error) {
		console.error("Signup error:", error);
		res.status(500).json({ message: "An error occurred during registration." });
	}
};

export const redirect = async (req:Request, res:Response) => {
	const { query, session } = req;
	const duo_code = query.duo_code as string || "";
	const state = query.state as string || "";
	const redisData = await redisClient.hGetAll(state);
	const savedUsername = redisData.username;
	await redisClient.del(state);
	req.session.destroy((err) => {
		if (err) {
			console.error("Error destroying session:", err);
			console.log("Error destroying session:", err);
			
		} else {
			console.log("Session destroyed successfully");
		}
	});
	try {
		const updatedUser = await updateUser(savedUsername, { is_verified: true });
		const decodedToken = await duoClient.exchangeAuthorizationCodeFor2FAResult(
			duo_code,
			savedUsername
		);
		console.log("decodedToken", decodedToken);
		 // User is authenticated, generate a JWT token
		const token = jwt.sign(
			{ savedUsername }, // Payload data
			jwtSecret, // Secret key
			{ expiresIn: '1h' } // Token expiration time
		);
		const redirectUrl = clientHost+"/?token="+token;//Need to change this to the actual redirect url
		res.redirect(redirectUrl);
		
	} catch (err) {
		console.error(err);
	}
};
