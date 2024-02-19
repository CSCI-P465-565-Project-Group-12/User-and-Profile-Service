import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { createUser, updateUser } from "../db/users-db";
import { createProfile } from "../db/profiles-db";
import { createSecurity } from "../db/security-db";
import dotenv from "dotenv"; 
import { v4 as uuidv4 } from "uuid";
import { Client } from "@duosecurity/duo_universal";
import { redisClient, clientHost } from "../app";
dotenv.config();


// Duo 2FA setup
const apiHost = process.env.DUO_API_HOST as string;
const clientId= process.env.DUO_CLIENT_ID as string;
const clientSecret = process.env.DUO_CLIENT_SECRET as string;
const redirectUrl = process.env.REDIRECT_URL as string;

const duoClient = new Client({ clientId, clientSecret, apiHost, redirectUrl });

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
			await duoClient.healthCheck();
			const state = duoClient.generateState();
			const url = duoClient.createAuthUrl(username, state);
			const duoState=state;
			await redisClient.hSet(duoState,{username});
			res.json({ url })
		}
		catch (error) {
			console.error(error);
			res.status(500).json({ message: error });
		}

		// res.status(201).json({ message: "User created successfully" });
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
			// res.status(500).json({ message: "An error occurred while destroying session." });
			console.log("Error destroying session:", err);
			
		} else {
			// res.send("Session destroyed successfully");
			console.log("Session destroyed successfully");
		}
	});
	try {
		// const updatedUser = await updateUser(savedUsername, { is_verified: true });
		const decodedToken = await duoClient.exchangeAuthorizationCodeFor2FAResult(
			duo_code,
			savedUsername
		);
		console.log("decodedToken", decodedToken);
		const redirectUrl = clientHost;
		res.redirect(redirectUrl);
		
	} catch (err) {
		console.error(err);
	}
};
