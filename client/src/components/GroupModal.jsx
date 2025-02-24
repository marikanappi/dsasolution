import React from "react";

const GroupModal = ({ selectedGroup, setSelectedGroup }) => {
  if (!selectedGroup) return null; // Prevents rendering when no group is selected

  return (
    <div className="modal-overlay" onClick={() => setSelectedGroup(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img
          src={selectedGroup.picture}
          alt={selectedGroup.name}
          className="modal-group-image"
        />
        <h2 className="modal-group-name">{selectedGroup.name}</h2>
        <p className="modal-group-university">{selectedGroup.university}</p>
        <p className="modal-group-level">{selectedGroup.level}</p>
        <p className="modal-group-level">{selectedGroup.SLD}</p>
        <p className="modal-group-desc">{selectedGroup.description}</p>
        {/* <p className="modal-group-participants">
          Participants: {selectedGroup.numberOfPartecipants}
        </p> */}
        <button
          className="btn modal-button"
          onClick={() => setSelectedGroup(null)}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default GroupModal;
