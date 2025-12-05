import express from "express";
import { bookingControllers } from "./bookings.controller";

const router = express.Router();

router.post("/", bookingControllers.createBooking);
router.get("/", bookingControllers.getAllBookings);

export const bookingRoutes = router;
