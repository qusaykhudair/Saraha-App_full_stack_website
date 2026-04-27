import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("❌ EMAIL_USER or EMAIL_PASS environment variables are missing!");
        return;
    }

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Define the email options
    const mailOptions = {
        from: `"Saraha App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    };

    // Send the email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email successfully sent to ${to}. MessageId: ${info.messageId}`);
    } catch (error) {
        console.error(`❌ Failed to send email to ${to}. Error: ${error.message}`);
        console.log(`[DEBUG] EMAIL_USER: ${process.env.EMAIL_USER}`);
        // console.log(`[DEBUG] EMAIL_PASS: ${process.env.EMAIL_PASS ? "****" : "MISSING"}`);
        console.log(`[DEVELOPMENT PROMPT] Since email failed, here is the content that was supposed to be sent:\n${html}`);
    }
};