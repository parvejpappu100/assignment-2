import { pool } from "../../config/db";

const createBooking = async (playLoad: Record<string, unknown>, total_price: number) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = playLoad;
  const status = "active";
  const result = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status,
    ]
  );
  return result;
};

export const bookingServices = {
  createBooking,
};
