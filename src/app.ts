import express, { Request, Response } from "express";
import { authRoutes } from "./modules/auth/auth.routes";
import initDB from "./config/db";
const app = express();

// * parser
app.use(express.json());
app.use(express.urlencoded());

// * initializing db:
initDB();

// * Routes:
app.use("/api/v1/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running....");
});

export default app;
