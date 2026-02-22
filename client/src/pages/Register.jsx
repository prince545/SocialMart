import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const RegisterPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50/50 to-indigo-50/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.08),transparent_50%)] pointer-events-none"></div>
            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <Card className="shadow-xl border-gray-100 overflow-hidden">
                    <CardHeader className="bg-gradient-to-br from-indigo-50 to-purple-50 border-b border-gray-100 flex flex-col items-center py-6">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-3">
                            <UserPlus className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">Create an account</h1>
                        <p className="text-sm text-gray-500 mt-1">Join thousands of SocialMart shoppers</p>
                    </CardHeader>
                    <CardContent className="p-0 flex justify-center">
                        <SignUp
                            appearance={{
                                elements: {
                                    formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-sm normal-case',
                                    card: 'shadow-none border-0',
                                    rootBox: 'w-full',
                                }
                            }}
                            signInUrl="/login"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RegisterPage;
