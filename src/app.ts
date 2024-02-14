import express, { Express } from "express";
import cors from "cors";

// Assuming approutes is properly typed in its own TypeScript file
import router from "./routes";
import session from "express-session";

declare module "express-session" {
  interface SessionData {
    duo?: { state: string; username: string };
  }
}

const app: Express = express();
const port: number = 8080;

app.use(express.json());
app.use(express.urlencoded({
	extended: true,
}));
app.use(session({
	secret: "super-secret-phrase",
	resave: false,
	saveUninitialized: true
}));

app.use(cors());

app.use(router);

app.listen(port, (): void => {
	console.log(`Server is running: ${port}`);
});
