import express from "express";
import { userControllers } from "./users.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.get("/", auth("admin"), userControllers.getAllUsers);
router.get("/:userId", userControllers.getSingleUser);
router.put("/:userId",auth("admin", "customer"), userControllers.updateSingleUser);
router.delete("/:userId", auth("admin"), userControllers.deleteUser);

export const userRoutes = router;
