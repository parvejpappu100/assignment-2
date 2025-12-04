import express, { Request, Response } from "express";
const app = express();

// * parser
app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running....");
});

export default app;
