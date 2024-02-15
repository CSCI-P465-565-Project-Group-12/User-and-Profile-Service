import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { createUser, updateUser } from "../db/users-db";
import { createProfile } from "../db/profiles-db";
import { createSecurity } from "../db/security-db";
import dotenv from "dotenv"; 
import { v4 as uuidv4 } from "uuid";
import { Client } from "@duosecurity/duo_universal";
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
		console.log("hashedPassword and trying to write sign-up logic here", hashedPassword);
		const user = await createUser({ id, email, username, password: hashedPassword, role, is_verified: false });
		// await createProfile({
		//   profile_id: 'generate-uuid-here', // Use a UUID generator
		//   user_id: user.id,
		//   first_name: firstName,
		//   last_name: lastName,
		//   contact_number: contactNumber,
		//   bio: '',
		// });

		// Initialize Duo 2FA setup
		// console.log('Duo 2FA setup', apiHost, clientId, clientSecret, redirectUrl, process.env.DUO_CLIENT_ID)
		try{
			await duoClient.healthCheck();
			const state = duoClient.generateState();
			req.session.duo = { state, username };
			const url = duoClient.createAuthUrl(username, state);
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
	const state = query.state;
	const savedState = session.duo?.state;
	const savedUsername = session.duo?.username ?? "";
	req.session.destroy((err) => {
		if (err) {
			console.error("Error destroying session:", err);
			res.status(500).json({ message: "An error occurred while destroying session." });
		} else {
			res.send("Session destroyed successfully");
		}
	});
	try {
		const updatedUser = await updateUser(savedUsername, { is_verified: true });
		const decodedToken = await duoClient.exchangeAuthorizationCodeFor2FAResult(
			duo_code,
			savedUsername
		);
		res.status(201).json({ message: JSON.stringify(decodedToken, null, "\t") });
	} catch (err) {
		console.error(err);
	}
};
