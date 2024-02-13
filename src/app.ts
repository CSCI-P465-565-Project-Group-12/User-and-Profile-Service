import express, { Express, Request, Response } from "express";
// import cors from 'cors';

// Assuming approutes is properly typed in its own TypeScript file
// import approutes from './routes/approutes';

const app: Express = express();
const port: number = 8080;

app.use(express.json());
app.use(express.urlencoded({
	extended: true,
}));

// app.use(cors());

// app.use(approutes);

app.listen(port, (): void => {
	console.log(`Server is running: ${port}`);
});
