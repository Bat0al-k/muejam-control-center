import { USER_ROLES, type UserRole } from "./roles";

export const PERMISSIONS = {
    // Users
    USERS_VIEW: "users:view",
    USERS_MANAGE: "users:manage",

    // Books
    BOOKS_VIEW_ALL: "books:view-all",
    BOOKS_VIEW_OWN: "books:view-own",
    BOOKS_UPLOAD: "books:upload",
    BOOKS_EDIT_OWN: "books:edit-own",
    BOOKS_REVIEW: "books:review",
    BOOKS_APPROVE: "books:approve",
    BOOKS_REJECT: "books:reject",
    BOOKS_REQUEST_EDITS: "books:request-edits",

    // Library
    LIBRARY_VIEW: "library:view",

    // Studio
    STUDIO_VIEW: "studio:view",
    STUDIO_USAGE_VIEW: "studio:usage-view",
    STUDIO_PAYMENTS_VIEW: "studio:payments-view",
    STUDIO_LOGS_VIEW: "studio:logs-view",

    // System
    ROLES_MANAGE: "roles:manage",
} as const;

export type Permission =
    (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<
    UserRole,
    readonly Permission[]
> = {
    [USER_ROLES.DEVELOPER]: Object.values(
        PERMISSIONS
    ) as Permission[],

    [USER_ROLES.ADMIN]: [
        PERMISSIONS.LIBRARY_VIEW,
        PERMISSIONS.BOOKS_VIEW_ALL,
        PERMISSIONS.BOOKS_REVIEW,
        PERMISSIONS.BOOKS_APPROVE,
        PERMISSIONS.BOOKS_REJECT,
        PERMISSIONS.BOOKS_REQUEST_EDITS,
        PERMISSIONS.USERS_VIEW,
    ],

    [USER_ROLES.AUTHOR]: [
        PERMISSIONS.LIBRARY_VIEW,
        PERMISSIONS.BOOKS_VIEW_OWN,
        PERMISSIONS.BOOKS_UPLOAD,
        PERMISSIONS.BOOKS_EDIT_OWN,
    ],
};

export function canAccessStudio(role: UserRole): boolean {
    return ROLE_PERMISSIONS[role].includes(PERMISSIONS.STUDIO_VIEW);
}

export function canAccessLibrary(role: UserRole): boolean {
    return ROLE_PERMISSIONS[role].includes(PERMISSIONS.LIBRARY_VIEW);
}