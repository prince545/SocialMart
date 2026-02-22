import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import io from 'socket.io-client';
import {
    Send, User, Users, CheckCheck, Check, Sparkles, Search, MoreVertical,
    Image, Smile, Phone, Video, Info, ArrowLeft, ShoppingBag,
    Heart, Star, Clock, TrendingUp, Shield, Zap, MessageCircle,
    Camera, Mic, Gift, ThumbsUp, Share2, Bookmark
} from 'lucide-react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const ENDPOINT = 'http://localhost:5000';
let socket;

const Chat = () => {
    const { user: clerkUser, isLoaded } = useUser();
    const { getToken } = useAuth();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState('');
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showAttachments, setShowAttachments] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [unreadCounts, setUnreadCounts] = useState({});

    const typingTimeoutRef = useRef(null);
    const scrollRef = useRef();
    const fileInputRef = useRef();
    const messagesEndRef = useRef();

    // Check mobile view
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        if (!socket) return;

        socket.on('receive_message', (data) => {
            if (selectedUser && (data.sender === selectedUser._id || data.sender._id === selectedUser._id)) {
                setMessages((prev) => [...prev, data]);
                socket.emit('mark_read', { senderId: data.sender._id || data.sender, receiverId: clerkUser.id });

                // Update unread counts
                setUnreadCounts(prev => ({
                    ...prev,
                    [data.sender._id || data.sender]: 0
                }));
            } else if (data.sender !== clerkUser.id) {
                // Increment unread count for other users
                setUnreadCounts(prev => ({
                    ...prev,
                    [data.sender._id || data.sender]: (prev[data.sender._id || data.sender] || 0) + 1
                }));
            }
        });

        socket.on('display_typing', (data) => {
            if (selectedUser && data.senderName === selectedUser.username) {
                setTypingUser(data.senderName);
                setIsTyping(true);
            }
        });

        socket.on('hide_typing', () => {
            setIsTyping(false);
            setTypingUser('');
        });

        socket.on('get_online_users', (users) => {
            setOnlineUsers(users);
        });

        socket.on('messages_read', ({ receiverId }) => {
            if (selectedUser && selectedUser._id === receiverId) {
                setMessages(prev => prev.map(msg => ({ ...msg, read: true })));
            }
        });

        return () => {
            socket.off('receive_message');
            socket.off('display_typing');
            socket.off('hide_typing');
            socket.off('get_online_users');
            socket.off('messages_read');
        };
    }, [selectedUser, clerkUser]);

    const markAsRead = async (senderId) => {
        try {
            await axios.put(`/api/messages/read/${senderId}`);
            socket.emit('mark_read', { senderId, receiverId: clerkUser.id });

            // Clear unread count for this user
            setUnreadCounts(prev => ({
                ...prev,
                [senderId]: 0
            }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);

        if (!socket || !selectedUser) return;

        socket.emit('typing', {
            receiverId: selectedUser._id,
            senderName: clerkUser.username || clerkUser.firstName
        });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop_typing', { receiverId: selectedUser._id });
        }, 2000);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get('/api/auth/users');
                setUsers(data.filter(u => u._id !== clerkUser?.id));

                // Initialize unread counts
                const counts = {};
                data.forEach(u => {
                    if (u._id !== clerkUser?.id) {
                        counts[u._id] = 0;
                    }
                });
                setUnreadCounts(counts);
            } catch (err) {
                console.error(err);
            }
        };
        if (clerkUser) fetchUsers();
    }, [clerkUser]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedUser) return;
            try {
                const { data } = await axios.get(`/api/messages/${selectedUser._id}`);
                setMessages(data);
                markAsRead(selectedUser._id);
            } catch (err) {
                console.error(err);
            }
        };
        fetchMessages();
    }, [selectedUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessageHandler = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            const { data } = await axios.post('/api/messages', {
                receiverId: selectedUser._id,
                content: newMessage
            });

            socket.emit('send_message', {
                ...data,
                sender: clerkUser,
                receiverId: selectedUser._id
            });

            setMessages([...messages, { ...data, sender: clerkUser }]);
            setNewMessage('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleAiSuggest = async () => {
        if (!selectedUser || messages.length === 0) return;

        setIsAiLoading(true);
        try {
            const chatContext = messages.map(m => ({
                text: m.content,
                senderModel: m.sender === clerkUser.id ? 'Me' : 'User'
            }));

            const { data } = await axios.post('/api/ai/suggest-chat', {
                messages: chatContext,
                context: `Chatting with ${selectedUser.username} about shopping on SocialMart`
            });

            if (data && data.suggestion) {
                setNewMessage(data.suggestion);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleFileUpload = () => {
        fileInputRef.current?.click();
    };

    const handleEmojiSelect = (emoji) => {
        setNewMessage(prev => prev + emoji);
        setShowEmojiPicker(false);
    };

    const isUserOnline = (userId) => {
        return onlineUsers.some(u => u.userId === userId);
    };

    const filteredUsers = users.filter(u =>
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getLastMessage = (userId) => {
        // This would come from an API in production
        return null;
    };

    const formatTime = (date) => {
        const now = new Date();
        const messageDate = new Date(date);
        const diffDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return messageDate.toLocaleDateString([], { weekday: 'short' });
        } else {
            return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your conversations...</p>
                </div>
            </div>
        );
    }

    if (!clerkUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
                    <MessageCircle className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Join the Conversation</h2>
                    <p className="text-gray-600 mb-6">Sign in to chat with sellers and other shoppers on SocialMart</p>
                    <Link to="/sign-in">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6">
                            Sign In to Chat
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 py-4 md:py-8 px-2 md:px-4 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto h-[calc(100vh-80px)] relative z-10">
                <div className="flex h-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">

                    {/* Sidebar */}
                    <div className={`${isMobileView && selectedUser ? 'hidden' : 'w-full md:w-1/3'} border-r border-gray-200 flex flex-col bg-white/90`}>

                        {/* Sidebar Header */}
                        <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-white text-lg">Messages</h2>
                                <Badge className="bg-white/20 text-white border-0">
                                    {users.length} Contacts
                                </Badge>
                            </div>

                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    className="w-full bg-white/20 text-white placeholder-white/70 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Tabs */}
                        <Tabs defaultValue="all" className="px-4 pt-4">
                            <TabsList className="w-full bg-gray-100">
                                <TabsTrigger value="all" className="flex-1">All Chats</TabsTrigger>
                                <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
                                <TabsTrigger value="online" className="flex-1">Online</TabsTrigger>
                            </TabsList>

                            <TabsContent value="all" className="mt-4">
                                {/* Users List */}
                                <div className="space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
                                    {filteredUsers.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <User className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                            <p>No conversations yet</p>
                                            <p className="text-sm">Start chatting with sellers!</p>
                                        </div>
                                    ) : (
                                        filteredUsers.map(u => {
                                            const isOnline = isUserOnline(u._id);
                                            const unread = unreadCounts[u._id] || 0;
                                            const lastMsg = getLastMessage(u._id);

                                            return (
                                                <div
                                                    key={u._id}
                                                    onClick={() => {
                                                        setSelectedUser(u);
                                                        if (isMobileView) {
                                                            // Handle mobile view
                                                        }
                                                    }}
                                                    className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all ${selectedUser?._id === u._id
                                                            ? 'bg-indigo-50 border-l-4 border-indigo-600'
                                                            : 'hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <div className="relative">
                                                        <Avatar className="w-12 h-12 border-2 border-white shadow-md">
                                                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                                                {u.username?.charAt(0).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        {isOnline && (
                                                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <h3 className="font-semibold text-gray-900 truncate">
                                                                {u.username}
                                                            </h3>
                                                            {lastMsg && (
                                                                <span className="text-xs text-gray-500">
                                                                    {formatTime(lastMsg.createdAt)}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center justify-between mt-1">
                                                            <p className="text-sm text-gray-600 truncate max-w-[150px]">
                                                                {lastMsg?.content || 'Start a conversation'}
                                                            </p>
                                                            {unread > 0 && (
                                                                <Badge className="bg-indigo-600 text-white rounded-full px-2 py-0.5 text-xs">
                                                                    {unread}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="unread">
                                <div className="text-center py-8 text-gray-500">
                                    <Bookmark className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                    <p>No unread messages</p>
                                </div>
                            </TabsContent>

                            <TabsContent value="online">
                                <div className="text-center py-8 text-gray-500">
                                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                    <p>{onlineUsers.length} users online</p>
                                </div>
                            </TabsContent>
                        </Tabs>

                        {/* Quick Stats */}
                        <div className="mt-auto p-4 border-t border-gray-200 bg-gray-50/50">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-600">{onlineUsers.length} online</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-indigo-600" />
                                    <span className="text-gray-600">Secure Chat</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Chat Area */}
                    <div className={`${isMobileView && !selectedUser ? 'hidden' : 'w-full md:w-2/3'} flex flex-col bg-white/95`}>
                        {selectedUser ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center space-x-3">
                                        {isMobileView && (
                                            <button
                                                onClick={() => setSelectedUser(null)}
                                                className="mr-2 p-2 hover:bg-gray-100 rounded-lg"
                                            >
                                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                                            </button>
                                        )}

                                        <div className="relative">
                                            <Avatar className="w-10 h-10 border-2 border-indigo-100">
                                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                                    {selectedUser.username?.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            {isUserOnline(selectedUser._id) && (
                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                                {selectedUser.username}
                                                {selectedUser.isSeller && (
                                                    <Badge className="bg-indigo-100 text-indigo-700 border-0 text-xs">
                                                        Seller
                                                    </Badge>
                                                )}
                                            </h3>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                {isUserOnline(selectedUser._id) ? (
                                                    <>
                                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                        Online
                                                    </>
                                                ) : (
                                                    'Offline'
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                            <Phone className="w-5 h-5 text-gray-600" />
                                        </button>
                                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                            <Video className="w-5 h-5 text-gray-600" />
                                        </button>
                                        <button
                                            onClick={() => setShowUserInfo(!showUserInfo)}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <Info className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
                                    <div className="space-y-4">
                                        {messages.length === 0 ? (
                                            <div className="text-center py-12">
                                                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                                    Start a conversation
                                                </h3>
                                                <p className="text-gray-500">
                                                    Say hello to {selectedUser.username}
                                                </p>
                                            </div>
                                        ) : (
                                            messages.map((m, idx) => {
                                                const isMyMessage = m.sender === clerkUser.id || m.sender._id === clerkUser.id;
                                                const showAvatar = idx === 0 ||
                                                    messages[idx - 1]?.sender !== m.sender;

                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} items-end gap-2`}
                                                    >
                                                        {!isMyMessage && showAvatar && (
                                                            <Avatar className="w-8 h-8 mb-1">
                                                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs">
                                                                    {selectedUser.username?.charAt(0).toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        )}

                                                        <div
                                                            className={`max-w-[70%] group relative ${isMyMessage ? 'order-1' : 'order-2'
                                                                }`}
                                                        >
                                                            {m.sharedPost ? (
                                                                <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden mb-2">
                                                                    <img
                                                                        src={m.sharedPost.image}
                                                                        alt="Shared product"
                                                                        className="w-full h-40 object-cover"
                                                                    />
                                                                    <div className="p-3">
                                                                        <p className="font-semibold text-gray-900 mb-1">
                                                                            {m.sharedPost.title}
                                                                        </p>
                                                                        <p className="text-sm text-gray-600 mb-2">
                                                                            {m.sharedPost.description}
                                                                        </p>
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-lg font-bold text-indigo-600">
                                                                                ${m.sharedPost.price}
                                                                            </span>
                                                                            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                                                                View Product
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    className={`p-3 rounded-2xl shadow-sm ${isMyMessage
                                                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                                                                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                                                        }`}
                                                                >
                                                                    <p className="text-sm leading-relaxed">{m.content}</p>
                                                                </div>
                                                            )}

                                                            <div className={`flex items-center gap-1 mt-1 text-xs ${isMyMessage ? 'justify-end' : 'justify-start'
                                                                } ${isMyMessage ? 'text-gray-500' : 'text-gray-400'}`}>
                                                                <span>{new Date(m.createdAt).toLocaleTimeString([], {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}</span>
                                                                {isMyMessage && (
                                                                    <span className="ml-1">
                                                                        {m.read ? (
                                                                            <CheckCheck className="w-3.5 h-3.5 text-indigo-500" />
                                                                        ) : (
                                                                            <Check className="w-3.5 h-3.5" />
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}

                                        {isTyping && (
                                            <div className="flex justify-start">
                                                <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-2xl rounded-bl-none">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex space-x-1">
                                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                        </div>
                                                        <span>{typingUser} is typing...</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div ref={messagesEndRef} />
                                    </div>
                                </div>

                                {/* Message Input */}
                                <form onSubmit={sendMessageHandler} className="p-4 bg-white border-t border-gray-200">
                                    <div className="flex items-end gap-2">
                                        <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2">
                                            <input
                                                type="text"
                                                placeholder={isAiLoading ? "AI is thinking..." : "Type a message..."}
                                                className="w-full bg-transparent focus:outline-none text-gray-900"
                                                value={newMessage}
                                                onChange={handleTyping}
                                            />
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                                    className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                                                >
                                                    <Smile className="w-5 h-5 text-gray-500" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleFileUpload}
                                                    className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                                                >
                                                    <Image className="w-5 h-5 text-gray-500" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleAiSuggest}
                                                    disabled={isAiLoading || !selectedUser}
                                                    className={`p-1 rounded-lg transition-colors ${isAiLoading
                                                            ? 'bg-indigo-100'
                                                            : 'hover:bg-gray-200'
                                                        }`}
                                                    title="AI Suggest Reply"
                                                >
                                                    <Sparkles className={`w-5 h-5 text-indigo-600 ${isAiLoading ? 'animate-spin' : ''
                                                        }`} />
                                                </button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    accept="image/*"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim()}
                                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
                                <div className="text-center max-w-md px-4">
                                    <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <MessageCircle className="w-12 h-12 text-indigo-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                        Your Messages
                                    </h3>
                                    <p className="text-gray-600 mb-8">
                                        Connect with sellers, ask questions about products,
                                        and get personalized recommendations
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 text-left">
                                        <div className="bg-indigo-50 p-4 rounded-xl">
                                            <Zap className="w-5 h-5 text-indigo-600 mb-2" />
                                            <p className="text-sm font-medium text-gray-900">Quick Responses</p>
                                            <p className="text-xs text-gray-600">Get instant replies</p>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-xl">
                                            <Shield className="w-5 h-5 text-purple-600 mb-2" />
                                            <p className="text-sm font-medium text-gray-900">Secure</p>
                                            <p className="text-xs text-gray-600">End-to-end encrypted</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Info Sidebar (for desktop) */}
                    {selectedUser && showUserInfo && !isMobileView && (
                        <div className="w-80 border-l border-gray-200 bg-white p-4 overflow-y-auto">
                            <div className="text-center mb-6">
                                <Avatar className="w-24 h-24 mx-auto mb-3 border-4 border-indigo-100">
                                    <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-2xl">
                                        {selectedUser.username?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <h3 className="font-bold text-lg text-gray-900">{selectedUser.username}</h3>
                                <p className="text-sm text-gray-500">@{selectedUser.username?.toLowerCase()}</p>

                                {selectedUser.isSeller && (
                                    <Badge className="mt-2 bg-indigo-100 text-indigo-700 border-0">
                                        Verified Seller
                                    </Badge>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="border-t border-gray-200 pt-4">
                                    <h4 className="font-semibold text-gray-900 mb-3">About</h4>
                                    <p className="text-sm text-gray-600">
                                        {selectedUser.bio || "No bio provided"}
                                    </p>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <h4 className="font-semibold text-gray-900 mb-3">Stats</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-gray-50 p-3 rounded-lg text-center">
                                            <div className="text-lg font-bold text-gray-900">0</div>
                                            <div className="text-xs text-gray-500">Products</div>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg text-center">
                                            <div className="text-lg font-bold text-gray-900">0</div>
                                            <div className="text-xs text-gray-500">Followers</div>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg text-center">
                                            <div className="text-lg font-bold text-gray-900">
                                                {messages.length}
                                            </div>
                                            <div className="text-xs text-gray-500">Messages</div>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-lg font-bold text-gray-900">5.0</span>
                                            </div>
                                            <div className="text-xs text-gray-500">Rating</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <h4 className="font-semibold text-gray-900 mb-3">Shared Media</h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[1, 2, 3].map((_, i) => (
                                            <div key={i} className="aspect-square bg-gray-100 rounded-lg"></div>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-4"
                                    onClick={() => setShowUserInfo(false)}
                                >
                                    Close Info
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
