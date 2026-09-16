"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [agreed, setAgreed] = useState(false);
    const router = useRouter();

    return (
        <>
            <div>
                <h1 className="auth-heading">Create account</h1>
                <p className="auth-subtext">Enter your email address to register with Company.</p>
            </div>

            <div className="auth-fields">
                <div className="auth-field">
                    <label className="auth-label" htmlFor="reg-email">Email Address</label>
                    <input
                        id="reg-email"
                        className="auth-input"
                        type="email"
                        placeholder="alex@company.com"
                        autoComplete="email"
                    />
                </div>
            </div>

            <div className="auth-check-row">
                <input
                    type="checkbox"
                    id="reg-agree"
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                />
                <label htmlFor="reg-agree">
                    I agree to the{" "}
                    <Link href="/terms" className="auth-link">Terms of Service</Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="auth-link">Privacy Policy</Link>
                </label>
            </div>

            <button
                type="button"
                id="reg-continue"
                className="auth-btn"
                onClick={() => router.push("/verify")}
            >
                Continue
            </button>

            <p className="auth-footer-row">
                Already have an account?{" "}
                <Link href="/login" className="auth-link">Log in</Link>
            </p>
        </>
    );
}
