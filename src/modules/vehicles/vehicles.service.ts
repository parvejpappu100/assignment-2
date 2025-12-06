import { pool } from "../../config/db";

const createVehicle = async (payLoad: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    daily_rent_price,
    availability_status,
    registration_number,
  } = payLoad;
  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, daily_rent_price, availability_status, registration_number) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [
      vehicle_name,
      type,
      daily_rent_price,
      availability_status,
      registration_number,
    ]
  );
  return result;
};

const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result;
};

const getSingleVehicle = async (id: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
  return result;
};

const updateVehicle = async (payLoad: Record<string, unknown>, id: string) => {
  const {
    vehicle_name,
    type,
    daily_rent_price,
    availability_status,
    registration_number,
  } = payLoad;

  const result = pool.query(
    `UPDATE vehicles SET vehicle_name=$1, type=$2, daily_rent_price=$3, availability_status=$4, registration_number=$5 WHERE id=$6 RETURNING *`,
    [
      vehicle_name,
      type,
      daily_rent_price,
      availability_status,
      registration_number,
      id,
    ]
  );
  return result;
};

const deleteVehicle = async (id: string) => {

  const bookingCheck = await pool.query(
    `SELECT * FROM bookings WHERE vehicle_id=$1 AND status='active'`,
    [id]
  );
  if (bookingCheck.rows.length > 0) {
    throw new Error("Vehicle cannot be deleted because they have active bookings");
  }

  const result = await pool.query(`DELETE FROM vehicles WHERE id=$1`, [id]);
  return result;
};

export const vehicleServices = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
