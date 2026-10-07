const { Pool } = require("pg");
const path = require("path");
const dotenv = require("dotenv");

// Load .env from both backend/.env and root .env (without overwriting system env)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

let pool;

if (process.env.DATABASE_URL) {
    console.log("Database configuration loaded.");

    // Check if database runs on the same VPS / machine (localhost or 127.0.0.1)
    const isLocalDb =
        process.env.DATABASE_URL.includes("localhost") ||
        process.env.DATABASE_URL.includes("127.0.0.1");

    // Safe SSL decision
    const useSsl =
        process.env.DB_SSL !== undefined
            ? String(process.env.DB_SSL).toLowerCase() === "true"
            : (!isLocalDb && process.env.NODE_ENV === "production" && !process.env.DATABASE_URL.includes("sslmode=disable"));

    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: useSsl ? { rejectUnauthorized: false } : false
    });

    pool.on("error", (err) => {
        console.error("PostgreSQL pool error:", err);
    });

    // Auto-initialize table schema if not already present
    const initDbSchema = async () => {
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS enquiries (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(150) NOT NULL,
                    company VARCHAR(200),
                    phone VARCHAR(30) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    subject VARCHAR(200) NOT NULL,
                    message TEXT,
                    status VARCHAR(30) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW','CONTACTED','IN_PROGRESS','CLOSED')),
                    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
                );
                CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at DESC);
                CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
            `);
            console.log("PostgreSQL schema verified: enquiries table is ready.");
        } catch (err) {
            console.warn("PostgreSQL schema notice:", err.message);
        }
    };

    initDbSchema();
} else {
    console.warn("⚠️ WARNING: DATABASE_URL is missing. Please set DATABASE_URL in Hostinger Environment Variables.");
    pool = {
        query: async () => {
            throw new Error("DATABASE_URL is missing on the server. Please add DATABASE_URL in your Hostinger Web App Environment Variables.");
        },
        end: async () => {}
    };
}

module.exports = pool;