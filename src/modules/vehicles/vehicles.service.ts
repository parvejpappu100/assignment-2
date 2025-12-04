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

export const vehicleServices = {
  createVehicle,
  getAllVehicles,
};
