import { pool } from "../../config/db";

const getAllUsers = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

const getSingleUser = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
  return result;
};

const updateSingleUser = async (
  payLoad: Record<string, unknown>,
  id: string,
  user: Record<string, unknown>
) => {
  const { name, email, phone, role } = payLoad;
  if (user.role === "admin") {
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *`,
      [name, email, phone, role, id]
    );
    delete result.rows[0].password;
    return result;
  }
  if (user.role === "customer" && user.id == id) {
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2, phone=$3 WHERE id=$4 RETURNING *`,
      [name, email, phone, id]
    );
    delete result.rows[0].password;
    return result;
  }
  throw new Error("Unauthorized to update user");
};

const deleteUser = async (id: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
  return result;
};

export const userServices = {
  getAllUsers,
  updateSingleUser,
  deleteUser,
  getSingleUser,
};
