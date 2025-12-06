import { pool } from "../../config/db";

const createBooking = async (
  playLoad: Record<string, unknown>,
  total_price: number
) => {
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

const getAllBookings = async (payload: Record<string, any>) => {
  const baseQuery = `
    SELECT 
      b.*,
      v.vehicle_name,
      v.type,
      v.registration_number,
      v.daily_rent_price
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
  `;

  if (payload.role === "admin") {
    const result =  await pool.query(baseQuery);
    return result;
  } else {
    const result =  await pool.query(baseQuery + " WHERE b.customer_id=$1", [
      payload.id,
    ]);
    return result;
  }
};

export const bookingServices = {
  createBooking,
  getAllBookings,
};
