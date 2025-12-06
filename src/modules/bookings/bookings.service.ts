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

const returnStatusAuto = async () => {
  const now = new Date();
  const expiredBookings = await pool.query(
    `SELECT * FROM bookings 
     WHERE status='active' AND rent_end_date < $1`,
    [now]
  );

  if (expiredBookings.rows.length === 0) return;

  for (const booking of expiredBookings.rows) {
    await pool.query(
      `UPDATE bookings SET status='returned' WHERE id=$1`,
      [booking.id]
    );
    await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
      [booking.vehicle_id]
    );
  }
};


const getAllBookings = async (payload: Record<string, any>) => {
  const baseQuery = `
    SELECT 
      b.*,

      -- vehicle fields
      v.vehicle_name,
      v.type AS vehicle_type,
      v.registration_number,

      -- customer fields
      u.name AS customer_name,
      u.email AS customer_email

    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    JOIN users u ON b.customer_id = u.id
  `;

  if (payload.role === "admin") {
    const result = await pool.query(baseQuery);
    return result;
  } else {
    const result = await pool.query(baseQuery + " WHERE b.customer_id=$1", [
      payload.id,
    ]);
    return result;
  }
};

const updateBookingStatus = async (
  id: string,
  status: string,
  user: Record<string, unknown>
) => {
  const booking = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [id]);
  const rentStart = new Date(booking.rows[0].rent_start_date).getTime();
  const now = Date.now();
  if (
    user.role === "customer" &&
    booking.rows[0].customer_id == user.id &&
    rentStart > now
  ) {
    const result = await pool.query(
      `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
      [status, id]
    );
    if (result.rows.length !== 0) {
      const updateStatus = await pool.query(
        `UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING * `,
        ["available", booking.rows[0].vehicle_id]
      );
      return { result, updateStatus };
    }
  }
  if (user.role === "admin") {
    const result = await pool.query(
      `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
      [status, id]
    );
    if (result.rows.length !== 0) {
      const updateStatus = await pool.query(
        `UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING availability_status `,
        ["available", booking.rows[0].vehicle_id]
      );
      return { result, updateStatus };
    }
  }
};

export const bookingServices = {
  createBooking,
  getAllBookings,
  updateBookingStatus,
  returnStatusAuto,
};
