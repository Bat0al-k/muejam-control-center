"use client";

import { useRef, useState, KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const OTP_LENGTH = 6;

export default function VerifyPage() {
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const inputs = useRef<(HTMLInputElement | null)[]>([]);
    const router = useRouter();

    function handleChange(index: number, value: string) {
        if (!/^\d?$/.test(value)) return;
        const next = [...otp];
        next[index] = value;
        setOtp(next);
        if (value && index < OTP_LENGTH - 1) {
            inputs.current[index + 1]?.focus();
        }
    }

    function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    }

    function handlePaste(e: React.ClipboardEvent) {
        e.preventDefault();
        const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        const next = [...otp];
        text.split("").forEach((ch, i) => { next[i] = ch; });
        setOtp(next);
        inputs.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus();
    }

    return (
        <>
            <div>
                <h1 className="auth-heading">Verify your email</h1>
                <p className="auth-subtext">
                    We sent a {OTP_LENGTH}-digit code to{" "}
                    <strong>alex@company.com</strong>
                </p>
            </div>

            <div className="auth-otp" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                    <input
                        key={i}
                        ref={el => { inputs.current[i] = el; }}
                        id={`otp-${i}`}
                        className={`auth-otp__input${digit ? " filled" : ""}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleChange(i, e.target.value)}
                        onKeyDown={e => handleKeyDown(i, e)}
                        aria-label={`OTP digit ${i + 1}`}
                    />
                ))}
            </div>

            <button
                type="button"
                id="verify-submit"
                className="auth-btn"
                onClick={() => router.push("/register/password")}
            >
                Verify
            </button>

            <p className="auth-footer-row">
                Didn&apos;t receive code?{" "}
                <button type="button" className="auth-link" style={{ background: "none", border: "none", cursor: "pointer", font: "inherit", padding: 0 }}>
                    Resend code
                </button>
            </p>
        </>
    );
}
