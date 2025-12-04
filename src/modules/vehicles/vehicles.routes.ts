import express from "express";
import { vehicleControllers } from "./vehicles.controller";

const router = express.Router();

router.post("/", vehicleControllers.createVehicle);
router.get("/", vehicleControllers.getAllVehicles);
router.get("/:vehicleId", vehicleControllers.getSingleVehicle);
router.put("/:vehicleId", vehicleControllers.updateVehicle);


export const vehicleRoutes = router;
