"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";

function getStrength(password: string): { label: string; pct: number } {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const map: Record<number, { label: string; pct: number }> = {
        0: { label: "Weak", pct: 10 },
        1: { label: "Weak", pct: 25 },
        2: { label: "Medium", pct: 55 },
        3: { label: "Medium", pct: 70 },
        4: { label: "Strong", pct: 100 },
    };
    return map[score];
}

export default function ForgotPasswordResetPage() {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [showConf, setShowConf] = useState(false);
    const router = useRouter();

    const strength = getStrength(password);
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };

    const EyeIcon = ({ visible }: { visible: boolean }) => visible ? (
        <FiEyeOff size={18} />
    ) : (
        <FiEye size={18} />
    );

    return (
        <>
            <div>
                <h1 className="auth-heading">Create new<br />password</h1>
                <p className="auth-subtext">Must be highly secure to protect your publishing profile.</p>
            </div>

            <div className="auth-fields">
                {/* Password */}
                <div className="auth-field">
                    <label className="auth-label" htmlFor="pwd-input">New Password</label>
                    <div className="auth-input-wrap">
                        <input
                            id="pwd-input"
                            className="auth-input"
                            type={showPwd ? "text" : "password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="new-password"
                        />
                        <button type="button" className="auth-eye-btn" onClick={() => setShowPwd(v => !v)} aria-label="Toggle password">
                            <EyeIcon visible={showPwd} />
                        </button>
                    </div>

                    {/* Strength */}
                    {password.length > 0 && (
                        <div className="auth-strength">
                            <div className="auth-strength__bar-wrap">
                                <span style={{ fontSize: 12, color: "var(--color-accent)" }}>{strength.label} strength</span>
                                <div className="auth-strength__bar" style={{ flex: 1 }}>
                                    <div className="auth-strength__fill" style={{ width: `${strength.pct}%` }} />
                                </div>
                                <span className="auth-strength__label">{strength.pct}%</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Confirm */}
                <div className="auth-field">
                    <label className="auth-label" htmlFor="pwd-confirm">Confirm Password</label>
                    <div className="auth-input-wrap">
                        <input
                            id="pwd-confirm"
                            className="auth-input"
                            type={showConf ? "text" : "password"}
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="new-password"
                        />
                        <button type="button" className="auth-eye-btn" onClick={() => setShowConf(v => !v)} aria-label="Toggle confirm password">
                            <EyeIcon visible={showConf} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Requirements */}
            <div className="auth-checklist">
                {[
                    { key: "length", label: "8+ characters" },
                    { key: "uppercase", label: "Uppercase letter included" },
                    { key: "number", label: "Number included" },
                    { key: "special", label: "Special character included" },
                ].map(({ key, label }) => (
                    <div key={key} className={`auth-checklist__item ${checks[key as keyof typeof checks] ? "met" : ""}`}>
                        <input type="checkbox" readOnly checked={checks[key as keyof typeof checks]} aria-label={label} />
                        <span>{label}</span>
                    </div>
                ))}
            </div>

            <button
                type="button"
                id="pwd-reset"
                className="auth-btn"
                onClick={() => router.push("/login")}
            >
                Reset Password
            </button>

            <p className="auth-footer-row">
                Remembered details?{" "}
                <Link href="/login" className="auth-link">Log in</Link>
            </p>
        </>
    );
}
