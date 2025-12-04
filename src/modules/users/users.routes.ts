import express from "express";
import { userControllers } from "./users.controller";

const router = express.Router();

router.get("/", userControllers.getAllUsers);
router.put("/:userId", userControllers.updateSingleUser);

export const userRoutes = router;
