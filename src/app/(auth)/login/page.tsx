"use client";

import { useState } from "react";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <div>
                <h1 className="auth-heading">Welcome Back</h1>
                <p className="auth-subtext">Enter your credentials to access your curated library.</p>
            </div>

            <div className="auth-fields">
                <div className="auth-field">
                    <label className="auth-label" htmlFor="login-email">Email Address</label>
                    <input
                        id="login-email"
                        className="auth-input"
                        type="email"
                        placeholder="alex@company.com"
                        autoComplete="email"
                    />
                </div>

                <div className="auth-field">
                    <label className="auth-label" htmlFor="login-password">Password</label>
                    <div className="auth-input-wrap">
                        <input
                            id="login-password"
                            className="auth-input"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className="auth-eye-btn"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowPassword(v => !v)}
                        >
                            {showPassword ? (
                                <FiEyeOff size={18} />
                            ) : (
                                <FiEye size={18} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="auth-check-row">
                <input type="checkbox" id="login-remember" defaultChecked />
                <label htmlFor="login-remember">Remember me</label>
                <span className="auth-check-row__spacer" />
                <Link href="/forgot-password" className="auth-link">Forgot password?</Link>
            </div>

            <button type="button" className="auth-btn" id="login-submit">
                Log in
            </button>

            <p className="auth-footer-row">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="auth-link">Sign up</Link>
            </p>
        </>
    );
}