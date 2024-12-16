import React, { useState } from 'react';
import '../css/chatpage.css'; // Import del file CSS per lo stile
import { FaMicrophone, FaStop } from 'react-icons/fa'; // Icone del microfono

const Chat = ({ group }) => {
  // Messaggi statici
  const [messages, setMessages] = useState([
    { text: 'Does anyone have the concept maps from the last meeting?', isUserMessage: false },
    { text: 'Yes: ', isUserMessage: false },
    { text: `Welcome to ${group?.name} chat`, isUserMessage: false },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false); // Stato per la registrazione del messaggio vocale

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
      <div 
          className="microphone-icon"
          onClick={handleMicrophoneClick}
          style={{ cursor: 'pointer' }}
        >
          {isRecording ? <FaStop size={24} color="red" /> : <FaMicrophone size={24} color="blue" />}
        </div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write a message..."
        />
        <button onClick={handleSend}>Invia</button>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Chat;
