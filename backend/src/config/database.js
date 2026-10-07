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

// Check if database runs on the same VPS / machine (localhost or 127.0.0.1)
const isLocalDb =
    process.env.DATABASE_URL.includes("localhost") ||
    process.env.DATABASE_URL.includes("127.0.0.1");

// Safe SSL decision:
// 1. Explicit DB_SSL setting always takes precedence ("true" or "false")
// 2. If running against a local database on the same VPS, NEVER force SSL (local PostgreSQL refuses SSL)
// 3. If running against a remote cloud database in production, enable SSL unless explicitly disabled
const useSsl =
    process.env.DB_SSL !== undefined
        ? String(process.env.DB_SSL).toLowerCase() === "true"
        : (!isLocalDb && process.env.NODE_ENV === "production" && !process.env.DATABASE_URL.includes("sslmode=disable"));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: useSsl ? { rejectUnauthorized: false } : false
});

pool.on("error", (err) => {
    console.error("PostgreSQL pool error:", err);
});

module.exports = pool;