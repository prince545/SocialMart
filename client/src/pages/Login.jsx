import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { LogIn } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const LoginPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="shadow-xl border-gray-100 overflow-hidden">
                    <CardHeader className="bg-gradient-to-br from-indigo-50 to-purple-50 border-b border-gray-100 flex flex-col items-center py-6">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-3">
                            <LogIn className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">Welcome back</h1>
                        <p className="text-sm text-gray-500 mt-1">Sign in to your SocialMart account</p>
                    </CardHeader>
                    <CardContent className="p-0 flex justify-center">
                        <SignIn
                            appearance={{
                                elements: {
                                    formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-sm normal-case',
                                    card: 'shadow-none border-0',
                                    rootBox: 'w-full',
                                }
                            }}
                            signUpUrl="/register"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;
