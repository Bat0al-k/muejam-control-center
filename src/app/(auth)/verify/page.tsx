"use client";

import {
    useEffect,
    useRef,
    useState,
    KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";

const OTP_LENGTH = 6;

export default function VerifyPage() {
    const [otp, setOtp] = useState<string[]>(
        Array(OTP_LENGTH).fill("")
    );
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const inputs =
        useRef<(HTMLInputElement | null)[]>([]);

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

    function handleChange(
        index: number,
        value: string
    ) {
        if (!/^\d?$/.test(value)) return;

        const next = [...otp];
        next[index] = value;

        setOtp(next);

        if (
            value &&
            index < OTP_LENGTH - 1
        ) {
            inputs.current[index + 1]?.focus();
        }
    }

    function handleKeyDown(
        index: number,
        e: KeyboardEvent<HTMLInputElement>
    ) {
        if (
            e.key === "Backspace" &&
            !otp[index] &&
            index > 0
        ) {
            inputs.current[index - 1]?.focus();
        }
    }

    function handlePaste(
        e: React.ClipboardEvent
    ) {
        e.preventDefault();

        const text = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, OTP_LENGTH);

        const next = [...otp];

        text.split("").forEach((ch, i) => {
            next[i] = ch;
        });

        setOtp(next);

        inputs.current[
            Math.min(
                text.length,
                OTP_LENGTH - 1
            )
        ]?.focus();
    }

    async function handleVerify() {
        setError("");

        const code = otp.join("");

        if (code.length !== OTP_LENGTH) {
            setError(
                "Please enter the 6-digit verification code."
            );
            return;
        }

        if (!email) {
            setError(
                "Registration email is missing."
            );
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(
                "/api/auth/verify",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        otp: code,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to verify your email."
                );
            }

            router.push(
                "/register/username"
            );
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to verify your email."
            );
        } finally {
            setIsLoading(false);
        }
    }

    const handleResend = async () => {
        try {
            const response = await fetch(
                "/api/auth/resend-otp",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        context: "registration",
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to resend OTP."
                );
            }

            // Optional: Add user feedback here
        } catch (error) {
            console.error("Error resending OTP:", error);
        }
    };

    return (
        <>
            <div>
                <h1 className="auth-heading">
                    Verify your email
                </h1>

                <p className="auth-subtext">
                    We sent a {OTP_LENGTH}-digit code
                    to{" "}
                    <strong>
                        {email || "your email"}
                    </strong>
                </p>
            </div>

            <div
                className="auth-otp"
                onPaste={handlePaste}
            >
                {otp.map((digit, i) => (
                    <input
                        key={i}
                        ref={(el) => {
                            inputs.current[i] = el;
                        }}
                        id={`otp-${i}`}
                        className={`auth-otp__input${digit ? " filled" : ""
                            }`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                            handleChange(
                                i,
                                e.target.value
                            )
                        }
                        onKeyDown={(e) =>
                            handleKeyDown(
                                i,
                                e
                            )
                        }
                        aria-label={`OTP digit ${i + 1
                            }`}
                    />
                ))}
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
                id="verify-submit"
                className="auth-btn"
                disabled={isLoading}
                onClick={handleVerify}
            >
                {isLoading
                    ? "Verifying..."
                    : "Verify"}
            </button>

            <p className="auth-footer-row">
                Didn&apos;t receive code?{" "}
                <button
                    type="button"
                    className="auth-link"
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        font: "inherit",
                        padding: 0,
                    }}
                    disabled={isLoading}
                    onClick={handleResend}
                >
                    Resend code
                </button>
            </p>
        </>
    );
}
