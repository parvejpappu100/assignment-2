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
    const daily_price = vehicle_info.daily_rent_price;
    const total_price = number_of_days * daily_price;
    if (vehicle_info.availability_status !== "available") {
      res.status(404).json({
        success: false,
        message: "Vehicle is not available",
      });
    } else {
      const result = await bookingServices.createBooking(req.body, total_price);
      const status = "booked";
      const updateStatus = await pool.query(
        `UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *`,
        [status, vehicle_info.id]
      );
      res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: {
          ...result.rows[0],
          vehicle: {
            vehicle_name: updateStatus.rows[0].vehicle_name,
            daily_rent_price: updateStatus.rows[0].daily_rent_price,
          },
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.getAllBookings();
    res.status(200).json({
      success: true,
      message:
        result.rows.length === 0
          ? "No booking found"
          : "Bookings retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const bookingControllers = {
  createBooking,
  getAllBookings,
};
