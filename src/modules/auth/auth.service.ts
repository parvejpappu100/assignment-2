import { pool } from "../../config/db";

const createUser = async (payLoad: Record<string, unknown>) => {
  const { name, email, password, role, phone } = payLoad;

  const result = await pool.query(
    `INSERT INTO users(name, email, password, role, phone) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, password, role, phone]
  );
  return result;
};

export const authServices = {
  createUser,
};
