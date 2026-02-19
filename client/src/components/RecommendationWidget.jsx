
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';

const RecommendationWidget = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isSignedIn, isLoaded, getToken } = useAuth();

    useEffect(() => {
        if (!isLoaded || !isSignedIn) return;

        const fetchRecommendations = async () => {
            try {
                // Ensure token is ready before making request
                const token = await getToken();
                if (!token) return;
                const { data } = await axios.get('/api/ai/recommendations');
                setRecommendations(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [isLoaded, isSignedIn, getToken]);

    if (loading) return null;
    if (recommendations.length === 0) return null;

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 sticky top-4">
            <h3 className="font-bold text-gray-700 mb-3 flex items-center">
                <Sparkles size={18} className="text-purple-500 mr-2" />
                Recommended for You
            </h3>
            <div className="space-y-4">
                {recommendations.map(product => (
                    <Link to={`/product/${product._id}`} key={product._id} className="flex items-start space-x-3 group">
                        <img
                            src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/150'}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded bg-gray-100"
                        />
                        <div>
                            <h4 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 line-clamp-2">{product.title}</h4>
                            <p className="text-xs text-gray-500">${product.price}</p>
                        </div>
                    </Link>
                ))}
            </div>
            <Link to="/marketplace" className="block text-center text-sm text-blue-600 mt-4 hover:underline">
                View More
            </Link>
        </div>
    );
};

export default RecommendationWidget;
