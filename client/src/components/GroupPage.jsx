import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaComment,
  FaTrophy,
  FaFileAlt,
  FaBars,
  FaArrowLeft,
  FaInfoCircle,
} from "react-icons/fa";
import "./../css/grouppage.css";
import { leaveGroup, updateGroup } from "../../API.mjs";
import GroupModal from "./GroupModal";
import { RiSettings5Fill } from "react-icons/ri";

const GroupPage = ({ setFooterOption, group, setGroup }) => {
  const navigate = useNavigate();
  const [showInfoModal, setShowInfoModal] = useState(false); // Stato per mostrare la descrizione del gruppo
  const [editedGroup, setEditedGroup] = useState({
    name: group.name,
    SLD: group.SLD,
    level: group.level,
  });
  const [modalType, setModalType] = useState(null);
  const isAdmin = group.usercreate === 1; // Replace with actual admin check
  const leaveText = isAdmin ? "Delete" : "Leave";
  const deleteConfirm = isAdmin ? "Deleting the group will remove all the data and cannot be undone." : "You can join it again whenever you want.";

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
    }
  };

  const handleBack = () => {
    navigate("/"); // Torna indietro alla pagina precedente
  };

  const handleEditChange = (e) => {
    setEditedGroup({ ...editedGroup, [e.target.name]: e.target.value });
  };

  const handleSettingsClick = () => {
    setModalType("main");
  };

  const handleEditSubmit = async () => {
    try {
      const response = await updateGroup(group.id, editedGroup);
      if (response) {
        setGroup({ ...editedGroup });
      }
    } catch (error) {
      console.error("Error in modifying group information.:", error);
    }
    setModalType(null);
  };

  return (
    <div className="group-page">
      <div className="back-arrow" onClick={handleBack}>
          <FaArrowLeft size={25} style={{ cursor: "pointer", color: "white", marginRight: "330px" }} />
        </div>
      <div className="group-card">
        <p className="group-card-title">{group.name}</p>

        {/* Icona per la descrizione */}
        <RiSettings5Fill
          className="info-icon setting"
          size={28}
          onClick={(e) => {
            e.stopPropagation();
            handleSettingsClick();
          }}
        />

        <FaInfoCircle
          size={26}
          className="info-icon bar"
          onClick={(e) => {
            e.stopPropagation();
            setShowInfoModal(true);
          }}
        />
      </div>

      <div className="action-buttons">
        <button
          className="chat-btn"
          onClick={() => {
            handleNavigate("/chat");
            setFooterOption("Chat");
          }}
        >
          <FaComment size={40} />
          Chat
        </button>
        <button
          className="challenge-btn"
          onClick={() => {
            handleNavigate("/challenges");
            setFooterOption("Challenges");
          }}
        >
          <FaTrophy size={40} />
          Challenge
        </button>
        <button
          className="materials-btn"
          onClick={() => {
            handleNavigate("/materials");
            setFooterOption("Materials");
          }}
        >
          <FaFileAlt size={40} />
          Materials
        </button>
      </div>

      {modalType === "main" && (
        <div className="modal">
          <div className="modal-content">
            <h3 className="text-center">Group Settings</h3>

            {isAdmin ? <button
              onClick={() => setModalType("edit")}
              className="btn btn-primary"
              disabled={!isAdmin}
            >
              Edit Group Info
            </button> :
              <span className="text-left p-2 mb-2"> Only the creator of group has access to edit the information of group. </span>}
            <button
              onClick={() => setModalType("leave")}
              className="btn btn-danger"
            >
              {leaveText} Group
            </button>
            <button
              onClick={() => setModalType(null)}
              className="btn modal-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {modalType === "edit" && (
        <div className="modal">
          <div className="modal-content text-left">
            <h3 className="text-center">Edit Group</h3>
            <label>Group Name:*</label>
            <input
              className="m-0"
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
            <div className="row-buttons-container">
              <button
                onClick={handleEditSubmit}
                disabled={!editedGroup.name}
                className="btn btn-success"
              >
                Save
              </button>
              <button
                onClick={() => setModalType("main")}
                className="btn modal-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {modalType === "leave" && (
        <div className="modal">
          <div className="modal-content">
            <h3 className="text-left ">Are you sure you want to {leaveText} group?</h3>
            <p className="text-left">{deleteConfirm}</p>
            <div className="row-buttons-container">
              <button onClick={handleLeaveGroup} className="btn btn-danger">
                {leaveText}
              </button>
              <button
                onClick={() => setModalType("main")}
                className="btn modal-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal per la descrizione del gruppo */}
      {showInfoModal && (
        <GroupModal selectedGroup={group} setSelectedGroup={setShowInfoModal} />
      )}
    </div>
  );
};

export default GroupPage;
