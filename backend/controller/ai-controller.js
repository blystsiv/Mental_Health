import Chat from '../models/chatSchema.js';
import User from '../models/userModel.js';

export const getMessages = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    let chat = await Chat.findOne({ userId: user._id });
    if (!chat) chat = await Chat.create({ userId: user._id, history: [] });

    res.json(
      chat.history.map((entry) => {
        const [sender, ...textParts] = entry.split(':');
        return { sender: sender.trim(), text: textParts.join(':').trim() };
      }),
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMessage = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { sender, text } = req.body;
    if (!['user', 'ai'].includes(sender))
      return res.status(400).json({ message: 'Invalid sender' });

    const formatted = `${sender}: ${text}`;

    let chat = await Chat.findOne({ userId: user._id });
    if (!chat) {
      chat = new Chat({ userId: user._id, history: [formatted] });
    } else {
      chat.history.push(formatted);
    }

    await chat.save();
    res.status(201).json({ message: 'Message saved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
