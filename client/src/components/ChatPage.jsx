import React, { useState } from 'react';
import '../css/chatpage.css'; // Import del file CSS per lo stile
import { FaMicrophone, FaStop, FaPaperclip, FaCamera } from 'react-icons/fa';
import { useEffect } from 'react';
import { useRef } from 'react';
//import { addMaterial } from '../../API.mjs'; // Import della funzione per aggiungere un nuovo materiale
const Chat = ({ setFooterOption, group }) => {
  // Messaggi statici
  const [messages, setMessages] = useState([
    { text: 'Does anyone have the concept maps from the last meeting?', isUserMessage: false },
    { text: 'Yes: ', isUserMessage: false },
    { text: `Welcome to ${group?.name} chat`, isUserMessage: false },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleAttachment = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    let type;
    if (file.type.startsWith('image/')) type = 'image';
    else if (file.type.startsWith('audio/')) type = 'audio';
    else type = 'document';

    try {
      await addMaterial({
        group_id: group.id,
        name: file.name,
        type: type,
        file: file
      });

      setMessages(prev => [...prev, 
        { text: `Attached: ${file.name}`, isUserMessage: true },
        { text: "I'll check this attachment later. Thanks!", isUserMessage: false }
      ]);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleCamera = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await addMaterial({
        group_id: group.id,
        name: file.name,
        type: 'image',
        file: file
      });

      setMessages(prev => [...prev, 
        { text: "📸 Photo sent", isUserMessage: true },
        { text: "I'll take a look at this photo later, but thank you very much!", isUserMessage: false }
      ]);
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false); // Stato per la registrazione del messaggio vocale

  useEffect(() => {
    setFooterOption('Chat');
  }, []);

  const handleSend = () => {
    if (!newMessage.trim()) {
      setError('Message could not be empty !!!!');
      return;
    }

    // Aggiungi il nuovo messaggio dell'utente
    const userMessage = { text: newMessage, isUserMessage: true };
    setMessages((prev) => [...prev, userMessage]);

    // Risposta automatica basata sul contenuto del messaggio
    setTimeout(() => {
      const responseMessage = getAutoResponse(newMessage);
      setMessages((prev) => [...prev, responseMessage]);
    }, 1000); // Risposta dopo 1 secondo

    setNewMessage(''); // Resetta l'input
    setError(null); // Reset degli errori
  };

  const handleMicrophoneClick = () => {
    // Toggle dello stato di registrazione
    if (isRecording) {
      // Se è in registrazione, invia il messaggio vocale
      setMessages((prev) => [...prev, { text: 'Audio message sent', isUserMessage: true }]);
      // Risposta automatica al messaggio vocale
      setTimeout(() => {
        const responseMessage = { text: 'Can I listen later?', isUserMessage: false };
        setMessages((prev) => [...prev, responseMessage]);
      }, 1000); // Risposta dopo 1 secondo
    }
    setIsRecording(!isRecording); // Cambia stato della registrazione
  };

  // Funzione per determinare la risposta automatica in base al messaggio
  const getAutoResponse = (userMessage) => {
    if (userMessage.toLowerCase().includes('map')) {
      return { text: 'I have the concept maps ready, would you like them in PDF or PNG format?', isUserMessage: false };
    } else if (userMessage.toLowerCase().includes('meeting')) {
      return { text: 'The last meeting was on Friday. Do you need the minutes?', isUserMessage: false };
    } else if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      return { text: 'Hello! How can I assist you today?', isUserMessage: false };
    } else if (userMessage.toLowerCase().includes('thanks') || userMessage.toLowerCase().includes('thank you')) {
      return { text: 'You are welcome!', isUserMessage: false };
    } else if (userMessage.toLowerCase().includes('of course') || userMessage.toLowerCase().includes('goodbye')) {
      return { text: 'Talk to you later!', isUserMessage: false };
    } else {
      return { text: 'I dont know what are you talking about :/', isUserMessage: false };
    }
  };

  return (
    <div className='chat-page'>
      <div className="chat-container">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className={msg.isUserMessage ? 'message user' : 'message received'}>
              <div className="message-avatar">
                <img 
                  src={msg.isUserMessage ? 'image_static/profile.png' : 'image_static/user.png'}
                  alt="User Avatar" 
                  className="avatar" 
                />
              </div>
              <div className="message-text">
                <p>{msg.text}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Welcome to {group?.name} chat</p>
        )}
      </div>
      <div className="input-container">
        <div className="action-icons">
          <FaMicrophone 
            onClick={handleMicrophoneClick} 
            color={isRecording ? "red" : "blue"} 
          />
          <FaPaperclip 
            onClick={() => fileInputRef.current.click()} 
            color="blue" 
          />
          <FaCamera 
            onClick={() => cameraInputRef.current.click()} 
            color="blue" 
          />
        </div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write a message..."
        />
        <button onClick={handleSend}>Send</button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleAttachment}
          style={{ display: 'none' }}
          accept="image/*,audio/*,.pdf,.doc,.docx"
        />
        <input
          type="file"
          ref={cameraInputRef}
          onChange={handleCamera}
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

export default Chat;
