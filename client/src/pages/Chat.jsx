
import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import io from 'socket.io-client';
import { Send, User, CheckCheck, Check, Sparkles } from 'lucide-react';

import { useUser, useAuth } from '@clerk/clerk-react';

const ENDPOINT = 'http://localhost:5000';
let socket;

const Chat = () => {
    const { user: clerkUser, isLoaded } = useUser();
    const { getToken } = useAuth();
    const [users, setUsers] = useState([]); // List of users to chat with
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState('');
    const [onlineUsers, setOnlineUsers] = useState([]);
    const typingTimeoutRef = useRef(null);
    const scrollRef = useRef();

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
                // If we are looking at this chat, mark as read immediately
                socket.emit('mark_read', { senderId: data.sender._id || data.sender, receiverId: clerkUser.id });
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
        } catch (err) {
            console.error(err);
        }
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);

        if (!socket || !selectedUser) return;

        socket.emit('typing', { receiverId: selectedUser._id, senderName: clerkUser.username || clerkUser.firstName });

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

                // Mark messages as read when opening chat
                markAsRead(selectedUser._id);

            } catch (err) {
                console.error(err);
            }
        };
        fetchMessages();
    }, [selectedUser]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
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
        try {
            const { data } = await axios.get('/api/ai/recommendations');
            if (data && data.length > 0) {
                // Pick a random product for suggestion
                const product = data[Math.floor(Math.random() * data.length)];
                setNewMessage(`Check out this amazing product: ${product.title}!`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const isUserOnline = (userId) => {
        return onlineUsers.some(u => u.userId === userId);
    };

    if (!isLoaded) return <div className="text-center py-10">Loading...</div>;
    if (!clerkUser) return <div className="text-center py-10">Please login to chat.</div>;

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 h-[calc(100vh-100px)]">
            <div className="flex h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Sidebar */}
                <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <h2 className="font-bold text-gray-700">Chats</h2>
                    </div>
                    <ul>
                        {users.map(u => (
                            <li
                                key={u._id}
                                onClick={() => setSelectedUser(u)}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition ${selectedUser?._id === u._id ? 'bg-blue-100' : ''}`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                                            <User size={20} />
                                        </div>
                                        {isUserOnline(u._id) && (
                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                        )}
                                    </div>
                                    <span className="font-medium text-gray-800">{u.username}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Main Chat Area */}
                <div className="w-2/3 flex flex-col">
                    {selectedUser ? (
                        <>
                            <div className="p-4 bg-white border-b border-gray-200 flex items-center space-x-3 shadow-sm z-10">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                                        <User size={20} />
                                    </div>
                                    {isUserOnline(selectedUser._id) && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">{selectedUser.username}</h3>
                                    <p className="text-xs text-gray-500">{isUserOnline(selectedUser._id) ? 'Online' : 'Offline'}</p>
                                </div>
                            </div>

                            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
                                {messages.map((m, idx) => {
                                    const isMyMessage = m.sender === clerkUser.id || m.sender._id === clerkUser.id;
                                    return (
                                        <div key={idx} ref={scrollRef} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] p-3 rounded-lg shadow-sm relative ${isMyMessage ? 'bg-blue-600 text-white rounded-br-none pr-9' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}`}>
                                                <p>{m.content}</p>
                                                <div className={`flex items-center justify-end space-x-1 mt-1 ${isMyMessage ? 'text-blue-200' : 'text-gray-400'}`}>
                                                    <span className="text-[10px]">
                                                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {isMyMessage && (
                                                        <span>
                                                            {m.read ? <CheckCheck size={14} /> : <Check size={14} />}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-200 text-gray-500 text-xs px-3 py-1 rounded-full animate-pulse">
                                            {typingUser} is typing...
                                        </div>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={sendMessageHandler} className="p-4 bg-white border-t border-gray-200 flex space-x-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={handleTyping}
                                    placeholder="Type a message..."
                                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button type="button" onClick={handleAiSuggest} className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition" title="Get AI Suggestion">
                                    <Sparkles size={20} />
                                </button>
                                <button type="submit" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
                                    <Send size={20} />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-500">
                            Select a user to start chatting
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
