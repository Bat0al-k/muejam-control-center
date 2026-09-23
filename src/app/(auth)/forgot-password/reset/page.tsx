import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import ResetPasswordForm from "./ResetPasswordForm";
import {
    RESET_TOKEN_COOKIE,
    verifyPasswordResetToken,
} from "@/lib/password-reset";

export default async function ResetPasswordPage() {
    const cookieStore = await cookies();

    const token =
        cookieStore.get(RESET_TOKEN_COOKIE)?.value;

    if (!token) {
        redirect("/forgot-password");
    }

    const resetSession =
        verifyPasswordResetToken(token);

    if (!resetSession) {
        redirect("/forgot-password");
    }

    return <ResetPasswordForm />;
}
