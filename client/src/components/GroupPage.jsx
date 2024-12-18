import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaComment, FaTrophy, FaFileAlt } from "react-icons/fa"; // Icone per i tasti
import "./../css/grouppage.css"; // File CSS per lo stile

const GroupPage = ({ setFooterOption, group }) => {
  const navigate = useNavigate();
  
  const handleNavigate = (path) => {
    navigate(path); // Naviga verso le rispettive pagine (chat, challenge, materials)
  };

  return (
    <div className="group-page">
      <div className="group-header">
        <p>{group?.description || "Description not available"}</p>
      </div>
      <div className="action-buttons">
        <button className="action-btn" onClick={() => {handleNavigate("/chat"), setFooterOption("Chat"), group={group}}}>
          <FaComment size={30} />
          Chat
        </button>
        <button className="action-btn" onClick={() => {handleNavigate("/challenges"), setFooterOption("Challenges"), group={group}}}>
          <FaTrophy size={30} />
          Challenge
        </button>
        <button className="action-btn" onClick={() => {handleNavigate("/materials"), setFooterOption("Materials"), group={group}}}>
          <FaFileAlt size={30} />
          Materials
        </button>
      </div>
    </div>
  );
};

export default GroupPage;
