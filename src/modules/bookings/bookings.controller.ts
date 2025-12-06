import { Request, Response } from "express";
import { bookingServices } from "./bookings.service";
import { pool } from "../../config/db";
import { JwtPayload } from "jsonwebtoken";

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
    await bookingServices.returnStatusAuto();

    const result = await bookingServices.getAllBookings(req.user as JwtPayload);
    const isAdmin = req.user?.role === "admin";

    const formatted = result.rows.map((row) => {
      return {
        id: row.id,
        customer_id: row.customer_id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date,
        rent_end_date: row.rent_end_date,
        total_price: row.total_price,
        status: row.status,
        ...(isAdmin && {
          customer: {
            name: row.customer_name,
            email: row.customer_email,
          },
        }),
        vehicle: {
          vehicle_name: row.vehicle_name,
          registration_number: row.registration_number,
        },
      };
    });

    res.status(200).json({
      success: true,
      message:
        result.rows.length === 0
          ? "No booking found"
          : req.user?.role === "customer"
          ? "Your bookings retrieved successfully."
          : "Bookings retrieved successfully.",
      data: formatted,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBookingStatus = async (req: Request, res: Response) => {
  const id = req.params.bookingId;
  const user = req.user as JwtPayload;
  const status = req.body.status;
  try {
    const result = await bookingServices.updateBookingStatus(
      id as string,
      status,
      user
    );

    if (!result || result.result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message:
          result.result.rows.length === 0
            ? "No booking found"
            : req.user?.role === "customer"
            ? "Booking cancelled successfully."
            : "Booking marked as returned. Vehicle is now available.",
        data:
          user.role === "admin"
            ? {
                ...result.result.rows[0],
                vehicle: {
                  availability_status:
                    result.updateStatus.rows[0].availability_status,
                },
              }
            : result.result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const bookingControllers = {
  createBooking,
  getAllBookings,
  updateBookingStatus,
};
