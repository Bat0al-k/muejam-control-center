import "server-only";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 465),
    secure: process.env.MAIL_SECURE !== "false",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});

type VerificationEmailType =
    | "registration"
    | "password-reset";

export async function sendVerificationEmail(
    email: string,
    otp: string,
    type: VerificationEmailType = "registration"
) {
    if (
        !process.env.MAIL_HOST ||
        !process.env.MAIL_USER ||
        !process.env.MAIL_PASSWORD
    ) {
        throw new Error("Mail server configuration is missing.");
    }

    const currentYear = new Date().getFullYear();

    const emailTitle = type === "password-reset"
        ? "Reset your password"
        : "Verify your email";

    await transporter.sendMail({
        from: `"Muejam" <${process.env.MAIL_USER}>`,
        to: email,
        subject: emailTitle,
        text: `
${emailTitle}

${type === "password-reset"
                ? "You requested to reset your password. Use the code below to verify your identity."
                : "Thanks for signing up with Muejam."}

${type === "password-reset"
                ? "Enter the code below to verify your identity and reset your password:"
                : "Your verification code is:"}

${otp}

This code expires in 15 minutes.

If you didn't request this code, you can safely ignore this email.

© ${currentYear} Muejam
        `.trim(),

        html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    />
    <title>${emailTitle}</title>
</head>

<body
    style="
        margin: 0;
        padding: 0;
        background-color: #E5E5E5;
        font-family: 'Syne', sans-serif;
        color: #111111;
    "
>
    <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="
            background-color: #E5E5E5;
            padding: 48px 16px;
        "
    >
        <tr>
            <td align="center">

                <!-- Main Card -->
                <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="
                        max-width: 540px;
                        background-color: #FFFFFF;
                        border-radius: 18px;
                        overflow: hidden;
                        border: 1px solid rgba(217, 105, 72, 0.12);
                    "
                >

                    <!-- Brand Header -->
                    <tr>
                        <td
                            style="
                                padding: 30px 32px;
                                text-align: center;
                                border-bottom: 1px solid #F1F1F1;
                            "
                        >
                            <div
                                style="
                                    font-size: 28px;
                                    line-height: 1;
                                    font-weight: 700;
                                    letter-spacing: -0.8px;
                                    color: #111111;
                                "
                            >
                                Muejam
                            </div>

                            <div
                                style="
                                    margin-top: 8px;
                                    font-size: 18px;
                                    line-height: 1;
                                    font-weight: 700;
                                    letter-spacing: 1.8px;
                                    text-transform: uppercase;
                                    color: #E8785A;
                                "
                            >
                                Control Center
                            </div>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td
                            style="
                                padding: 44px 36px 40px;
                            "
                        >

                            <!-- Heading -->
                            <h1
                                style="
                                    margin: 0;
                                    text-align: center;
                                    font-size: 28px;
                                    line-height: 1.25;
                                    font-weight: 700;
                                    letter-spacing: -0.5px;
                                    color: #111111;
                                "
                            >
                                ${emailTitle}
                            </h1>

                            <!-- Description -->
                            <p
                                style="
                                    max-width: 410px;
                                    margin: 16px auto 0;
                                    text-align: center;
                                    font-size: 15px;
                                    line-height: 1.7;
                                    color: #6B6B6B;
                                "
                            >
                                ${type === "password-reset"
                ? "You requested to reset your password. Use the code below to verify your identity."
                : "Thanks for signing up with Muejam."}

                                ${type === "password-reset"
                ? "Enter the code below to verify your identity and reset your password:"
                : "Your verification code is:"}
                            </p>

                            <!-- OTP Box -->
                            <table
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                                style="
                                    margin-top: 32px;
                                "
                            >
                                <tr>
                                    <td
                                        align="center"
                                        style="
                                            padding: 25px 20px;
                                            background-color: #FDE8E1;
                                            border: 1px solid rgba(232, 120, 90, 0.18);
                                            border-radius: 14px;
                                        "
                                    >

                                        <div
                                            style="
                                                margin-bottom: 11px;
                                                font-size: 10px;
                                                line-height: 1;
                                                font-weight: 700;
                                                letter-spacing: 1.8px;
                                                text-transform: uppercase;
                                                color: #D96948;
                                            "
                                        >
                                            Verification code
                                        </div>

                                        <div
                                            style="
                                                font-size: 34px;
                                                line-height: 1.2;
                                                font-weight: 700;
                                                letter-spacing: 9px;
                                                color: #111111;
                                                padding-left: 9px;
                                            "
                                        >
                                            ${otp}
                                        </div>

                                    </td>
                                </tr>
                            </table>

                            <!-- Expiration -->
                            <p
                                style="
                                    margin: 18px 0 0;
                                    text-align: center;
                                    font-size: 13px;
                                    line-height: 1.6;
                                    color: #6B6B6B;
                                "
                            >
                                This code expires in
                                <strong style="color: #111111;">
                                    15 minutes
                                </strong>.
                            </p>

                            <!-- Security Notice -->
                            <table
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                                style="
                                    margin-top: 30px;
                                "
                            >
                                <tr>
                                    <td
                                        style="
                                            padding: 15px 17px;
                                            background-color: #FAFAFA;
                                            border-left: 3px solid #E8785A;
                                            border-radius: 4px;
                                        "
                                    >
                                        <p
                                            style="
                                                margin: 0;
                                                font-size: 12px;
                                                line-height: 1.65;
                                                color: #6B6B6B;
                                            "
                                        >
                                            If you didn't request this code,
                                            you can safely ignore this email.
                                            Never share your verification
                                            code with anyone.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td
                            style="
                                padding: 22px 32px;
                                background-color: #FAFAFA;
                                border-top: 1px solid #F1F1F1;
                                text-align: center;
                            "
                        >
                            <p
                                style="
                                    margin: 0;
                                    font-size: 11px;
                                    line-height: 1.6;
                                    color: #6B6B6B;
                                "
                            >
                                This is an automated message.
                                Please do not reply to this email.
                            </p>

                            <p
                                style="
                                    margin: 7px 0 0;
                                    font-size: 11px;
                                    color: #A0A0A0;
                                "
                            >
                                © ${currentYear} Muejam
                            </p>
                        </td>
                    </tr>

                </table>

                <!-- Small Brand Footer -->
                <p
                    style="
                        margin: 18px 0 0;
                        text-align: center;
                        font-size: 11px;
                        color: #9B7469;
                    "
                >
                    Muejam Control Center
                </p>

            </td>
        </tr>
    </table>
</body>
</html>
        `.trim(),
    });
}
