import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
    // Creating a more robust transporter for Gmail
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Use SSL
        auth: {
            user: "engqusaykhudair@gmail.com",
            pass: "sthl ttcu svwv kldg" // Your App Password
        },
        tls: {
            rejectUnauthorized: false // Helps in some cloud environments
        }
    });

    const mailOptions = {
        from: `"Saraha App" <engqusaykhudair@gmail.com>`,
        to,
        subject,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error("❌ Nodemailer Error:", error.message);
        // Throw the error so the user sees it in the Frontend Toast
        throw new Error(`Email failed: ${error.message}`);
    }
};