import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaComment, FaTrophy, FaFileAlt, FaSignOutAlt } from "react-icons/fa"; // Icone per i tasti
import "./../css/grouppage.css"; // File CSS per lo stile
import { leaveGroup } from "../../API.mjs";

const GroupPage = ({ setFooterOption, group, joinedGroup, setJoinedGroups }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setFooterOption("GroupPage");
    console.log("GroupPage: ", group);
  }, []);

  const handleNavigate = (path) => {
    navigate(path); // Naviga verso le rispettive pagine (chat, challenge, materials)
  };

  const handleLeaveGroup = async () => {
    try {
      const response = await leaveGroup(group.id);
      if (response) {
        const updatedJoinedGroups = joinedGroup.filter((joinedGroup) => joinedGroup.id !== group.id);
        setJoinedGroups(updatedJoinedGroups);

      }
    } catch (error) {
      console.error("Errore durante l'uscita dal gruppo:", error);
    }
    finally {
      setShowModal(false);
      navigate("/");
    }
  };

  return (
    <div className="group-page">
      <div className="group-card">
        <h2 className="group-card-title">{group.name}</h2>
        <span>{group.SLD} - {group.level}</span>
      </div>
      <div className="action-buttons">
        <button className="chat-btn" onClick={() => { handleNavigate("/chat"), setFooterOption("Chat"), group = { group } }}>
          <FaComment size={40} />
          Chat
        </button>
        <button className="challenge-btn" onClick={() => { handleNavigate("/challenges"), setFooterOption("Challenges"), group = { group } }}>
          <FaTrophy size={40} />
          Challenge
        </button>
        <button className="materials-btn" onClick={() => { handleNavigate("/materials"), setFooterOption("Materials"), group = { group } }}>
          <FaFileAlt size={40} />
          Materials
        </button>
        <Link className="leave-group" onClick={() => setShowModal(true)}>
          <FaSignOutAlt size={20} style={{ marginRight: "8px" }} />
          <span>Leave Group</span>
        </Link>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Are you sure you want to leave the group?</h3>
            <p>You can join it again whenever you want.</p>
              <button onClick={handleLeaveGroup} className="btn btn-danger">
                Yes
              </button>
              <button onClick={() => setShowModal(false)} className="btn btn-secondary">
                Cancel
              </button>
          </div>
        </div>
      )}
    </div>


  );
};

export default GroupPage;
