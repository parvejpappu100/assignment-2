import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

const createUser = async (payLoad: Record<string, unknown>) => {
  const { name, email, password, role, phone } = payLoad;

  const hashedPass = await bcrypt.hash(password as string, 12);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, role, phone) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, hashedPass, role, phone]
  );
  delete result.rows[0].password;
  return result;
};

export const authServices = {
  createUser,
};
