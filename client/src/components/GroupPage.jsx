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
import Select from "react-select";

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
  const deleteConfirm = "You can join it again whenever you want.";

  const [selectedSLD, setSelectedSLD] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  useEffect(() => {
    setFooterOption("GroupPage");
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  useEffect(() => {
    setSelectedSLD(sldOptions.find((option) => option.value === group.SLD) || null);
    setSelectedLevel(levelOptions.find((option) => option.value === group.level) || null);
  }, [group]); // Runs when `group` changes
  

  const sldOptions = [
    { value: "Dyslexia", label: "Dyslexia" },
    { value: "Dysgraphia", label: "Dysgraphia" },
    { value: "Dyscalculia", label: "Dyscalculia" },
    { value: "Dysorthography", label: "Dysorthography" },
  ];

  const levelOptions = [
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" },
  ];

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
        setGroup({ ...group, ...editedGroup }); // Merge to retain unchanged fields
      }
    } catch (error) {
      console.error("Error in modifying group information:", error);
    }
    setModalType(null);
  };

  return (
    <div className="group-page">
      <div >
        <FaArrowLeft
          size={25}
          className={`back-arrow ${modalType || showInfoModal ? "disabled" : ""}`}
          onClick={!modalType && !showInfoModal ? handleBack : null}
        />
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
          Challenges
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

            {isAdmin ? (
              <button
                onClick={() => setModalType("edit")}
                className="btn modal-button"
                style={{
                  backgroundColor: "#007bff",
                }}
                disabled={!isAdmin}
              >
                Edit Group Info
              </button>
            ) : (
              <span className="text-left p-2 mb-2">
                {" "}
                Only the creator of group has access to edit the information.{" "}
              </span>
            )}
            <button
              onClick={() => setModalType("leave")}
              className="btn btn-danger"
            >
              Leave Group
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
            <Select
              options={sldOptions}
              value={selectedSLD} // Uses state
              onChange={(selectedOption) => {
                setSelectedSLD(selectedOption); // Update state
                handleEditChange({
                  target: { name: "SLD", value: selectedOption.value },
                });
              }}
              styles={{
                menu: (provided) => ({
                  ...provided,
                  width: "300px",
                  textAlign: "left",
                }),
                control: (provided) => ({
                  ...provided,
                  textAlign: "left",
                }),
              }}
            />

            <label>Level:</label>
            <Select
              options={levelOptions}
              value={selectedLevel} // Uses state
              onChange={(selectedOption) => {
                setSelectedLevel(selectedOption); // Update state
                handleEditChange({
                  target: { name: "level", value: selectedOption.value },
                });
              }}
              styles={{
                menu: (provided) => ({
                  ...provided,
                  width: "300px",
                  textAlign: "left",
                }),
                control: (provided) => ({
                  ...provided,
                  textAlign: "left",
                }),
              }}
            />

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
            <h3 className="text-left ">
              Are you sure you want to leave group?
            </h3>
            <p className="text-left">{deleteConfirm}</p>
            <div className="row-buttons-container">
              <button onClick={handleLeaveGroup} className="btn btn-danger">
                Leave
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
