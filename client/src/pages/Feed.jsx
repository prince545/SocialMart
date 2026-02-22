import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts, deleteAllPosts } from '../redux/postSlice';
import { useAuth, useUser } from '@clerk/clerk-react';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import RecommendationWidget from '../components/RecommendationWidget';
import SkeletonPost from '../components/SkeletonPost';
import { Plus, Sparkles, Trash2, X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const Feed = () => {
    const dispatch = useDispatch();
    const { posts, loading } = useSelector(state => state.posts);
    const { isSignedIn, isLoaded, getToken } = useAuth();
    const { user: clerkUser } = useUser();
    const [currentUserId, setCurrentUserId] = useState(null);
    const [showCreatePost, setShowCreatePost] = useState(false);

    useEffect(() => {
        if (!isLoaded || !isSignedIn) return;
        const loadFeed = async () => {
            const token = await getToken();
            if (token) {
                dispatch(getPosts());
                // Fetch current user's MongoDB ID — pass token so auth middleware accepts it
                try {
                    const { data } = await axios.get('/api/auth/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setCurrentUserId(data._id);
                } catch (err) {
                    console.error('Failed to fetch current user:', err);
                }
            }
        };
        loadFeed();
    }, [dispatch, isSignedIn, isLoaded, getToken]);

    if (!isLoaded) return <div className="min-h-screen flex items-center justify-center"><SkeletonPost /></div>;

    if (!isSignedIn) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
            <div className="text-center max-w-md px-4">
                <Sparkles className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to SocialMart</h2>
                <p className="text-gray-600 mb-6">Please login to view the feed and connect with others.</p>
            </div>
        </div>
    );

    // Extract unique users for stories (mock data for now)
    const storyUsers = [...new Map(posts.map(post => [post.user?._id || post.user, {
        id: post.user?._id || post.user,
        name: post.name,
        avatar: post.avatar,
        hasStory: true
    }])).values()].slice(0, 10);

    return (
        <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 min-h-screen relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.06),transparent_50%)] pointer-events-none"></div>
            <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Stories Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-6 overflow-hidden">
                    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                        {/* Your Story */}
                        <div
                            className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group"
                            onClick={() => setShowCreatePost(true)}
                        >
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-0.5 group-hover:scale-105 transition-transform">
                                    <div className="w-full h-full rounded-full bg-white p-0.5">
                                        <Avatar className="w-full h-full">
                                            <AvatarImage src={clerkUser?.imageUrl} />
                                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold">
                                                {clerkUser?.firstName?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 rounded-full border-2 border-white flex items-center justify-center">
                                    <Plus className="w-3 h-3 text-white" />
                                </div>
                            </div>
                            <span className="text-xs text-gray-600 font-medium">Your Story</span>
                        </div>

                        {/* Other Stories */}
                        {storyUsers.map((user) => (
                            <div key={user.id} className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-0.5 group-hover:scale-105 transition-transform">
                                        <div className="w-full h-full rounded-full bg-white p-0.5">
                                            <Avatar className="w-full h-full">
                                                <AvatarImage src={user.avatar} />
                                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm">
                                                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-600 font-medium max-w-[64px] truncate">
                                    {user.name || 'User'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Create Post Modal */}
                {showCreatePost && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
                        onClick={(e) => { if (e.target === e.currentTarget) setShowCreatePost(false); }}
                    >
                        <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
                            <button
                                onClick={() => setShowCreatePost(false)}
                                className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                            >
                                <X size={16} />
                            </button>
                            <CreatePost onClose={() => setShowCreatePost(false)} />
                        </div>
                    </div>
                )}

                {/* Posts Feed */}
                {loading ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => <SkeletonPost key={i} />)}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Delete All My Posts button */}
                        {posts.length > 0 && (
                            <div className="flex justify-end">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-400 transition-all"
                                    onClick={async () => {
                                        if (window.confirm('Delete ALL your posts? This cannot be undone.')) {
                                            const token = await getToken();
                                            try {
                                                await dispatch(deleteAllPosts(token)).unwrap();
                                                alert('All your posts have been deleted successfully.');
                                            } catch (error) {
                                                alert('Failed to delete posts. Please try again.');
                                                console.error('Delete all posts error:', error);
                                            }
                                        }
                                    }}
                                >
                                    <Trash2 size={14} />
                                    Delete All My Posts
                                </Button>
                            </div>
                        )}

                        {posts.map(post => (
                            <PostCard key={post._id} post={post} currentUserId={currentUserId} />
                        ))}
                        {posts.length === 0 && (
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Sparkles className="w-10 h-10 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No posts yet</h3>
                                <p className="text-gray-500 mb-6">Be the first to share something with the community!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Feed;
