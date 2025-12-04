import express, { Request, Response } from "express";
import { authRoutes } from "./modules/auth/auth.routes";
import initDB from "./config/db";
import { userRoutes } from "./modules/users/users.routes";
const app = express();

// * parser
app.use(express.json());
app.use(express.urlencoded());

// * initializing db:
initDB();

// * Routes:
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running....");
});

export default app;
