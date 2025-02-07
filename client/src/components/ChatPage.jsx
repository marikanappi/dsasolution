import React, { useState, useRef, useEffect } from 'react';
import '../css/chatpage.css';
import { FaMicrophone, FaStop, FaPaperclip, FaCamera } from 'react-icons/fa';
import { addMaterial } from '../../API.mjs';

const predefinedResponses = {
  "What is this group about?": "This group is for discussing study materials and collaborating on projects.",
  "When is the next meeting?": "The next meeting is scheduled for Friday at 3 PM.",
  "Can someone share the latest notes?": "Sure! Here is the latest document: [link]",
  "Who is the group admin?": "The group admin is John Doe."
};

const randomResponses = [
  "Thanks for sharing!",
  "Got it!",
  "Interesting document!",
  "I'll check it out later.",
  "Looks great!"
];

const Chat = ({ setFooterOption, group }) => {
  const [messages, setMessages] = useState([
    { text: `Welcome to ${group?.name} chat`, isUserMessage: false },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    setFooterOption('Chat');
  }, []);

  const handleFileSelection = async (file) => {
    if (!file) return;
    
    let type;
    if (file.type.startsWith('image/')) type = 'image';
    else if (file.type.startsWith('audio/')) type = 'audio';
    else type = 'document';
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('group_id', group.id);
      formData.append('type', type);
      
      const result = await fetch('http://localhost:3001/material', {
        method: 'POST',
        body: formData
      });
      
      if (!result.ok) {
        throw new Error('Failed to upload file');
      }
      
      const data = await result.json();
      
      if (data) {
        setMessages((prev) => [...prev, { 
          text: `Attached: ${file.name}`, 
          isUserMessage: true,
          fileUrl: data.material.name
        }, { text: randomResponses[Math.floor(Math.random() * randomResponses.length)], isUserMessage: false }]);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages(prev => [...prev, { text: newMessage, isUserMessage: true }]);
      
      if (predefinedResponses[newMessage]) {
        setTimeout(() => {
          setMessages(prev => [...prev, { text: predefinedResponses[newMessage], isUserMessage: false }]);
        }, 500);
      }
      setNewMessage('');
    }
  };

  const handleMicrophoneClick = () => {
    setIsRecording((prev) => !prev);
    if (isRecording) {
      setMessages((prev) => [...prev, { text: 'Audio message sent', isUserMessage: true }, { text: randomResponses[Math.floor(Math.random() * randomResponses.length)], isUserMessage: false }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className='chat-page'>
      <div className="chat-container">
        {messages.map((msg, index) => (
          <div key={index} className={msg.isUserMessage ? 'message user' : 'message received'}>
            <div className="message-avatar">
              <img src={msg.isUserMessage ? 'image_static/profile.png' : 'image_static/user.png'} alt="User Avatar" className="avatar" />
            </div>
            <div className="message-text">
              <p>{msg.text}</p>
              {msg.fileUrl && (
                <div className="file-attachment">
                  {msg.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <img src={msg.fileUrl} alt="Attached file" style={{ maxWidth: '200px' }} />
                  ) : (
                    <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">View attachment</a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="input-container">
        <div className="action-icons">
          <FaMicrophone onClick={handleMicrophoneClick} color={isRecording ? "red" : "blue"} />
          <FaPaperclip onClick={() => fileInputRef.current.click()} color="blue" />
          <FaCamera onClick={() => cameraInputRef.current.click()} color="blue" />
        </div>
        <input 
          type="text" 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Write a message..." 
        />
        <button onClick={handleSendMessage}>Send</button>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={(e) => handleFileSelection(e.target.files[0])} 
          style={{ display: 'none' }} 
          accept="image/*,audio/*,.pdf,.doc,.docx" 
        />
        <input 
          type="file" 
          ref={cameraInputRef} 
          onChange={(e) => handleFileSelection(e.target.files[0])} 
          accept="image/*" 
          capture="environment" 
          style={{ display: 'none' }} 
        />
      </div>
    </div>
  );
};

export default Chat;
