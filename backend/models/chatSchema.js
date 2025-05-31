import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  history: [String],
});

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
