
import React from 'react';
import { Loader } from 'lucide-react';

const Loading = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Loader size={48} className="text-blue-600 animate-spin" />
        </div>
    );
};

export default Loading;
