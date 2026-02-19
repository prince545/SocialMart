import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../redux/postSlice';
import { useAuth } from '@clerk/clerk-react';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import RecommendationWidget from '../components/RecommendationWidget';
import SkeletonPost from '../components/SkeletonPost';

const Feed = () => {
    const dispatch = useDispatch();
    const { posts, loading } = useSelector(state => state.posts);
    const { isSignedIn, isLoaded, getToken } = useAuth();

    useEffect(() => {
        if (!isLoaded || !isSignedIn) return;
        // Wait for token to be available before dispatching
        const loadFeed = async () => {
            const token = await getToken();
            if (token) dispatch(getPosts());
        };
        loadFeed();
    }, [dispatch, isSignedIn, isLoaded, getToken]);

    if (!isLoaded) return <div className="min-h-screen flex items-center justify-center"><SkeletonPost /></div>;

    if (!isSignedIn) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to SocialMart</h2>
            <p className="text-gray-600">Please Login to view the feed and connect with others.</p>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Sidebar (Optional - for future use like Profile, Shortcuts) */}
                    <div className="hidden lg:block lg:col-span-3">
                        {/* Placeholder for left sidebar */}
                    </div>

                    {/* Main Feed */}
                    <div className="lg:col-span-6 space-y-6">
                        <CreatePost />

                        {loading ? (
                            <div className="space-y-6">
                                {[1, 2, 3].map(i => <SkeletonPost key={i} />)}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {posts.map(post => (
                                    <PostCard key={post._id} post={post} />
                                ))}
                                {posts.length === 0 && (
                                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                                        <div className="text-gray-400 mb-3">
                                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
                                        <p className="text-gray-500 mt-1">Be the first to share something with the community!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar (Recommendations) */}
                    <div className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-24">
                            <RecommendationWidget />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feed;
