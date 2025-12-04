import { Pool } from "pg";
import config from ".";

// * DB:
export const pool = new Pool({
  connectionString: config.connection_str,
  ssl: { rejectUnauthorized: false },
});

const initDB = async () => {
  await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE
                CONSTRAINT email_lowercase CHECK (email = LOWER(email)),
                password VARCHAR(255) NOT NULL
                CONSTRAINT password_min_length CHECK (LENGTH(password) >= 6),
                phone VARCHAR(20) NOT NULL,
                role VARCHAR(20) NOT NULL
            )
        `);
};

export default initDB;
