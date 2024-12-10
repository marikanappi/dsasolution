import React, { useState, useEffect } from "react";
import { FaPaperPlane, FaMicrophone } from "react-icons/fa"; // Icone per l'invio e il microfono
import "./chat.css";

const ChatPage = ({ setFooterOption }) => {
  const [messages, setMessages] = useState([
    { id: 1, user: "System", text: "Welcome Mario !!" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false); // Stato per controllare se stiamo registrando

  const responseMap = {
    "when is the next meeting?": "let's try to organize something this week!",
    "can you upload the new concept maps to the materials?": "let's see if anyone responds -.-'",
    "would it be good to review svm tomorrow?": "yes, perfect",
    "what time works for everyone for the next study session?": "Let's suggest a few times and see what fits best for everyone!",
    "should we focus on theory or coding during the next meeting?": "Maybe a balance of both would be great, we can discuss concepts and then practice with code examples!",
    "can someone take notes during the next meeting?": "I can take notes, or we can rotate the responsibility each time.",
    "who wants to lead the next study session?": "Anyone interested in taking the lead? It would be nice to have different perspectives!",
    "can we schedule a group study session this weekend?": "How about Saturday afternoon? Let's check who is available!",
    "can we create a shared document for our study materials?": "Definitely! I’ll set up a Google Doc so we can all contribute.",
    "is anyone willing to explain backpropagation during the next session?": "I can prepare a quick explanation with some examples for the next meeting.",
    "should we meet online or in person next time?": "Let's vote on it! If most people are comfortable, we can meet in person, otherwise, we can continue online.",
    "do we want to practice more coding or discuss theory next time?": "I suggest we do a mix! A bit of theory followed by hands-on coding exercises.",
    "is everyone ready for the group presentation next week?": "I think we should do a dry run before the actual presentation. How about doing that on Friday?",
    "can we extend the study session by 30 minutes?": "Sure, but let's check if everyone is available for the extended time first.",
    "should we invite a guest speaker for our next session?": "That sounds interesting! Let’s discuss potential speakers and topics.",
    "who wants to lead the review of machine learning algorithms next week?": "Anyone up for leading the discussion? I can prepare a few materials to help!",
    "yes, of course": ":)"
  };

  // Funzione per gestire l'invio del messaggio
  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, user: "User", text: newMessage }
      ]);

      const response =
        responseMap[newMessage.toLowerCase()] ||
        "I'm sorry, I don't understand. Can you please rephrase?";

      setNewMessage(""); // Reset input

      // Aggiungi la risposta del sistema dopo un breve ritardo
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: prevMessages.length + 1, user: "System", text: response }
        ]);
      }, 1000);
    }
  };

  // Funzione per gestire la registrazione vocale
  const handleStartStopRecording = () => {
    if (isRecording) {
      // Quando si ferma la registrazione, invia il messaggio audio con l'icona del microfono
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, user: "User", text: <><FaMicrophone /> Audio message</> }
      ]);

      // Risposta del sistema
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: prevMessages.length + 1, user: "System", text: "Can I answer later ?" }
        ]);
      }, 1000);
    } else {
      // Inizia la registrazione
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, user: "User", text: "Recording audio..." }
      ]);
    }
    setIsRecording(!isRecording); // Alterna lo stato di registrazione
  };

  useEffect(() => {
    // Scrolla verso il basso ogni volta che vengono aggiunti nuovi messaggi
    const messageContainer = document.querySelector(".chat-messages");
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }, [messages]);

  return (
    <div className="chat-page">
      <div className="chat-messages scrollable-chat">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-container ${
              message.user === "User" ? "sent" : "received"
            }`}
          >
            {message.user === "System" && (
              <img
                src="talk2.png"
                alt="System Profile"
                className="profile-image"
              />
            )}
            <div className="message-bubble">
              <p>{message.text}</p>
            </div>
            {message.user === "User" && (
              <img
                src="talk1.png"
                alt="User Profile"
                className="profile-image"
              />
            )}
          </div>
        ))}
      </div>

      <div className="chat-input d-flex align-items-center">
        <button className="microphone-btn" onClick={handleStartStopRecording}>
          <FaMicrophone />
        </button>

        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="form-control"
        />

        <button onClick={handleSendMessage} className="send-btn">
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
