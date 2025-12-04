import express from "express";
import { userControllers } from "./users.controller";

const router = express.Router();

router.get("/", userControllers.getAllUsers);

export const userRoutes = router;
