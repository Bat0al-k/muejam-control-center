"use client";

import { useEffect, useRef } from "react";

const HEARTBEAT_INTERVAL_MS = 30_000; // 30 seconds per USER_ACTIVITY_AND_LTS_UPDATES.pdf

export function useHeartbeat(product: "studio" | "library") {
    const sessionIdRef = useRef<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const storageKey = `muejam_session_id_${product}`;

        try {
            const saved = window.sessionStorage.getItem(storageKey);
            if (saved) {
                sessionIdRef.current = saved;
            }
        } catch {
            // Ignore sessionStorage errors
        }

        async function sendHeartbeat() {
            if (!isMounted) return;
            if (typeof document !== "undefined" && document.visibilityState === "hidden") {
                return;
            }

            try {
                const res = await fetch("/api/session/heartbeat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        product,
                        sessionId: sessionIdRef.current,
                    }),
                });

                if (res.status === 403) {
                    // Suspension enforcement: redirect to login if account is suspended
                    window.location.href = "/api/auth/logout";
                    return;
                }

                if (res.ok) {
                    const data = await res.json();
                    if (data.sessionId && isMounted) {
                        sessionIdRef.current = data.sessionId;
                        try {
                            window.sessionStorage.setItem(storageKey, data.sessionId);
                        } catch {
                            // Ignore storage write error
                        }
                    }
                }
            } catch {
                // Ignore network errors during background ping
            }
        }

        // Initial ping on mount
        sendHeartbeat();

        const intervalId = window.setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                sendHeartbeat();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            isMounted = false;
            window.clearInterval(intervalId);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [product]);
}

