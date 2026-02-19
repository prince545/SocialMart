
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const compression = require('compression');

const authRoutes = require('./routes/auth');

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Make sure this matches frontend URL
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', require('./routes/posts'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/upload', require('./routes/upload'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Socket.io Logic
let onlineUsers = [];

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join_chat', (userId) => {
        socket.join(userId);
        if (!onlineUsers.some(user => user.userId === userId)) {
            onlineUsers.push({ userId, socketId: socket.id });
        }
        io.emit('get_online_users', onlineUsers);
        console.log(`User ${userId} joined their room`);
    });

    socket.on('send_message', (data) => {
        // data: { receiverId, content, sender, ... }
        const { receiverId } = data;
        io.to(receiverId).emit('receive_message', data);
    });

    socket.on('typing', (data) => {
        const { receiverId, senderName } = data;
        io.to(receiverId).emit('display_typing', { senderName });
    });

    socket.on('stop_typing', (data) => {
        const { receiverId } = data;
        io.to(receiverId).emit('hide_typing');
    });

    socket.on('mark_read', (data) => {
        const { senderId, receiverId } = data;
        // Notify sender that receiver read the messages
        io.to(senderId).emit('messages_read', { receiverId });
    });

    socket.on('disconnect', () => {
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
        io.emit('get_online_users', onlineUsers);
        console.log('User Disconnected', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
