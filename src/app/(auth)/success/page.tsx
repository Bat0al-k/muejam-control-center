import Link from "next/link";
import { FiCheck } from "react-icons/fi";

export default function SuccessPage() {
    return (
        <>
            {/* Check icon */}
            <div className="auth-success-icon" aria-hidden="true">
                <FiCheck size={28} strokeWidth={2.5} />
            </div>

            <div style={{ textAlign: "center" }}>
                <h1 className="auth-heading" style={{ textAlign: "center" }}>
                    Account<br />activated!
                </h1>
                <p className="auth-subtext" style={{ marginTop: 8, textAlign: "center" }}>
                    Your account is fully ready. Welcome back to premium reading.
                </p>
            </div>

            <Link href="/dashboard" id="success-cta" className="auth-btn" style={{ display: "block", textDecoration: "none", textAlign: "center" }}>
                Go to Dashboard
            </Link>

            {/* Step dots */}
            <div className="auth-success-dots" aria-hidden="true">
                <span style={{ background: "var(--color-accent)" }} />
                <span />
                <span />
                <span />
            </div>

            <p className="auth-secure-note">Secured by enterprise encryption</p>
        </>
    );
}
