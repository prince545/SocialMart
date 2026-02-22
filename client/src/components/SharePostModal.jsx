import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useUser, useAuth } from '@clerk/clerk-react';
const ENDPOINT = 'http://localhost:5000';
let socket;
import { X, Search, Send, User, Check } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SharePostModal = ({ post, onClose }) => {
    const { user: clerkUser } = useUser();
    const { getToken } = useAuth();
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [sharingTo, setSharingTo] = useState(null);
    const [sharedStatus, setSharedStatus] = useState({}); // { userId: boolean }

    useEffect(() => {
        socket = io(ENDPOINT);
        if (clerkUser) {
            socket.emit('join_chat', clerkUser.id);
        }
        return () => {
            socket.disconnect();
        };
    }, [clerkUser]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get('/api/auth/users');
                // Filter out self
                setUsers(data.filter(u => u._id !== clerkUser?.id && u.clerkId !== clerkUser?.id));
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch users:', err);
                setLoading(false);
            }
        };
        fetchUsers();
    }, [clerkUser]);

    const handleShare = async (user) => {
        setSharingTo(user._id);
        try {
            const token = await getToken();
            const { data } = await axios.post('/api/messages', {
                receiverId: user._id,
                content: 'Shared a post with you',
                sharedPostId: post._id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Emit socket event for real-time delivery
            socket.emit('send_message', {
                ...data,
                sender: clerkUser,
                receiverId: user._id
            });

            setSharedStatus(prev => ({ ...prev, [user._id]: true }));

            // Auto close after 1 second of showing "Sent"
            setTimeout(() => {
                setSharingTo(null);
            }, 1000);

        } catch (err) {
            console.error('Failed to share post:', err);
            alert('Failed to share post');
            setSharingTo(null);
        }
    };

    const filteredUsers = users.filter(u =>
        u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in slide-in-from-bottom-4 duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between bg-gray-50/50">
                    <h3 className="font-bold text-gray-900">Share to Chat</h3>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 hover:bg-gray-200">
                        <X size={18} />
                    </Button>
                </div>

                {/* Search */}
                <div className="p-3 border-b relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search people..."
                        className="pl-9 h-10 bg-gray-50 border-gray-200 focus-visible:ring-indigo-500 rounded-xl"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* User List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1 min-h-[300px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
                            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm">Finding contacts...</span>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 text-sm">
                            No users found
                        </div>
                    ) : (
                        filteredUsers.map(user => (
                            <div
                                key={user._id}
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50/50 group transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-10 h-10 ring-2 ring-indigo-50">
                                        <AvatarImage src={user.avatar} />
                                        <AvatarFallback className="bg-indigo-100 text-indigo-600 font-bold">
                                            {user.username?.charAt(0)?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-semibold text-gray-900 text-sm">{user.username}</div>
                                        <div className="text-xs text-gray-500">{user.email?.split('@')[0]}</div>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => handleShare(user)}
                                    disabled={sharingTo === user._id || sharedStatus[user._id]}
                                    className={`rounded-full px-4 text-xs font-bold transition-all ${sharedStatus[user._id]
                                        ? 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200 hover:border-green-200'
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                                        }`}
                                >
                                    {sharedStatus[user._id] ? (
                                        <div className="flex items-center gap-1">
                                            <Check size={14} strokeWidth={3} /> Sent
                                        </div>
                                    ) : sharingTo === user._id ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        'Send'
                                    )}
                                </Button>
                            </div>
                        ))
                    )}
                </div>

                {/* Post Preview footer */}
                <div className="p-3 bg-gray-50 border-t flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-gray-200 overflow-hidden flex-shrink-0">
                        <img src={post.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Sharing Post</p>
                        <p className="text-xs text-gray-700 truncate font-semibold">{post.caption || 'Product highlight'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SharePostModal;
