import { Request, Response } from "express";
import { bookingServices } from "./bookings.service";
import { pool } from "../../config/db";

const createBooking = async (req: Request, res: Response) => {
  try {
    const start = new Date(req.body.rent_start_date as string);
    const end = new Date(req.body.rent_end_date as string);
    const msInDay = 1000 * 60 * 60 * 24;
    const number_of_days = Math.ceil(
      (end.getTime() - start.getTime()) / msInDay
    );

    const vehicle = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
      req.body.vehicle_id,
    ]);
    if (vehicle.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }
    const vehicle_info = vehicle.rows[0];
    if (vehicle_info.availability_status !== "available") {
      throw new Error("Vehicle is not available");
    }
    const daily_price = vehicle_info.daily_rent_price;
    const total_price = number_of_days * daily_price;
    const result = await bookingServices.createBooking(req.body, total_price);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        ...result.rows[0],
        vehicle: {
          vehicle_name: vehicle_info.vehicle_name,
          daily_rent_price: vehicle_info.daily_rent_price,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const bookingControllers = {
  createBooking,
};
