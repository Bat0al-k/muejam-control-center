export const USER_ROLES = {
    DEVELOPER: "admin",
    ADMIN: "sub_admin",
    AUTHOR: "author",
} as const;

export type UserRole =
    (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const DEFAULT_USER_ROLE: UserRole =
    USER_ROLES.AUTHOR;

export const ROLE_LABELS: Record<UserRole, string> = {
    admin: "Developer",
    sub_admin: "Admin", // or Sub Admin
    author: "Author",
};