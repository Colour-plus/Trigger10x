const pool = require("../config/database");

const {
    sendEnquiryNotification
} = require("../services/emailService");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


/*
==================================================
CREATE ENQUIRY
==================================================
*/

exports.createEnquiry = async (req, res, next) => {

    try {

        const {
            name,
            company,
            phone,
            email,
            subject,
            message
        } = req.body;


        /*
        ==============================
        VALIDATION
        ==============================
        */

        if (
            !name ||
            !phone ||
            !email ||
            !subject
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please complete all required fields."

            });

        }


        if (
            !emailRegex.test(
                String(email).trim()
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter a valid email address."

            });

        }


        if (
            String(name).trim().length > 150 ||
            String(subject).trim().length > 200
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "One or more fields are too long."

            });

        }


        /*
        ==============================
        SAVE ENQUIRY TO POSTGRESQL
        ==============================
        */

        const result = await pool.query(

            `
            INSERT INTO enquiries
            (
                name,
                company,
                phone,
                email,
                subject,
                message
            )

            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6
            )

            RETURNING *
            `,

            [

                String(name).trim(),

                company
                    ? String(company).trim()
                    : null,

                String(phone).trim(),

                String(email)
                    .trim()
                    .toLowerCase(),

                String(subject).trim(),

                message
                    ? String(message).trim()
                    : null

            ]

        );


        /*
        ==============================
        GET SAVED ENQUIRY
        ==============================
        */

        const enquiry = result.rows[0];


        /*
        ==============================
        SEND ADMIN EMAIL
        ==============================

        Important:

        If email fails, the enquiry
        remains safely saved in
        PostgreSQL.
        */

        try {

            await sendEnquiryNotification(
                enquiry
            );

        } catch (emailError) {

            console.error(
                `[EMAIL] Notification failed for enquiry #${enquiry.id}:`,
                emailError
            );

        }


        /*
        ==============================
        SUCCESS RESPONSE
        ==============================
        */

        return res.status(201).json({

            success: true,

            message:
                "Your enquiry has been submitted successfully.",

            enquiry: {

                id:
                    enquiry.id,

                created_at:
                    enquiry.created_at

            }

        });


    } catch (err) {

        next(err);

    }

};


/*
==================================================
GET ALL ENQUIRIES
==================================================
*/

exports.getEnquiries = async (
    req,
    res,
    next
) => {

    try {

        const result = await pool.query(

            `
            SELECT *
            FROM enquiries
            ORDER BY created_at DESC
            `

        );


        res.json({

            success: true,

            enquiries:
                result.rows

        });


    } catch (error) {

        next(error);

    }

};


/*
==================================================
GET SINGLE ENQUIRY
==================================================
*/

exports.getEnquiryById = async (
    req,
    res,
    next
) => {

    try {

        const result = await pool.query(

            `
            SELECT *
            FROM enquiries
            WHERE id = $1
            `,

            [req.params.id]

        );


        if (
            !result.rows.length
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Enquiry not found."

            });

        }


        res.json({

            success: true,

            enquiry:
                result.rows[0]

        });


    } catch (error) {

        next(error);

    }

};


/*
==================================================
UPDATE ENQUIRY STATUS
==================================================
*/

exports.updateEnquiryStatus = async (
    req,
    res,
    next
) => {

    try {

        const allowedStatuses = [

            "NEW",

            "CONTACTED",

            "IN_PROGRESS",

            "CLOSED"

        ];


        if (
            !allowedStatuses.includes(
                req.body.status
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid enquiry status."

            });

        }


        const result = await pool.query(

            `
            UPDATE enquiries

            SET
                status = $1,
                updated_at =
                    CURRENT_TIMESTAMP

            WHERE id = $2

            RETURNING *
            `,

            [

                req.body.status,

                req.params.id

            ]

        );


        if (
            !result.rows.length
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Enquiry not found."

            });

        }


        res.json({

            success: true,

            message:
                "Enquiry status updated.",

            enquiry:
                result.rows[0]

        });


    } catch (error) {

        next(error);

    }

};


/*
==================================================
DELETE ENQUIRY
==================================================
*/

exports.deleteEnquiry = async (
    req,
    res,
    next
) => {

    try {

        const result = await pool.query(

            `
            DELETE FROM enquiries
            WHERE id = $1
            RETURNING id
            `,

            [req.params.id]

        );


        if (
            !result.rows.length
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Enquiry not found."

            });

        }


        res.json({

            success: true,

            message:
                "Enquiry deleted successfully."

        });


    } catch (error) {

        next(error);

    }

};