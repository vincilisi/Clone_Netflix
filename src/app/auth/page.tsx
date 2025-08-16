"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AuthContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const success = searchParams.get("success");

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
            <h1 className="text-3xl font-bold mb-6">Authentication Page</h1>

            {error && (
                <p className="text-red-500 mb-4">❌ Error: {error}</p>
            )}
            {success && (
                <p className="text-green-500 mb-4">✅ Success: {success}</p>
            )}

            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
                <p className="mb-4">Qui puoi fare login o registrarti.</p>
                <button className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg font-semibold">
                    Login con Google
                </button>
            </div>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="text-center mt-20 text-white">Loading...</div>}>
            <AuthContent />
        </Suspense>
    );
}
