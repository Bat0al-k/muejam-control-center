import type { ReactNode } from "react";
import "./auth.css";

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="auth-shell">
            {/* ── Left panel ───────────────────────────────────────────── */}
            <aside className="auth-panel" aria-hidden="true">
                <div className="auth-panel__overlay" />

                {/* Badge */}
                <div className="auth-panel__badge">
                    <span className="auth-panel__dot" />
                    MUEJAM PREMIUM
                </div>

                {/* Spacer */}
                <div style={{ flex: 1 }} />

                {/* Footer */}
                <footer className="auth-panel__footer">
                    <span>© 2026 Muejam Corp. All rights reserved.</span>
                    <span>Privacy &amp; Terms</span>
                </footer>
            </aside>

            {/* ── Right panel ──────────────────────────────────────────── */}
            <main className="auth-form-panel">
                {/* Logo */}
                <div className="auth-logo">
                    {/* <span className="auth-logo__wordmark">Muejam<sup>®</sup></span>
                    <svg
                        className="auth-logo__icon"
                        viewBox="0 0 48 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <line x1="4" y1="16" x2="44" y2="16" stroke="#111" strokeWidth="2.5" />
                        <path
                            d="M8 4 L24 16 L40 4"
                            stroke="#E8785A"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                        />
                        <path
                            d="M8 28 L24 16 L40 28"
                            stroke="#E8785A"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                        />
                    </svg> */}
                    <img src="/icons/Muejam logo.svg" alt="Muejam" />
                </div>

                {/* Page content */}
                <div className="auth-card">
                    {children}
                </div>

                {/* Bottom spacer */}
                <div className="auth-form-panel__spacer" />
            </main>
        </div>
    );
}
