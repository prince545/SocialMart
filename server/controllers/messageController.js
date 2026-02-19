
const Message = require('../models/Message');

// @route   GET api/messages/:userId
// @desc    Get conversation with a specific user
// @access  Private
exports.getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const myId = req.user.id;

        const messages = await Message.find({
            $or: [
                { sender: myId, receiver: userId },
                { sender: userId, receiver: myId }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST api/messages
// @desc    Send a message (Persistence)
// @access  Private
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;

        const newMessage = new Message({
            sender: req.user.id,
            receiver: receiverId,
            content
        });

        const savedMessage = await newMessage.save();

        // Populate sender/receiver info if needed, or just return as is
        // const populatedMessage = await savedMessage.populate('sender', 'name image').populate('receiver', 'name image').execPopulate();

        res.status(201).json(savedMessage);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT api/messages/read/:senderId
// @desc    Mark messages from a specific sender as read
// @access  Private
exports.markMessagesRead = async (req, res) => {
    try {
        const { senderId } = req.params;
        const receiverId = req.user.id;

        await Message.updateMany(
            { sender: senderId, receiver: receiverId, read: false },
            { $set: { read: true } }
        );

        res.json({ msg: 'Messages marked as read' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
