
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const RecommendationWidget = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isSignedIn, isLoaded, getToken } = useAuth();

    useEffect(() => {
        if (!isLoaded || !isSignedIn) return;
        const fetchRecommendations = async () => {
            try {
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

    if (loading) {
        return (
            <Card className="border-gray-100 shadow-sm">
                <CardHeader className="pb-3">
                    <Skeleton className="h-5 w-40" />
                </CardHeader>
                <CardContent className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-3">
                            <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
                            <div className="space-y-1.5 flex-1">
                                <Skeleton className="h-3.5 w-full" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (recommendations.length === 0) return null;

    return (
        <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Sparkles size={16} className="text-purple-500" />
                    Recommended for You
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {recommendations.map(product => (
                    <Link to={`/product/${product._id}`} key={product._id} className="flex items-start gap-3 group">
                        <img
                            src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/150'}
                            alt={product.title}
                            className="w-12 h-12 object-cover rounded-lg bg-gray-100 flex-shrink-0 border border-gray-100"
                        />
                        <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 line-clamp-2 transition-colors">{product.title}</h4>
                            <p className="text-xs text-indigo-600 font-bold mt-0.5">${product.price}</p>
                        </div>
                    </Link>
                ))}
                <Button asChild variant="outline" size="sm" className="w-full text-xs">
                    <Link to="/marketplace">View More</Link>
                </Button>
            </CardContent>
        </Card>
    );
};

export default RecommendationWidget;
