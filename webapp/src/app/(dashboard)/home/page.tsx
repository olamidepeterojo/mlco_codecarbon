import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { fiefAuth } from "@/helpers/fief";
import { getDefaultOrgId } from "@/server-functions/organizations";
import { redirect } from "next/navigation";

// This method calls the API to check if the user is created in DB
async function checkAuth() {
    const token = fiefAuth.getAccessTokenInfo();
    if (!token) {
        throw new Error("No token found");
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error("Failed to fetch /auth/login");
    }

    return res.json();
}

export default async function HomePage({
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    if (searchParams && searchParams["auth"]) {
        try {
            const res = await checkAuth();
        } catch (error) {
            console.error("Error with /check/auth:", error);
        }
    }

    const orgId = await getDefaultOrgId();
    if (orgId) {
        redirect(`/${orgId}`);
    }

    return (
        <div className="container mx-auto p-4">
            {/* Change to a proper readme or get started guide */}
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Get Started</CardTitle>
                    <CardDescription>
                        Create your first organization to begin
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
}
