import { NextRequest, NextResponse } from "next/server";
import { getCurrentAuth } from "@/lib/server-auth";
import { USER_ROLES } from "@/features/auth/roles";
import { createStudioPayment } from "@/features/studio/studio.service";
import { parseBankAmountInput } from "@/lib/formatters";

export async function POST(request: NextRequest) {
    try {
        const auth = await getCurrentAuth();

        if (!auth) {
            return NextResponse.json(
                { message: "Authentication required." },
                { status: 401 }
            );
        }

        // Only developers and admins can record manual studio payments
        if (auth.role !== USER_ROLES.DEVELOPER && auth.role !== USER_ROLES.ADMIN) {
            return NextResponse.json(
                { message: "Permission denied. Only developers and administrators can record payments." },
                { status: 403 }
            );
        }

        const body = await request.json();
        const {
            userId,
            amount,
            currency = "USD",
            paymentMethod = "card",
            status = "successful",
            transactionId,
            planId,
        } = body;

        if (!userId || typeof userId !== "string") {
            return NextResponse.json(
                { message: "Valid User ID is required." },
                { status: 400 }
            );
        }

        // Parse and validate financial amount according to banking rules:
        // Case 1: If amount is empty or not specified -> reject, cannot be recorded as actual transaction
        // Case 2: If amount is 0 or 0.00 -> reject, cannot be recorded as actual transaction
        const parsedAmount =
            typeof amount === "number"
                ? amount
                : parseBankAmountInput(String(amount ?? ""));

        if (parsedAmount === null || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
            return NextResponse.json(
                {
                    message:
                        "Amount is required and must be greater than 0.00. An empty or 0.00 amount cannot be recorded as an actual payment transaction.",
                },
                { status: 400 }
            );
        }

        const payment = await createStudioPayment({
            userId,
            amount: parsedAmount,
            currency: String(currency).trim().toUpperCase(),
            paymentMethod: String(paymentMethod).trim(),
            status: String(status).trim(),
            transactionId: transactionId ? String(transactionId).trim() : undefined,
            planId: planId ? String(planId).trim() : undefined,
        });

        return NextResponse.json({
            message: "Payment transaction recorded successfully.",
            payment,
        });
    } catch (error) {
        console.error("Studio payment record error:", error);
        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to record payment transaction.",
            },
            { status: 500 }
        );
    }
}
