const nodemailer = require("nodemailer");


/*
==================================================
CREATE EMAIL TRANSPORTER
==================================================
*/

const cleanPass = String(process.env.SMTP_PASS || "").replace(/\s+/g, "");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === "true" || Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: cleanPass
    }
});


/*
==================================================
VERIFY EMAIL CONFIGURATION
==================================================
*/

async function verifyEmailConfig() {
    try {
        await transporter.verify();
        console.log("[EMAIL] ✅ SMTP verified successfully. Connected to " + process.env.SMTP_USER);
        return true;
    } catch (err) {
        console.warn(`[EMAIL] ⚠️ Gmail SMTP authentication failed (${err.message}).`);
        console.warn("[EMAIL] 💡 Enquiries will still be saved in PostgreSQL. To enable emails, generate a 16-character App Password at https://myaccount.google.com/apppasswords and update SMTP_PASS in backend/.env.");
        return false;
    }
}


/*
==================================================
SEND ENQUIRY EMAIL
==================================================
*/

async function sendEnquiryNotification(enquiry) {
    const enquiryDate = new Date(enquiry.created_at).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata"
    });

    const mailSubject = `New TRIGGER10X Enquiry #${enquiry.id} — ${enquiry.subject}`;

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

    const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.ADMIN_EMAIL,
        replyTo: enquiry.email,
        subject: mailSubject,
        text: mailText
    });

    console.log(`[EMAIL] Enquiry #${enquiry.id} sent successfully.`);
    console.log(`[EMAIL] Message ID: ${info.messageId}`);
    return info;
}


module.exports = {
    sendEnquiryNotification,
    verifyEmailConfig
};