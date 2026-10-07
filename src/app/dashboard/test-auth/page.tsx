// permission checking pages for authorized users 
import { requireAuth } from "@/lib/server-auth";

export default async function TestAuthPage() {
    const auth = await requireAuth();

    return (
        <main style={{ padding: "2rem" }}>
            <h1>Auth Test</h1>

            <p>User ID: {auth.userId}</p>
            <p>Role: {auth.role}</p>

            <p>Allowed Roles:</p>

            <pre>
                {JSON.stringify(auth.allowedRoles, null, 2)}
            </pre>
        </main>
    );
}

// permission checking pages for studio
// import { requirePermission } from "@/lib/server-auth";
// import { PERMISSIONS } from "@/features/auth/permissions";

// export default async function TestAuthPage() {
//     const auth = await requirePermission(
//         PERMISSIONS.STUDIO_VIEW
//     );

//     return (
//         <main style={{ padding: "2rem" }}>
//             <h1>Permission Test</h1>

//             <p>User ID: {auth.userId}</p>
//             <p>Role: {auth.role}</p>

//             <p>
//                 STUDIO_VIEW: Allowed
//             </p>
//         </main>
//     );
// }


// permissions checking pages for library
// import { requirePermission } from "@/lib/server-auth";
// import { PERMISSIONS } from "@/features/auth/permissions";

// export default async function TestAuthPage() {
//     const auth = await requirePermission(
//         PERMISSIONS.BOOKS_UPLOAD
//     );

//     return (
//         <main style={{ padding: "2rem" }}>
//             <h1>Library Permission Test</h1>

//             <p>User ID: {auth.userId}</p>
//             <p>Role: {auth.role}</p>

//             <p>
//                 BOOKS_VIEW_ALL: Allowed
//             </p>
//         </main>
//     );
// }