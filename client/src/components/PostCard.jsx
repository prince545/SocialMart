
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addLike, addComment } from '../redux/postSlice';
import { Heart, MessageCircle, Share2, MoreHorizontal, Tag } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const PostCard = ({ post }) => {
    const dispatch = useDispatch();
    const { user: clerkUser } = useUser();
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);

    const handleLike = () => {
        dispatch(addLike(post._id));
    };

    const handleComment = (e) => {
        e.preventDefault();
        dispatch(addComment({ postId: post._id, formData: { text: commentText } }));
        setCommentText('');
    };

    const isLiked = post.likes.some(like => like.user === clerkUser?.id);

    return (
        <Card className="overflow-hidden border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10 ring-2 ring-indigo-100">
                        <AvatarImage src={post.avatar} alt={post.name} />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-base">
                            {post.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-gray-900 leading-tight text-sm">{post.name}</h3>
                        <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 w-8 h-8">
                    <MoreHorizontal size={18} />
                </Button>
            </div>

            {/* Image */}
            <div className="w-full bg-gray-100 aspect-square sm:aspect-[4/3] overflow-hidden group relative">
                <img
                    src={post.image}
                    alt="Post content"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            <CardContent className="p-4 pb-2">
                {/* Actions */}
                <div className="flex items-center gap-3 mb-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`w-9 h-9 rounded-full transition-transform active:scale-90 ${isLiked ? 'text-red-500 hover:text-red-600 hover:bg-red-50' : 'text-gray-600 hover:text-red-500 hover:bg-red-50'}`}
                        onClick={handleLike}
                    >
                        <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-9 h-9 rounded-full text-gray-600 hover:text-indigo-500 hover:bg-indigo-50"
                        onClick={() => setShowComments(!showComments)}
                    >
                        <MessageCircle size={20} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-9 h-9 rounded-full text-gray-600 hover:text-green-500 hover:bg-green-50"
                    >
                        <Share2 size={20} />
                    </Button>
                </div>

                {/* Likes */}
                <p className="font-semibold text-sm mb-2 text-gray-900">
                    {post.likes.length > 0 ? `${post.likes.length} likes` : 'Be the first to like'}
                </p>

                {/* Caption */}
                <div className="mb-2 text-sm">
                    <span className="font-semibold mr-2 text-gray-900">{post.name}</span>
                    <span className="text-gray-700 leading-relaxed">{post.caption}</span>
                </div>

                {/* Tagged Products */}
                {post.products && post.products.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2 mt-2">
                        {post.products.map((product, index) => (
                            <Badge key={product._id || index} variant="secondary" className="bg-indigo-50 text-indigo-700 border border-indigo-100 gap-1.5 cursor-pointer hover:bg-indigo-100 transition-colors">
                                <Tag size={10} />
                                {product.title}
                                <span className="font-bold bg-white px-1 rounded text-indigo-800 text-xs">${product.price}</span>
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Toggle comments */}
                {post.comments.length > 0 && (
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="text-gray-400 text-xs mb-2 hover:text-gray-600 transition-colors"
                    >
                        {showComments ? 'Hide' : `View all ${post.comments.length}`} comments
                    </button>
                )}

                {showComments && (
                    <div className="mt-2 space-y-2 mb-3 max-h-48 overflow-y-auto">
                        {post.comments.map((comment, index) => (
                            <div key={comment._id || index} className="flex items-start gap-2 text-sm">
                                <span className="font-semibold text-gray-900">{comment.name}</span>
                                <span className="text-gray-600">{comment.text}</span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>

            {/* Add Comment */}
            <form onSubmit={handleComment} className="border-t border-gray-100 px-4 py-2 flex items-center gap-2 bg-gray-50/50">
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
                    className="text-indigo-600 font-semibold text-sm disabled:opacity-40 px-2 h-7"
                >
                    Post
                </Button>
            </form>
        </Card>
    );
};

export default PostCard;
