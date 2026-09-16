const nodemailer = require("nodemailer");


/*
==================================================
CREATE EMAIL TRANSPORTER
==================================================
*/

const transporter = nodemailer.createTransport({

    host: process.env.SMTP_HOST,

    port: Number(
        process.env.SMTP_PORT || 465
    ),

    secure:
        String(
            process.env.SMTP_SECURE
        ).toLowerCase() === "true",

    auth: {

        user:
            process.env.SMTP_USER,

        pass:
            process.env.SMTP_PASS

    }

});


/*
==================================================
SEND ENQUIRY EMAIL
==================================================
*/

async function sendEnquiryNotification(
    enquiry
) {

    const enquiryDate =
        new Date(
            enquiry.created_at
        ).toLocaleString("en-IN");


    const mailSubject =
        `New TRIGGER10X Enquiry #${enquiry.id} — ${enquiry.subject}`;


    /*
    ==============================================
    EMAIL CONTENT
    ==============================================
    */

    const mailText = `

NEW TRIGGER10X WEBSITE ENQUIRY
========================================

Enquiry ID:
${enquiry.id}

Date:
${enquiryDate}


CUSTOMER DETAILS
========================================

Name:
${enquiry.name}

Company:
${enquiry.company || "-"}

Phone:
${enquiry.phone}

Email:
${enquiry.email}


ENQUIRY
========================================

Subject:
${enquiry.subject}


Message:
${enquiry.message || "-"}


Status:
${enquiry.status || "NEW"}

========================================
TRIGGER10X
Business Development & Business Enhancement
`;


    /*
    ==============================================
    SEND EMAIL
    ==============================================
    */

    const info =
        await transporter.sendMail({

            from:
                process.env.SMTP_FROM ||
                process.env.SMTP_USER,

            to:
                process.env.ADMIN_EMAIL,

            replyTo:
                enquiry.email,

            subject:
                mailSubject,

            text:
                mailText

        });


    console.log(
        `[EMAIL] Enquiry #${enquiry.id} sent successfully.`
    );


    console.log(
        `[EMAIL] Message ID: ${info.messageId}`
    );


    return info;

}


/*
==================================================
EXPORT
==================================================
*/

module.exports = {

    sendEnquiryNotification

};