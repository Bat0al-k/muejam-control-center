export type AuthRole =
    | "developer"
    | "admin"
    | "author"
// | "user"
// | "anonymous"
// | "me";

export interface AuthUser {
    id: string;
    displayName: string | null;
    email: string;
    emailVerified: boolean;
    lastSeen: string | null;
    disabled: boolean;
    role: AuthRole;
}

// _______________________ Login _______________________ 
export interface LoginInput {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface LoginResponse {
    accessToken: string;
    user: AuthUser;
}


// _______________________ SignUp _______________________ 
export interface SignUpInput {
    displayName?: string;
    email: string;
    password: string;
}

export interface SignUpResponse {
    userId: string;
}

// _______________________ Forgot Password _______________________ 
export interface ForgotPasswordInput {
    email: string;
}

export interface ForgotPasswordResponse {
    userId: string;
}

// _______________________ Reset Password _______________________ 
export interface ResetPasswordInput {
    resetToken: string;
    newPassword: string;
}

export interface ResetPasswordResponse {
    userId: string;
}

// _______________________ Logout _______________________ 
export interface LogoutInput {
    userId: string;
}

export interface LogoutResponse {
    userId: string;
}


// _______________________ Change Email _______________________ 
export interface ChangeEmailInput {
    userId: string;
    newEmail: string;
}

export interface ChangeEmailResponse {
    userId: string;
}

// _______________________ Change Password _______________________ 
export interface ChangePasswordInput {
    userId: string;
    newPassword: string;
}

export interface ChangePasswordResponse {
    userId: string;
}

// _______________________ Delete Account _______________________ 
export interface DeleteAccountInput {
    userId: string;
}

export interface DeleteAccountResponse {
    userId: string;
}

// _______________________ Get Profile _______________________ 
export interface GetProfileInput {
    userId: string;
}

export interface GetProfileResponse {
    userId: string;
}

// _______________________ Update Profile _______________________ 
export interface UpdateProfileInput {
    userId: string;
    displayName?: string;
    email?: string;
    password?: string;
}

export interface UpdateProfileResponse {
    userId: string;
}

// _______________________ Verify Email _______________________ 
export interface VerifyEmailInput {
    verifyToken: string;
}

export interface VerifyEmailResponse {
    userId: string;
}

// _______________________ Resend Verification Email _______________________ 
export interface ResendVerificationEmailInput {
    email: string;
}

export interface ResendVerificationEmailResponse {
    userId: string;
}

// _______________________ Get Access Token _______________________ 
export interface GetAccessTokenInput {
    userId: string;
}

export interface GetAccessTokenResponse {
    accessToken: string;
}

// _______________________ Check Health _______________________ 
export interface CheckHealthInput {
    userId: string;
}

export interface CheckHealthResponse {
    userId: string;
}

// _______________________ Check Role _______________________ 
export interface CheckRoleInput {
    userId: string;
    role: AuthRole;
}

export interface CheckRoleResponse {
    userId: string;
}

// _______________________ Check Disabled _______________________ 
export interface CheckDisabledInput {
    userId: string;
}

export interface CheckDisabledResponse {
    userId: string;
}

// _______________________ Check Email Verified _______________________ 
export interface CheckEmailVerifiedInput {
    userId: string;
}

export interface CheckEmailVerifiedResponse {
    userId: string;
}

// _______________________ Check Email Not Verified _______________________ 
export interface CheckEmailNotVerifiedInput {
    userId: string;
}

export interface CheckEmailNotVerifiedResponse {
    userId: string;
}

// _______________________ Check Not Disabled _______________________ 
export interface CheckNotDisabledInput {
    userId: string;
}

export interface CheckNotDisabledResponse {
    userId: string;
}

// _______________________ Check Not Email Verified _______________________ 
export interface CheckNotEmailVerifiedInput {
    userId: string;
}

export interface CheckNotEmailVerifiedResponse {
    userId: string;
}

// _______________________ Check Not Email Not Verified _______________________ 
export interface CheckNotEmailNotVerifiedInput {
    userId: string;
}

export interface CheckNotEmailNotVerifiedResponse {
    userId: string;
}
