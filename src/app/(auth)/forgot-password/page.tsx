"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setError("");

        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail) {
            setError("Please enter your email address.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(
                "/api/auth/forgot-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: normalizedEmail,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to send verification code."
                );
            }

            sessionStorage.setItem(
                "passwordResetEmail",
                normalizedEmail
            );

            router.push(
                "/forgot-password/verify"
            );
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to send verification code."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div>
                <h1 className="auth-heading">
                    Forgot your
                    <br />
                    password?
                </h1>

                <p className="auth-subtext">
                    Enter the email address associated with your account and
                    we&apos;ll send you a verification code.
                </p>
            </div>

            <div className="auth-fields">
                <div className="auth-field">
                    <label
                        className="auth-label"
                        htmlFor="fp-email"
                    >
                        Email Address
                    </label>

                    <input
                        id="fp-email"
                        className="auth-input"
                        type="email"
                        placeholder="alex@company.com"
                        autoComplete="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                    />
                </div>
            </div>

            {error && (
                <p
                    role="alert"
                    style={{
                        color: "#ef4444",
                        marginTop: "12px",
                    }}
                >
                    {error}
                </p>
            )}

            <button
                type="button"
                id="fp-send-code"
                className="auth-btn"
                disabled={isLoading}
                onClick={handleSubmit}
            >
                {isLoading
                    ? "Sending..."
                    : "Send Code"}
            </button>

            <p className="auth-footer-row">
                <Link
                    href="/login"
                    className="auth-link"
                >
                    Back to login
                </Link>
            </p>
        </>
    );
}
