import "server-only";

import { randomInt } from "crypto";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/mailer";

const OTP_EXPIRATION_MINUTES = 15;

export type OtpContext = "registration" | "password-reset";

function generateOtp(): string {
    return randomInt(100000, 1000000).toString();
}

/**
 * Single entry point for all OTP flows:
 *
 * 1. Generate a 6-digit OTP
 * 2. Hash it with bcrypt
 * 3. Persist the hash via the caller-provided saveOtp callback
 * 4. Send the verification email
 *
 * The caller controls which DB table/mutation is used
 * by implementing the saveOtp callback.
 */
export async function generateAndSendOtp(
    email: string,
    context: OtpContext,
    saveOtp: (
        otpHash: string,
        otpExpiresAt: string
    ) => Promise<void>
): Promise<void> {
    const otp = generateOtp();

    const otpHash = await bcrypt.hash(otp, 10);

    const otpExpiresAt = new Date(
        Date.now() +
        OTP_EXPIRATION_MINUTES * 60 * 1000
    ).toISOString();

    await saveOtp(otpHash, otpExpiresAt);

    await sendVerificationEmail(
        email,
        otp,
        context
    );
}
