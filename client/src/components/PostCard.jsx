
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addLike, addComment } from '../redux/postSlice';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send, Tag } from 'lucide-react';

import { useUser } from '@clerk/clerk-react';

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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden transition-all hover:shadow-md">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white overflow-hidden shadow-sm">
                        {post.avatar ? (
                            <img src={post.avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-lg font-bold uppercase">{post.name?.charAt(0)}</span>
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 leading-tight">{post.name}</h3>
                        <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50 transition-colors">
                    <MoreHorizontal size={20} />
                </button>
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

            {/* Actions */}
            <div className="p-4 pb-2">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleLike}
                            className={`flex items-center space-x-1 transition-transform active:scale-95 ${isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                                }`}
                        >
                            <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
                        </button>
                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors"
                        >
                            <MessageCircle size={24} />
                        </button>
                        <button className="flex items-center space-x-1 text-gray-600 hover:text-green-500 transition-colors">
                            <Share2 size={24} />
                        </button>
                    </div>
                </div>

                {/* Likes Count */}
                <div className="font-semibold text-sm mb-2 text-gray-900">
                    {post.likes.length > 0 ? `${post.likes.length} likes` : 'Be the first to like'}
                </div>

                {/* Caption */}
                <div className="mb-2">
                    <span className="font-semibold mr-2 text-gray-900">{post.name}</span>
                    <span className="text-gray-700 leading-relaxed">{post.caption}</span>
                </div>

                {/* Tagged Products */}
                {post.products && post.products.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2 mt-3">
                        {post.products.map((product, index) => (
                            <div key={product._id || index} className="flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors cursor-pointer group border border-blue-100">
                                <Tag size={12} className="mr-1.5" />
                                <span className="group-hover:underline">{product.title}</span>
                                <span className="font-bold ml-1.5 bg-white px-1 rounded text-blue-800">${product.price}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Comments Section */}
                {post.comments.length > 0 && (
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="text-gray-500 text-sm mb-2 cursor-pointer hover:text-gray-700"
                    >
                        View all {post.comments.length} comments
                    </button>
                )}

                {showComments && (
                    <div className="mt-3 space-y-3 mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {post.comments.map((comment, index) => (
                            <div key={comment._id || index} className="flex items-start space-x-2 text-sm">
                                <span className="font-semibold text-gray-900">{comment.name}</span>
                                <span className="text-gray-700">{comment.text}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Comment */}
            <form onSubmit={handleComment} className="border-t border-gray-100 p-3 flex items-center bg-gray-50">
                <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 bg-transparent outline-none text-sm px-2 py-1 placeholder-gray-500"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="text-blue-600 font-semibold text-sm disabled:opacity-50 hover:text-blue-700 transition-colors px-2"
                >
                    Post
                </button>
            </form>
        </div>
    );
};

export default PostCard;
