import express, { Express } from "express";
import cors from "cors";

// Assuming approutes is properly typed in its own TypeScript file
import router from "./routes";
import session from "express-session";
import { createClient } from 'redis';
import dotenv from "dotenv";
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
    socket: {
        host: process.env.REDIS_HOST as string,
        port: process.env.REDIS_PORT as unknown as number
    }
});
export const clientHost = process.env.CLIENT_HOST as string;
redisClient.connect();
redisClient.on('connect', ()=>{
	console.log('connected to redis');
});
app.use(express.json());
app.use(express.urlencoded({
	extended: true,
}));

app.use(session({
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
