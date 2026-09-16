require("dotenv").config();

const app = require("./app");
const pool = require("./config/database");

/*
==================================================
SERVER CONFIGURATION
==================================================
*/

const PORT =
    Number(process.env.PORT) || 5000;


/*
==================================================
START SERVER
==================================================
*/

const server = app.listen(
    PORT,
    () => {

        console.log(
            `TRIGGER10X backend running on http://localhost:${PORT}`
        );

    }
);


/*
==================================================
GRACEFUL SHUTDOWN
==================================================
*/

const shutdown = async (signal) => {

    console.log(
        `\n${signal} received. Shutting down gracefully...`
    );

    server.close(
        async () => {

            try {

                await pool.end();

                console.log(
                    "PostgreSQL connection pool closed."
                );

                process.exit(0);

            } catch (error) {

                console.error(
                    "Error while closing PostgreSQL pool:",
                    error
                );

                process.exit(1);

            }

        }
    );

};


/*
==================================================
PROCESS SIGNALS
==================================================
*/

process.on(
    "SIGTERM",
    () => shutdown("SIGTERM")
);

process.on(
    "SIGINT",
    () => shutdown("SIGINT")
);


/*
==================================================
UNHANDLED ERRORS
==================================================
*/

process.on(
    "uncaughtException",
    (error) => {

        console.error(
            "UNCAUGHT EXCEPTION:",
            error
        );

        shutdown("uncaughtException");

    }
);


process.on(
    "unhandledRejection",
    (error) => {

        console.error(
            "UNHANDLED REJECTION:",
            error
        );

        shutdown("unhandledRejection");

    }
);