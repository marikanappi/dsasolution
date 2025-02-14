import React, { useEffect, useState, useRef } from "react";
import { getAllGroups, joinGroup } from "../../api"; // Import API
import "./../css/searchpage.css"; // File CSS per lo stile
import { FaFilter } from "react-icons/fa";
import { FaCheck, FaQuestionCircle } from "react-icons/fa"; // Icona spunta verde
import GroupModal from "./GroupModal";
import { PiCatBold } from "react-icons/pi"; // Icona gatto

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
  const [tooltipModal, setTooltipModal] = useState({
    visible: false,
    text: "",
  });
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
      !e.target.closest(".btn-filter")
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

  const handleCloseModal = () => {
    setSelectedGroup(null); // Close the modal
    setConfirmJoin(null);
  }

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
      setConfirmJoin(null);
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
    <li className="group-item suggested-item" onClick={() => setSelectedGroup(group)}>
      <div className="group-content">
        {/* Colonna 1: Immagine */}
        <div className="group-image-container">
          <img src={group.picture} alt={`${group.name} Icon`} className="group-icon" />
        </div>

        {/* Colonna 2: Nome del gruppo */}
        <div className="group-name-container">
          <div className="group-name suggested-group-name">{group.name}</div>
        </div>

        {/* Colonna 3: Pulsante "+" */}
        <div className="group-button-container">
          <button
            className={`join-btn ${joinedGroups.includes(group.id) ? "joined" : ""}`}
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
    <li className="group-item other-item" onClick={() => setSelectedGroup(group)}>
      <div className="group-header">
        {/* Immagine del gruppo */}
        <div className="group-image-container">
          <img
            src={group.picture}
            alt={`${group.name} Icon`}
            className="group-icon"
          />
        </div>

        {/* Contenitore nome + pulsante */}
        <div className="group-info-container">
          <div className="other-group-name text-left">{group.name}</div>
          <button
            className={`join-btn ${joinedGroups.includes(group.id) ? "joined" : ""}`}
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
        <h3 className="text-left">
          Are you sure you want to join <strong>{group.name}</strong>?
        </h3>
        {group.level && <p className="text-left m-0">Level: {group.level}</p>}
        {group.SLD && <p className="text-left">SLD: {group.SLD}</p>}
        <div className="row-buttons-container">
          <button
            className="btn btn-success"
            onClick={() => onConfirmJoin(group)}
          >
            Join
          </button>
          <button className="btn modal-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="search-group-container">
      {/* Search Bar and Filter Button */}

      <div className="search-groups">
        <div className="suggested-groups-container">
          <div className="search-and-filter-container mb-0">
            <div className="d-flex mb-3">
              <input
                type="text"
                className="form-control search"
                placeholder="Search for groups..."
                style={{ flex: 1 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-filter" onClick={toggleFilters}>
                <FaFilter />
              </button>
            </div>

            {/* Filtri */}
            {filtersVisible && (
              <div
                className={`filter-dropdown-container ${filtersVisible ? "visible" : "hidden"
                  }`}
                ref={filtersRef}
              >
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
          </div>
          <p style={{ color: "white" }}>
            Suggested for You
            <PiCatBold
              className="help-icon ms-2"
              style={{ cursor: "pointer", color: "white" }}
              onClick={() =>
                setTooltipModal({
                  visible: true,
                  text: "AI suggests for you these groups based on your user's settings.",
                })
              }
            />
          </p>
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
                      isSuggested={true}
                    />
                  ))
                ) : (
                  <p className="no-groups-message">No groups found.</p>
                )}
              </ul>
            </>
          )}
        </div>


        {/* Altri Gruppi */}
        <p className="other-title">
          Other Groups
          <FaQuestionCircle
            className="help-icon light ms-2"
            style={{ cursor: "pointer", color: "#7A55C6" }}
            onClick={() =>
              setTooltipModal({
                visible: true,
                text: "These groups are from other universities.",
              })
            }
          />
        </p>

        <div className="other-groups-container">
          {filteredOtherGroups.length > 0 ? (
            <il>
              {filteredOtherGroups.map((group) => (
                <OtherGroupCard
                  key={group.id}
                  group={group}
                  onClick={() => handleJoinGroup(group)}
                  isSuggested={false}
                />
              ))}
            </il>

          ) : (
            <p className="no-groups-message">No other groups found.</p>
          )}
        </div>
      </div>

      {/* Tooltip Modal */}
      {tooltipModal.visible && (
        <div className="modal">
          <div className="modal-content">
            <PiCatBold size={30} className="tooltip-cat-icon" />
            <p>{tooltipModal.text}</p>
            <button
              className="btn modal-button"
              onClick={() => setTooltipModal({ visible: false, text: "" })}
            >
              Close
            </button>
          </div>
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
        <GroupModal
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
        />
      )}
    </div>
  );
};

export default SearchGroup;
