const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const enquiryRoutes = require("./routes/enquiryRoutes");
const { errorHandler } = require("./middleware/errorHandler");


/*
==================================================
CREATE EXPRESS APPLICATION
==================================================
*/

const app = express();

// Trust reverse proxy headers when deployed behind Render, Railway, AWS, Cloudflare, etc.
app.set("trust proxy", 1);


/*
==================================================
SECURITY
==================================================
*/

app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false
    })
);


/*
==================================================
CORS
==================================================
*/

const PORT = Number(process.env.PORT) || 5000;

// Helper to extract clean hostname (e.g., "example.com" from "https://www.example.com:443")
const extractHostname = (urlStr) => {
    try {
        const u = new URL(urlStr.startsWith("http") ? urlStr : `https://${urlStr}`);
        return u.hostname.replace(/^www\./i, "").toLowerCase();
    } catch {
        return urlStr.replace(/^https?:\/\//i, "").replace(/^www\./i, "").split("/")[0].split(":")[0].toLowerCase();
    }
};

const allowedOrigins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    `http://localhost:${PORT}`,
    `http://127.0.0.1:${PORT}`
];

const allowedHostnames = new Set(["localhost", "127.0.0.1"]);

if (process.env.FRONTEND_URL) {
    const rawList = process.env.FRONTEND_URL
        .split(",")
        .map((origin) => origin.trim().replace(/\/$/, ""))
        .filter(Boolean);

    for (const raw of rawList) {
        if (raw === "*") {
            allowedOrigins.push("*");
            allowedHostnames.add("*");
            continue;
        }

        // Add exact raw format
        allowedOrigins.push(raw);
        // Add protocol variants
        if (raw.startsWith("http://")) {
            allowedOrigins.push(raw.replace(/^http:\/\//i, "https://"));
        } else if (raw.startsWith("https://")) {
            allowedOrigins.push(raw.replace(/^https:\/\//i, "http://"));
        }

        // Add both www and non-www variants
        const host = extractHostname(raw);
        if (host) {
            allowedHostnames.add(host);
            allowedOrigins.push(
                `https://${host}`,
                `http://${host}`,
                `https://www.${host}`,
                `http://www.${host}`
            );
        }
    }
}

app.use(
    cors({
        origin: function (origin, callback) {
            // 1. Allow requests without an Origin (same-origin, server-to-server, curl)
            if (!origin) {
                return callback(null, true);
            }

            // 2. Allow if wildcard is configured or if FRONTEND_URL is not provided
            if (
                allowedOrigins.includes("*") ||
                allowedHostnames.has("*") ||
                !process.env.FRONTEND_URL
            ) {
                return callback(null, true);
            }

            const cleanOrigin = origin.replace(/\/$/, "");
            const host = extractHostname(cleanOrigin);

            // 3. Match exact origin, www variant, or hostname
            if (
                allowedOrigins.includes(cleanOrigin) ||
                allowedHostnames.has(host)
            ) {
                return callback(null, true);
            }

            // 4. Public enquiry form: permit with a friendly notice instead of fatal server error
            console.warn(`[CORS Notice] Origin ${origin} submitted an enquiry. Permitted. Consider adding ${origin} to FRONTEND_URL in .env`);
            return callback(null, true);
        },

        methods: [
            "GET",
            "POST",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],

        allowedHeaders: [
            "Content-Type",
            "x-admin-key"
        ],

        credentials: true
    })
);


/*
==================================================
BODY PARSER
==================================================
*/

app.use(
    express.json({
        limit: "100kb"
    })
);


/*
==================================================
RATE LIMITING
==================================================
*/

const apiLimiter = rateLimit({

    windowMs:
        15 * 60 * 1000,

    max: 100,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
        success: false,
        message:
            "Too many requests. Please try again later."
    }
});

app.use(
    "/api",
    apiLimiter
);


/*
==================================================
HEALTH CHECK
==================================================
*/

app.get(
    "/api/health",
    (req, res) => {

        res.status(200).json({
            success: true,
            status: "OK",
            service: "TRIGGER10X API"
        });

    }
);


/*
==================================================
API ROUTES
==================================================
*/

app.use(
    "/api/enquiries",
    enquiryRoutes
);


/*
==================================================
SERVE FRONTEND STATIC FILES & ROUTES
==================================================
*/

const frontendPath =
    path.join(__dirname, "..", "..", "frontend");

app.use(
    express.static(frontendPath)
);

// Explicit route for Privacy Policy page
app.get(
    "/privacy-policy",
    (req, res) => {
        res.sendFile(
            path.join(frontendPath, "privacy-policy.html")
        );
    }
);


/*
==================================================
404 / SPA FALLBACK
==================================================
*/

app.use(
    (req, res) => {

        // API routes → JSON 404
        if (req.path.startsWith("/api")) {

            return res.status(404).json({

                success: false,

                message:
                    "The requested resource was not found."

            });

        }

        // Everything else → serve the frontend index
        res.sendFile(
            path.join(frontendPath, "index.html")
        );

    }
);


/*
==================================================
GLOBAL ERROR HANDLER
==================================================
*/

app.use(errorHandler);


/*
==================================================
EXPORT
==================================================
*/

module.exports = app;