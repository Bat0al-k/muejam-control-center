"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const router = useRouter();

    return (
        <>
            <div>
                <h1 className="auth-heading">Forgot your<br />password?</h1>
                <p className="auth-subtext">
                    Enter the email address associated with your account and
                    we&apos;ll send you a verification code.
                </p>
            </div>

            <div className="auth-fields">
                <div className="auth-field">
                    <label className="auth-label" htmlFor="fp-email">Email Address</label>
                    <input
                        id="fp-email"
                        className="auth-input"
                        type="email"
                        placeholder="alex@company.com"
                        autoComplete="email"
                    />
                </div>
            </div>

            <button
                type="button"
                id="fp-send-code"
                className="auth-btn"
                onClick={() => router.push("/forgot-password/verify")}
            >
                Send Code
            </button>

            <p className="auth-footer-row">
                <Link href="/login" className="auth-link">Back to login</Link>
            </p>
        </>
    );
}
