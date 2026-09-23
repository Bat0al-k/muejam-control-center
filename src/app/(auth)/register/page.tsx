"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [agreed, setAgreed] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleContinue = async () => {
        setError("");

        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail) {
            setError("Please enter your email address.");
            return;
        }

        if (!agreed) {
            setError(
                "Please agree to the Terms of Service and Privacy Policy."
            );
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: normalizedEmail,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to create your account."
                );
            }

            /*
             * Keep the email during the registration flow.
             * It will be used by the verification page.
             */
            sessionStorage.setItem(
                "registrationEmail",
                normalizedEmail
            );

            router.push("/verify");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to create your account."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div>
                <h1 className="auth-heading">Create account</h1>
                <p className="auth-subtext">
                    Enter your email address to register with Company.
                </p>
            </div>

            <div className="auth-fields">
                <div className="auth-field">
                    <label
                        className="auth-label"
                        htmlFor="reg-email"
                    >
                        Email Address
                    </label>

                    <input
                        id="reg-email"
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

            <div className="auth-check-row">
                <input
                    type="checkbox"
                    id="reg-agree"
                    checked={agreed}
                    onChange={(event) =>
                        setAgreed(event.target.checked)
                    }
                />

                <label htmlFor="reg-agree">
                    I agree to the{" "}
                    <Link
                        href="/terms"
                        className="auth-link"
                    >
                        Terms of Service
                    </Link>
                    {" "}and{" "}
                    <Link
                        href="/privacy"
                        className="auth-link"
                    >
                        Privacy Policy
                    </Link>
                </label>
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
                id="reg-continue"
                className="auth-btn"
                disabled={isLoading}
                onClick={handleContinue}
            >
                {isLoading ? "Sending code..." : "Continue"}
            </button>

            <p className="auth-footer-row">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="auth-link"
                >
                    Log in
                </Link>
            </p>
        </>
    );
}
