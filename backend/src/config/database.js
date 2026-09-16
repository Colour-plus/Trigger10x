const { Pool } = require("pg");
const path = require("path");
const dotenv = require("dotenv");

// Always load the .env file from the backend root
dotenv.config({
    path: path.resolve(__dirname, "../../.env")
});

// Check that the database URL exists
if (!process.env.DATABASE_URL) {
    throw new Error(
        "DATABASE_URL is missing. Check your backend/.env file."
    );
}

console.log("Database configuration loaded.");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

    ssl:
        process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: false }
            : false
});

pool.on("error", (err) => {
    console.error("PostgreSQL pool error:", err);
});

module.exports = pool;