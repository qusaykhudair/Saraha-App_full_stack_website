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
            user: "engqusaykhudair@gmail.com",
            pass: "sthl ttcu svwv kldg"
        }
    });

    // Define the email options
    const mailOptions = {
        from: `"Saraha App" <engqusaykhudair@gmail.com>`,
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
        console.log(`[DEBUG] EMAIL_USER: engqusaykhudair@gmail.com`);
        console.log(`[DEVELOPMENT PROMPT] Since email failed, here is the content that was supposed to be sent:\n${html}`);
    }
};