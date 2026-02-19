import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                    <LogIn className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex justify-center">
                    <SignIn
                        appearance={{
                            elements: {
                                formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-sm normal-case',
                                card: 'shadow-xl border border-gray-100 rounded-xl'
                            }
                        }}
                        signUpUrl="/register"
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
