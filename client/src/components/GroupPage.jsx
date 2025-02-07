import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaComment, FaTrophy, FaFileAlt, FaSignOutAlt, FaEdit, FaInfoCircle } from "react-icons/fa";
import "./../css/grouppage.css";
import { leaveGroup, updateGroup } from "../../API.mjs";

const GroupPage = ({ setFooterOption, group, setGroup }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false); // Stato per mostrare la descrizione del gruppo
  const [editedGroup, setEditedGroup] = useState({ name: group.name, SLD: group.SLD, level: group.level });

  useEffect(() => {
    setFooterOption("GroupPage");
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLeaveGroup = async () => {
    try {
      const response = await leaveGroup(group.id);
      if (response) {
        navigate("/");
      }
    } catch (error) {
      console.error("Errore durante l'uscita dal gruppo:", error);
    } finally {
      setShowModal(false);
    }
  };

  const handleEditChange = (e) => {
    setEditedGroup({ ...editedGroup, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    try {
      const response = await updateGroup(group.id, editedGroup);
      if (response) {
        setGroup({ ...group, ...editedGroup });
        setShowEditModal(false);
      }
    } catch (error) {
      console.error("Errore durante la modifica del gruppo:", error);
    }
  };

  return (
    <div className="group-page">
      <div className="group-card">
        <h2 className="group-card-title">{group.name}</h2>
       
        {/* Icona per la descrizione */}
        <FaInfoCircle 
          size={25} 
          className="info-icon" 
          onClick={() => setShowInfoModal(true)} 
          style={{ cursor: "pointer", position: "absolute", top: "10px", right: "10px" }}
        />
      </div>

      <div className="action-buttons">
        <button className="chat-btn" onClick={() => { handleNavigate("/chat"); setFooterOption("Chat"); }}>
          <FaComment size={40} />
          Chat
        </button>
        <button className="challenge-btn" onClick={() => { handleNavigate("/challenges"); setFooterOption("Challenges"); }}>
          <FaTrophy size={40} />
          Challenge
        </button>
        <button className="materials-btn" onClick={() => { handleNavigate("/materials"); setFooterOption("Materials"); }}>
          <FaFileAlt size={40} />
          Materials
        </button>
        {group.usercreate === 1 && (
          <button className="edit-btn" onClick={() => setShowEditModal(true)}>
            <FaEdit size={20} style={{ marginRight: "10px" }} />
            Edit
          </button>
        )}
        <Link className="leave-group" onClick={() => setShowModal(true)}>
          <FaSignOutAlt size={20} style={{ marginRight: "8px" }} />
          <span>Leave Group</span>
        </Link>
      </div>

      {/* Modal per confermare l'uscita dal gruppo */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Are you sure you want to leave the group?</h3>
            <p>You can join it again whenever you want.</p>
            <button onClick={handleLeaveGroup} className="btn btn-danger">Yes</button>
            <button onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Modal per modificare il gruppo */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Group</h3>
            
            <label>Group Name:*</label>
            <input 
              type="text" 
              name="name" 
              value={editedGroup.name} 
              onChange={handleEditChange}
              required 
            />

            <label>SLD:</label>
            <select 
              name="SLD" 
              value={editedGroup.SLD} 
              onChange={handleEditChange}
            >
              <option value="Dyslexia">Dyslexia</option>
              <option value="Dysgraphia">Dysgraphia</option>
              <option value="Dyscalculia">Dyscalculia</option>
              <option value="ADHD">ADHD</option>
              <option value="ASD">ASD</option>
            </select>

            <label>Level:</label> 
            <select
              name="level"
              value={editedGroup.level}
              onChange={handleEditChange}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option> 
              <option value="Advanced">Advanced</option>
            </select>

            <button 
              onClick={handleEditSubmit}
              disabled={!editedGroup.name} 
              className="btn btn-primary"
            >
              Save
            </button>
            <button onClick={() => setShowEditModal(false)} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Modal per la descrizione del gruppo */}
      {showInfoModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Info Group</h3>
            <p>{group.description}</p>
            <span>{group.SLD} - {group.level}</span>
            <span>{group.university} {group.number_of_participants}</span>
            <button onClick={() => setShowInfoModal(false)} className="btn btn-secondary">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupPage;
