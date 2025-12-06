import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

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

const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);
  if (result.rows.length === 0) {
    throw new Error("User not found.");
  }

  const user = result.rows[0];
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    throw new Error("Invalid");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };

  const secret = config.jwt_secret as string;

  const token = jwt.sign(jwtPayload, secret, {
    expiresIn: "7d",
  });
  delete user.password;
  return { token, user };
};

export const authServices = {
  createUser,
  loginUser,
};
