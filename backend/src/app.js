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

const allowedOrigins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    `http://localhost:${PORT}`,
    `http://127.0.0.1:${PORT}`
];

if (process.env.FRONTEND_URL) {
    const origins = process.env.FRONTEND_URL
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

    allowedOrigins.push(...origins);
}

app.use(
    cors({
        origin: function (origin, callback) {

            // Allow requests without an Origin
            // such as server-to-server requests.
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(
                new Error("Not allowed by CORS")
            );
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
        ]
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