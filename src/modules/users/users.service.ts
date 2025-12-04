import { pool } from "../../config/db";

const getAllUsers = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

const updateSingleUser = async (
  payLoad: Record<string, unknown>,
  id: string
) => {
  const { name, email, phone, role } = payLoad;
  const result = await pool.query(
    `UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *`,
    [name, email, phone, role, id]
  );
  return result;
};

const deleteUser = async (id: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
  return result;
};

export const userServices = {
  getAllUsers,
  updateSingleUser,
  deleteUser,
};
