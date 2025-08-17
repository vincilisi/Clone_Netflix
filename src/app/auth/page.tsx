'use client';

import { Suspense } from 'react';
import AuthContent from './AuthContent';

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="text-white text-center mt-15">Loading...</div>}>
            <AuthContent />
        </Suspense>
    );
}
