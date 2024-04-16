import express, { Express } from "express";
import cors from "cors";

import router from "./routes";
import session from "express-session";
import { createClient } from 'redis';
import connectRedis from 'connect-redis';

import dotenv from "dotenv";
import { Client } from "@duosecurity/duo_universal";

dotenv.config();




declare module "express-session" {
  interface SessionData {
    duo?: { state: string; username: string };
  }
}



const app: Express = express();
const port: number = 8080;

export const redisClient = createClient({
	password: process.env.REDIS_PASSWORD as string,
	legacyMode:false,
	socket: {
		timeout: 10000,
		host: process.env.REDIS_HOST as string,
		port: process.env.REDIS_PORT as unknown as number
	}
});
export const clientHost = process.env.CLIENT_HOST as string;
export const venueOwnerClientHost = process.env.VENUE_OWNER_CLIENT_HOST as string;
const apiHost = process.env.DUO_API_HOST as string;
const clientId= process.env.DUO_CLIENT_ID as string;
const clientSecret = process.env.DUO_CLIENT_SECRET as string;
const redirectUrl = process.env.REDIRECT_URL as string;
export const jwtSecret = process.env.JWT_PRIVATE_SECRET as string;
export const duoClient = new Client({ clientId, clientSecret, apiHost, redirectUrl });

redisClient.connect();
redisClient.on("connect", ()=>{
	console.log("connected to redis");
});
app.use(express.json());
app.use(express.urlencoded({
	extended: true,
}));

app.use(session({
	store:new connectRedis({client:redisClient}),
	secret: "super-secret-phrase",
	resave: false,
	saveUninitialized: false,
	cookie:{
		maxAge: 600000
	}
}));

app.use(cors());

app.use(router);

app.listen(port, (): void => {
	console.log(`Server is running: ${port}`);
});
