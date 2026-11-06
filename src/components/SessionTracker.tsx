"use client";

import { useHeartbeat } from "@/hooks/useHeartbeat";

export function SessionTracker({
    product,
}: {
    product: "studio" | "library";
}) {
    useHeartbeat(product);
    return null;
}

