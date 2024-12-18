import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaComment, FaTrophy, FaFileAlt, FaSignOutAlt } from "react-icons/fa"; // Icone per i tasti
import "./../css/grouppage.css"; // File CSS per lo stile
import { leaveGroup } from "../../API.mjs";

const GroupPage = ({ setFooterOption, group, joinedGroup, setJoinedGroups}) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  
  
  const handleNavigate = (path) => {
    navigate(path); // Naviga verso le rispettive pagine (chat, challenge, materials)
  };

  const handleLeaveGroup = async() => {
    try {
      const response = await leaveGroup(group.id); 
      if (response) {
        const updatedJoinedGroups = joinedGroups.filter((joinedGroup) => joinedGroup.id !== group.id);
        setJoinedGroups(updatedJoinedGroups);
       
      }
    } catch (error) {
      console.error("Errore durante l'uscita dal gruppo:", error);
    }
    finally{
      setShowModal(false);
      navigate("/");
    }
  };



  return (
    <div className="group-page">
      <div className="group-header">
        <p>{group?.description || "Description not available"}</p>
      </div>
      <div className="action-buttons">
        <button className="chat-btn" onClick={() => {handleNavigate("/chat"), setFooterOption("Chat"), group={group}}}>
          <FaComment size={40} />
          Chat
        </button>
        <button className="challenge-btn" onClick={() => {handleNavigate("/challenges"), setFooterOption("Challenges"), group={group}}}>
          <FaTrophy size={40} />
          Challenge
        </button>
        <button className="materials-btn" onClick={() => {handleNavigate("/materials"), setFooterOption("Materials"), group={group}}}>
          <FaFileAlt size={40} />
          Materials
        </button>
        <Link className="leave-group" onClick={() => setShowModal(true)}>
       <FaSignOutAlt size={20} style={{ marginRight: "8px" }} />
       <span>Leave Group</span>
    </Link>
    </div>
    
    {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to leave the group?</p>
            <div className="modal-buttons">
              <button onClick={handleLeaveGroup} className="confirm-btn">
                Yes
              </button>
              <button onClick={() => setShowModal(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

   
  );
};

export default GroupPage;
