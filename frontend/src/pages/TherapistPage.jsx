import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import Loader from 'react-js-loader';
import Navbar from '../components/Navbar';
import '../styles/Therapist.css';

// eslint-disable-next-line no-undef
const API_KEY = process.env.REACT_APP_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const TypingAnimation = ({ color }) => (
  <div className="item text-2xl">
    <Loader type="ping-cube" bgColor={color} color={color} size={100} />
  </div>
);

const TherapistPage = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null);
  const username = localStorage.getItem('tokenUser');

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const username = localStorage.getItem('tokenUser');
    if (!username) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:4000/chat/${username}`);
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching chat history:', err);
        setMessages([]);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: 'user', text: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    await saveMessageToDB(newMessage);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const lastMessages = updatedMessages.slice(-10);
      const promptContext = lastMessages
        .map(msg => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`)
        .join('\n');

      const prompt = `You are a helpful and empathetic AI therapist. Answer the user's message clearly and concisely in the first person (as "I"). Do not repeat or rephrase the user's input. Focus directly on providing thoughtful, useful guidance or feedback. Use short paragraphs to separate ideas and make the response easy to read. Answer in Ukrainian \n\n${promptContext}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiText = response.text();

      const aiMessage = { sender: 'ai', text: aiText };
      setMessages(prev => [...prev, aiMessage]);

      await saveMessageToDB(aiMessage);
    } catch (err) {
      console.error('Error generating response:', err);
      const errorMsg = {
        sender: 'ai',
        text: 'Sorry, something went wrong. Please try again.',
      };
      setMessages(prev => [...prev, errorMsg]);
      await saveMessageToDB(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const saveMessageToDB = async message => {
    try {
      await fetch(`http://localhost:4000/chat/${username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });
    } catch (err) {
      console.error('Error saving message:', err);
    }
  };

  const handleInputChange = e => setInput(e.target.value);
  const handleKeyPress = e => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      <Navbar />
      <div className="therapist-container">
        <h1 className="heading">Your Personal AI Assistant</h1>
        <div ref={chatBoxRef} className="chat-box">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.sender === 'user' ? 'user-message' : 'ai-message'
              }`}
            >
              {msg.sender === 'ai' ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          ))}
          {loading && <TypingAnimation color="#007BFF" />}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="input-field"
          />
          <button onClick={handleSend} className="send-button">
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default TherapistPage;
