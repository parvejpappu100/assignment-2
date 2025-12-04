import express from "express";
import { vehicleControllers } from "./vehicles.controller";

const router = express.Router();

router.post("/", vehicleControllers.createVehicle);
router.get("/", vehicleControllers.getAllVehicles);

export const vehicleRoutes = router;
