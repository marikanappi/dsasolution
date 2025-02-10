import React, { useState, useRef, useEffect } from "react";
import { FaMicrophone, FaPaperclip, FaPaperPlane } from "react-icons/fa";
import "../css/chatpage.css";

const predefinedResponses = {
  "When is the next meeting?":
    "The next meeting is scheduled for Friday at 3 PM.",
  "Can someone share the latest notes?":
    "Sure! Here is the latest document: [link]",
  "Who is the group admin?": "The group admin is John Doe.",
};

const audioResponses = ["I'll listen later.", "Sorry, I can't help right now."];

const documentResponses = [
  "Thanks for the notes!",
  "This is really helpful!",
  "Great summary!",
  "I'll review this later.",
  "Looks well-organized!",
  "Awesome mind map!",
  "This simplifies the topic a lot!",
  "Much appreciated!",
  "Very clear, thanks!",
  "Perfect, just what I needed!",
];

const imageResponses = [
  "Nice picture!",
  "Looks great!",
  "Awesome shot!",
  "Thanks for sharing!",
  "Cool image!",
];

const Chat = ({ setFooterOption, group }) => {
  const [messages, setMessages] = useState([
    {
      text: `Welcome to ${group?.name} chat`,
      isUserMessage: false,
      sender: "Marika",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    setFooterOption("Chat");
  }, [setFooterOption]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages((prev) => [
        ...prev,
        { text: newMessage, isUserMessage: true, sender: "Mario" },
      ]);

      if (predefinedResponses[newMessage]) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              text: predefinedResponses[newMessage],
              isUserMessage: false,
              sender: "Marika",
            },
          ]);
        }, 500);
      }
      setNewMessage("");
    }
  };

  const handleFileSelection = async (file) => {
    if (!file) return;

    let type;
    if (file.type.startsWith("image/")) type = "image";
    else if (file.type.startsWith("audio/")) type = "audio";
    else type = "document";

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("group_id", group.id);
      formData.append("type", type);

      const result = await fetch("http://localhost:3001/material", {
        method: "POST",
        body: formData,
      });

      if (!result.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await result.json();

      if (data) {
        setMessages((prev) => [
          ...prev,
          {
            text: `Attached: ${file.name}`,
            isUserMessage: true,
            fileUrl: data.material.name,
          },
        ]);

        setTimeout(() => {
          const responseList =
            type === "image" ? imageResponses : documentResponses;
          const response =
            responseList[Math.floor(Math.random() * responseList.length)];
          setMessages((prev) => [
            ...prev,
            { text: response, isUserMessage: false, sender: "Marika" },
          ]);
        }, 1000);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleMicrophoneClick = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          });
          const audioUrl = URL.createObjectURL(audioBlob);
          setMessages((prev) => [
            ...prev,
            { audio: audioUrl, isUserMessage: true, sender: "Mario" },
          ]);

          setTimeout(() => {
            const response =
              audioResponses[Math.floor(Math.random() * audioResponses.length)];
            setMessages((prev) => [
              ...prev,
              { text: response, isUserMessage: false, sender: "Marika" },
            ]);
          }, 1000);
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    } else {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-header"></div>
      <div className="chat-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.isUserMessage ? "message user" : "message received"}
          >
            <div className="message-text">
              <strong>{msg.sender}:</strong> {msg.text && <p>{msg.text}</p>}
              {msg.audio && (
                <audio controls>
                  <source src={msg.audio} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
              )}
              {msg.fileUrl && msg.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <img
                  src={msg.fileUrl}
                  alt="Attached file"
                  style={{ maxWidth: "200px" }}
                />
              ) : msg.fileUrl ? (
                <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                  View attachment
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <FaPaperclip
          size={30}
          className="action-icon-attach"
          onClick={() => document.getElementById("fileInput").click()}
        />
        <input
          className="chat-input"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write a message..."
        />
        <FaMicrophone
          size={26}
          onClick={handleMicrophoneClick}
          className={`action-icon ${isRecording ? "recording" : ""}`}
          style={{ color: isRecording ? "red" : "black" }}
        />

        <FaPaperPlane
          size={30}
          className="action-icon-send"
          onClick={handleSendMessage}
        />
        <input
          type="file"
          id="fileInput"
          onChange={(e) => handleFileSelection(e.target.files[0])}
          style={{ display: "none" }}
          accept="image/*,audio/*,.pdf,.doc,.docx"
        />
      </div>
    </div>
  );
};

export default Chat;
