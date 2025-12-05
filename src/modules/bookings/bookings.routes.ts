import express from "express";
import { bookingControllers } from "./bookings.controller";

const router = express.Router();

router.post("/", bookingControllers.createBooking)


export const bookingRoutes = router;