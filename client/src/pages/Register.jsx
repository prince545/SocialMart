import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { UserPlus } from 'lucide-react';

const RegisterPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                    <UserPlus className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex justify-center">
                    <SignUp
                        appearance={{
                            elements: {
                                formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-sm normal-case',
                                card: 'shadow-xl border border-gray-100 rounded-xl'
                            }
                        }}
                        signInUrl="/login"
                    />
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
