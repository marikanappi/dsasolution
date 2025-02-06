import React, { useEffect, useState, useRef } from "react";
import { getAllGroups, joinGroup } from "../../api"; // Import API
import "./../css/searchpage.css"; // File CSS per lo stile
import { FaFilter } from "react-icons/fa";
import { FaCheck, FaQuestionCircle } from "react-icons/fa"; // Icona spunta verde

const SearchGroup = ({ notifications, setNotifications }) => {
  const [suggestedGroups, setSuggestedGroups] = useState([]);
  const [otherGroups, setOtherGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [confirmJoin, setConfirmJoin] = useState(null);
  const [joinedGroups, setJoinedGroups] = useState([]); // Contiene i gruppi a cui l'utente è iscritto
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedSLD, setSelectedSLD] = useState("");
  const [levels, setLevels] = useState([]);
  const [slds, setSlds] = useState([]);
  const filtersRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tooltipModal, setTooltipModal] = useState({ visible: false, text: "" });
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch dei gruppi all'avvio
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groups = await getAllGroups();
        const suggested = groups.filter(
          (group) =>
            group.university === "Politecnico di Torino" && group.joined === 0
        );
        const others = groups.filter(
          (group) =>
            group.university !== "Politecnico di Torino" && group.joined === 0
        );

        setSuggestedGroups(suggested);
        setOtherGroups(others);

        // Imposta i livelli e gli SLD unici per i filtri
        setLevels([...new Set(groups.map((group) => group.level))]);
        setSlds([...new Set(groups.map((group) => group.SLD))]);
      } catch (error) {
        console.error("Errore nel caricamento dei gruppi:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // Gestione dei filtri
  const toggleFilters = () => setFiltersVisible(!filtersVisible);
  const closeFilters = () => setFiltersVisible(false);

  const handleClickOutside = (e) => {
    if (
      filtersRef.current &&
      !filtersRef.current.contains(e.target) &&
      !e.target.closest(".filter-btn")
    ) {
      closeFilters();
    }
  };

  useEffect(() => {
    if (filtersVisible) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [filtersVisible]);


  const handleConfirmJoin = async (group) => {
    try {
      const response = await joinGroup(group.id);
      if (response) {
        setJoinedGroups((prev) => [...prev, group.id]); // Aggiungi l'ID del gruppo a quelli già uniti
        setNotifications((prev) => [
          ...prev,
          { id: group.id, text: "You joined group." },
        ]);
      }
    } catch (error) {
      console.error("Errore durante la join del gruppo:", error);
    } finally {
      handleCloseModal();
    }
  };

  // Filtraggio dei gruppi in base ai selettori
  const filteredSuggestedGroups = suggestedGroups.filter(
    (group) =>
      (selectedLevel ? group.level === selectedLevel : true) &&
      (selectedSLD ? group.SLD === selectedSLD : true) &&
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOtherGroups = otherGroups.filter(
    (group) =>
      (selectedLevel ? group.level === selectedLevel : true) &&
      (selectedSLD ? group.SLD === selectedSLD : true) &&
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) // 🔥 Filtra per nome
  );

  // Componenti riutilizzabili
  const SuggestedGroupCard = ({ group, isSuggested }) => (
    <li className="group-item" onClick={() => setSelectedGroup(group)}>
      <div className="group-image-container">
        <img
          src={group.picture}
          alt={`${group.name} Icon`}
          className="group-icon"
        />
      </div>
      <div>
        <div className="group-name">{group.name}</div>
        <div className="info">
          <div className="group-text">
            <div className="group-university">{group.university}</div>
            {isSuggested && <div className="group-level">{group.level}</div>}
          </div>
          <button
            className={`join-btn ${
              joinedGroups.includes(group.id) ? "joined" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setConfirmJoin(group);
            }}
            disabled={joinedGroups.includes(group.id)}
          >
            {joinedGroups.includes(group.id) ? "✔" : "+"}
          </button>
        </div>
      </div>
    </li>
  );

  const OtherGroupCard = ({ group, onClick, isSuggested }) => (
    <li className="other-group" onClick={() => setSelectedGroup(group)}>
      <div className="group-image-container">
        <img
          src={group.picture}
          alt={`${group.name} Icon`}
          className="group-icon"
        />
      </div>
      <div className="group-info">
        <div className="group-name">{group.name}</div>
        <div className="group-level">{group.level}</div>
      </div>
      <button
        className={`join-btn ${
          joinedGroups.includes(group.id) ? "joined" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setConfirmJoin(group);
        }}
        disabled={joinedGroups.includes(group.id)}
      >
        {joinedGroups.includes(group.id) ? "✔" : "+"}
      </button>
    </li>
  );

  const FilterDropdown = ({ options, label, selected, onSelect }) => (
    <div className="filter-dropdown">
      <h6>{label}</h6>
      <select
        className="form-select"
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">All</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  const Modal = ({ group, onClose, onConfirmJoin }) => (
    <div className="modal">
      <div className="modal-content">
        <p>
          Are you sure you want to join <strong>{group.name}</strong>?
        </p>
        {group.level && <p>Level: {group.level}</p>}
        {group.SLD && <p>SLD: {group.SLD}</p>}
        <button
          className="btn btn-success"
          onClick={() => onConfirmJoin(group)}
        >
          Join
        </button>
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="search-group-container">
      {/* Search Bar and Filter Button */}
      <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search for groups..."
          style={{ flex: 1 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="btn btn-light filter-btn"
          onClick={toggleFilters}
        >
          <FaFilter />
        </button>
      </div>

      {/* Filtri */}
      {filtersVisible && (
        <div className={`filter-dropdown-container ${filtersVisible ? 'visible' : 'hidden'}`} ref={filtersRef} >
          <FilterDropdown
            label="Level"
            options={levels}
            selected={selectedLevel}
            onSelect={setSelectedLevel}
          />
          <FilterDropdown
            label="SLD"
            options={slds}
            selected={selectedSLD}
            onSelect={setSelectedSLD}
          />
        </div>
      )}

      {/* Gruppi Suggeriti */}
      <h4>Suggested for You
        <FaQuestionCircle
          className="help-icon ms-2"
          style={{ cursor: "pointer" }}
          onClick={() =>
            setTooltipModal({
              visible: true,
              text: "These groups are suggested for you based on the university you attend.",
            })
          }
        /></h4>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
        <ul className="scrollable-cards">
          {filteredSuggestedGroups.length > 0 ? (
            filteredSuggestedGroups.map((group) => (
              <SuggestedGroupCard
                key={group.id}
                group={group}
                onClick={() => handleJoinGroup(group)}
                isSuggested={true} />
            ))
          ) : (
            <p>No groups found.</p>
          )}
        </ul>
      </>
      )}

      {/* Altri Gruppi */}
      <h4 className="other-title">Other Groups
        <FaQuestionCircle
          className="help-icon ms-2"
          style={{ cursor: "pointer" }}
          onClick={() =>
            setTooltipModal({
              visible: true,
              text: "These groups are from other universities.",
            })
          }
        />
      </h4>

      <div className="other-groups-container">
        {isLoading ? (
          <p>Loading...</p>
        ) : filteredOtherGroups.length > 0 ? (
          <ul>
            {filteredOtherGroups.map((group) => (
              <OtherGroupCard
                key={group.id}
                group={group}
                onClick={() => handleJoinGroup(group)}
                isSuggested={false}
              />
            ))}
          </ul>
        ) : (
          <p>No other groups found.</p>
        )}
      </div>


      {/* Tooltip Modal */}
      {tooltipModal.visible && (
        <div className="tooltip-modal">
          <p>{tooltipModal.text}</p>
          <button
            className="create-group-button"
            onClick={() => setTooltipModal({ visible: false, text: "" })}
          >
            Close
          </button>
        </div>
      )}

      {/* Modal */}
      {confirmJoin && (
        <Modal
          group={confirmJoin}
          onClose={() => setConfirmJoin(null)}
          onConfirmJoin={handleConfirmJoin}
        />
      )}

      {selectedGroup && (
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
            <p className="modal-group-desc">{selectedGroup.description}</p>
            <p className="modal-group-participants">
              Participants: {selectedGroup.numberOfPartecipants}
            </p>
            <button className="modal-close-btn" onClick={() => setSelectedGroup(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchGroup;
