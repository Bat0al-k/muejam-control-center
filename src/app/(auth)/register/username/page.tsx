"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterUsernamePage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const registrationEmail =
            sessionStorage.getItem("registrationEmail");

        if (!registrationEmail) {
            router.replace("/register");
            return;
        }

        setEmail(registrationEmail);
    }, [router]);

    const checks = {
        length: username.length >= 3,
        characters: /^[a-zA-Z0-9_]+$/.test(username),
        noSpaces: !/\s/.test(username),
    };

    const allRequirementsMet =
        checks.length &&
        checks.characters &&
        checks.noSpaces;

    async function handleSubmit() {
        setError("");

        const trimmedUsername = username.trim();

        if (!trimmedUsername) {
            setError("Username is required.");
            return;
        }

        if (!allRequirementsMet) {
            setError("Please meet all username requirements.");
            return;
        }

        if (!email) {
            setError("Registration session is missing.");
            return;
        }

        try {
            setIsLoading(true);

            const response = await fetch(
                "/api/auth/register/username",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        username: trimmedUsername,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Unable to save username. Please try again."
                );
                return;
            }

            sessionStorage.setItem(
                "registrationUsername",
                trimmedUsername
            );

            router.push("/register/password");
        } catch {
            setError(
                "Something went wrong. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div>
                <h1 className="auth-heading">Choose a username</h1>

                <p className="auth-subtext">
                    Pick a username for your publishing profile.
                </p>
            </div>

            <div className="auth-fields">
                <div className="auth-field">
                    <label
                        className="auth-label"
                        htmlFor="username-input"
                    >
                        Username
                    </label>

                    <input
                        id="username-input"
                        className="auth-input"
                        type="text"
                        value={username}
                        onChange={e =>
                            setUsername(e.target.value)
                        }
                        placeholder="alex_writer"
                        autoComplete="username"
                        maxLength={30}
                    />
                </div>
            </div>

            {/* Requirements */}
            <div className="auth-checklist">
                {[
                    {
                        key: "length",
                        label: "3+ characters",
                    },
                    {
                        key: "characters",
                        label: "Letters, numbers, and underscores only",
                    },
                    {
                        key: "noSpaces",
                        label: "No spaces included",
                    },
                ].map(({ key, label }) => (
                    <div
                        key={key}
                        className={`auth-checklist__item ${checks[key as keyof typeof checks]
                            ? "met"
                            : ""
                            }`}
                    >
                        <input
                            type="checkbox"
                            readOnly
                            checked={
                                checks[
                                key as keyof typeof checks
                                ]
                            }
                            aria-label={label}
                        />

                        <span>{label}</span>
                    </div>
                ))}
            </div>

            {error && (
                <p
                    style={{
                        color: "#ef4444",
                        fontSize: 13,
                        marginTop: 12,
                    }}
                >
                    {error}
                </p>
            )}

            <button
                type="button"
                id="username-continue"
                className="auth-btn"
                onClick={handleSubmit}
                disabled={isLoading}
            >
                {isLoading ? "Saving..." : "Continue"}
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