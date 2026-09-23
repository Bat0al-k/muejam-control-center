"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    rememberMe,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to login."
                );
            }

            // Keep the authenticated user available on the client.
            // localStorage.setItem(
            //     "user",
            //     JSON.stringify(data.user)
            // );

            router.push("/dashboard");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to login."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <h1 className="auth-heading">Welcome Back</h1>
                <p className="auth-subtext">
                    Enter your credentials to access your curated library.
                </p>
            </div>

            <div className="auth-fields">
                <div className="auth-field">
                    <label
                        className="auth-label"
                        htmlFor="login-email"
                    >
                        Email Address
                    </label>

                    <input
                        id="login-email"
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

                <div className="auth-field">
                    <label
                        className="auth-label"
                        htmlFor="login-password"
                    >
                        Password
                    </label>

                    <div className="auth-input-wrap">
                        <input
                            id="login-password"
                            className="auth-input"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        />

                        <button
                            type="button"
                            className="auth-eye-btn"
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                            onClick={() =>
                                setShowPassword((value) => !value)
                            }
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
                <input
                    type="checkbox"
                    id="login-remember"
                    checked={rememberMe}
                    onChange={(event) =>
                        setRememberMe(event.target.checked)
                    }
                />

                <label htmlFor="login-remember">
                    Remember me
                </label>

                <span className="auth-check-row__spacer" />

                <Link
                    href="/forgot-password"
                    className="auth-link"
                >
                    Forgot password?
                </Link>
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
                type="submit"
                id="success-cta"
                className="auth-btn"
                disabled={isLoading}
            >
                {isLoading ? "Logging in..." : "Log in"}
            </button>

            <p className="auth-footer-row">
                Don&apos;t have an account?{" "}
                <Link
                    href="/register"
                    className="auth-link"
                >
                    Sign up
                </Link>
            </p>
        </form>
    );

}
