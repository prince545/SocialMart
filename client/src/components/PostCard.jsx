import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addLike, addComment, deletePost } from '../redux/postSlice';
import { Heart, MessageCircle, Share2, MoreHorizontal, Tag, Bookmark, BookmarkCheck, Send, Smile, Trash2 } from 'lucide-react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SharePostModal from './SharePostModal';

const PostCard = ({ post, currentUserId }) => {
    const dispatch = useDispatch();
    const { user: clerkUser } = useUser();
    const { getToken } = useAuth();
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [likeAnimation, setLikeAnimation] = useState(false);
    const [doubleTapTimer, setDoubleTapTimer] = useState(null);

    const handleLike = () => {
        dispatch(addLike(post._id));
        setLikeAnimation(true);
        setTimeout(() => setLikeAnimation(false), 600);
    };

    const handleDelete = async () => {
        if (window.confirm('Delete this post? This cannot be undone.')) {
            const token = await getToken();
            dispatch(deletePost({ id: post._id, token }));
        }
    };

    const handleDoubleTap = () => {
        if (!isLiked) {
            handleLike();
        }
    };

    const handleImageClick = () => {
        if (doubleTapTimer) {
            clearTimeout(doubleTapTimer);
            handleDoubleTap();
            setDoubleTapTimer(null);
        } else {
            const timer = setTimeout(() => {
                setDoubleTapTimer(null);
            }, 300);
            setDoubleTapTimer(timer);
        }
    };

    const handleComment = (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        dispatch(addComment({ postId: post._id, formData: { text: commentText } }));
        setCommentText('');
        setShowComments(true);
    };

    const formatTimeAgo = (date) => {
        const now = new Date();
        const postDate = new Date(date);
        const seconds = Math.floor((now - postDate) / 1000);

        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d`;
        return postDate.toLocaleDateString();
    };

    const isLiked = post.likes?.some(like => {
        const likeUserId = typeof like.user === 'object' ? like.user._id : like.user;
        return likeUserId === currentUserId;
    }) || false;

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <Link to={`/user/${post.user?._id || post.user}`} className="flex items-center gap-3">
                        <div className="relative">
                            <Avatar className="w-10 h-10 ring-2 ring-indigo-100">
                                <AvatarImage src={post.avatar || post.user?.avatar} alt={post.name} />
                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold">
                                    {post.name?.charAt(0)?.toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 leading-tight text-sm hover:text-indigo-600 transition-colors">
                                {post.name || post.user?.username || 'User'}
                            </h3>
                            <p className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</p>
                        </div>
                    </Link>
                </div>
                <div className="flex items-center gap-1">
                    {/* Trash icon — always visible, backend enforces ownership */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        onClick={handleDelete}
                        title="Delete post"
                    >
                        <Trash2 size={16} />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 w-8 h-8">
                                <MoreHorizontal size={18} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Report</DropdownMenuItem>
                            <DropdownMenuItem>Copy Link</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={handleDelete}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Image */}
            <div
                className="relative w-full bg-black aspect-square overflow-hidden group cursor-pointer"
                onClick={handleImageClick}
            >
                <img
                    src={post.image}
                    alt="Post content"
                    loading="lazy"
                    className="w-full h-full object-cover"
                />

                {/* Double-tap Like Animation */}
                {likeAnimation && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                        <Heart className="w-24 h-24 text-white fill-red-500 animate-ping" />
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`w-9 h-9 rounded-full transition-all active:scale-90 ${isLiked
                                ? 'text-red-500 hover:text-red-600 hover:bg-red-50'
                                : 'text-gray-700 hover:text-red-500 hover:bg-red-50'
                                }`}
                            onClick={handleLike}
                        >
                            <Heart size={24} fill={isLiked ? "currentColor" : "none"} className="transition-all" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-9 h-9 rounded-full text-gray-700 hover:text-indigo-500 hover:bg-indigo-50 transition-all active:scale-90"
                            onClick={() => setShowComments(!showComments)}
                        >
                            <MessageCircle size={24} fill={showComments ? "currentColor" : "none"} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-9 h-9 rounded-full text-gray-700 hover:text-green-500 hover:bg-green-50 transition-all active:scale-90"
                            onClick={() => setShowShareModal(true)}
                        >
                            <Share2 size={24} />
                        </Button>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`w-9 h-9 rounded-full transition-all active:scale-90 ${isSaved
                            ? 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'
                            : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                            }`}
                        onClick={() => setIsSaved(!isSaved)}
                    >
                        {isSaved ? <BookmarkCheck size={24} fill="currentColor" /> : <Bookmark size={24} />}
                    </Button>
                </div>

                {/* Likes Count */}
                {post.likes?.length > 0 && (
                    <p className="font-semibold text-sm text-gray-900">
                        {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
                    </p>
                )}

                {/* Caption */}
                <div className="text-sm">
                    <Link to={`/user/${post.user?._id || post.user}`} className="font-semibold mr-2 text-gray-900 hover:text-indigo-600 transition-colors">
                        {post.name || post.user?.username || 'User'}
                    </Link>
                    <span className="text-gray-700 leading-relaxed">{post.caption}</span>
                </div>

                {/* Tagged Products */}
                {post.products && post.products.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {post.products.map((product, index) => (
                            <Link
                                key={product._id || index}
                                to={`/product/${product._id}`}
                                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200 rounded-lg px-3 py-1.5 text-xs font-semibold hover:from-indigo-100 hover:to-purple-100 transition-all cursor-pointer"
                            >
                                <Tag size={12} />
                                {product.title}
                                <span className="font-bold bg-white px-1.5 py-0.5 rounded text-indigo-800">${product.price}</span>
                            </Link>
                        ))}
                    </div>
                )}

                {/* View Comments Toggle */}
                {post.comments?.length > 0 && (
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
                    >
                        {showComments ? 'Hide' : `View all ${post.comments.length} ${post.comments.length === 1 ? 'comment' : 'comments'}`}
                    </button>
                )}

                {/* Comments Section */}
                {showComments && post.comments?.length > 0 && (
                    <div className="space-y-3 pt-2 border-t border-gray-100 max-h-64 overflow-y-auto scrollbar-hide">
                        {post.comments.map((comment, index) => (
                            <div key={comment._id || index} className="flex items-start gap-2 text-sm">
                                <Link to={`/user/${comment.user?._id || comment.user}`}>
                                    <span className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                                        {comment.name || 'User'}
                                    </span>
                                </Link>
                                <span className="text-gray-700 flex-1">{comment.text}</span>
                                <span className="text-xs text-gray-400">{formatTimeAgo(comment.date || comment.createdAt)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleComment} className="border-t border-gray-100 px-4 py-3 flex items-center gap-2 bg-gray-50/50">
                <Smile className="w-5 h-5 text-gray-400 flex-shrink-0 cursor-pointer hover:text-gray-600 transition-colors" />
                <Input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-sm px-0 placeholder-gray-400 h-8"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    disabled={!commentText.trim()}
                    className="text-indigo-600 font-semibold text-sm disabled:opacity-40 px-2 h-8 hover:bg-indigo-50"
                >
                    Post
                </Button>
            </form>

            {showShareModal && (
                <SharePostModal
                    post={post}
                    onClose={() => setShowShareModal(false)}
                />
            )}
        </div>
    );
};

export default PostCard;
