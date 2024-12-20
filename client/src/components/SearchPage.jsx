import React, { useEffect, useState, useRef } from "react";
import { getAllGroups, joinGroup } from "../../api"; // Import API
import "./../css/searchpage.css"; // File CSS per lo stile
import { FaFilter } from "react-icons/fa";

const SearchGroup = ({ setGroup }) => {
  const [suggestedGroups, setSuggestedGroups] = useState([]);
  const [otherGroups, setOtherGroups] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedSLD, setSelectedSLD] = useState("");
  const [levels, setLevels] = useState([]);
  const [slds, setSlds] = useState([]);
  const filtersRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dei gruppi all'avvio
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groups = await getAllGroups();
        const suggested = groups.filter(
          (group) => group.university === "Politecnico di Torino" && group.joined === 0
        );
        const others = groups.filter(
          (group) => group.university !== "Politecnico di Torino" && group.joined === 0
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

  // Gestione del modal
  const handleJoinGroup = (group) => {
    setSelectedGroup(group);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedGroup(null);
  };

  const handleConfirmJoin = async (group) => {
    try {
      const response = await joinGroup(group.id);
      if (response) {
        setJoinedGroups((prev) => [...prev, group.name]);
      }
    } catch (error) {
      console.error("Errore durante la join del gruppo:", error);
    } finally {
      handleCloseModal();
    }
  };

  // Filtraggio dei gruppi in base ai selettori
  const filteredGroups = suggestedGroups.filter(
    (group) =>
      (selectedLevel ? group.level === selectedLevel : true) &&
      (selectedSLD ? group.SLD === selectedSLD : true)
  );

  // Componenti riutilizzabili
  const SuggestedGroupCard = ({ group, onClick, isSuggested }) => (
    <li className="group-item" onClick={onClick}>
      <div className="group-image-container">
        <img
          src={group.picture}
          alt={`${group.name} Icon`}
          className="group-icon"
        />
        <button
          className="join-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleJoinGroup(group);
          }}
        >
          +
        </button>
      </div>
      <div>
        <div className="group-name">{group.name}</div>
        <div className="group-university">{group.university}</div>
        {isSuggested && <div className="group-level">{group.level}</div>}
      </div>
    </li>
  );

  const OtherGroupCard = ({ group, onClick, isSuggested }) => (
    <li className="group-item" onClick={onClick}>
      <div className="group-image-container">
        <img
          src={group.picture}
          alt={`${group.name} Icon`}
          className="group-icon"
        />
      </div>
      <div>
        <div className="group-name">{group.name}</div>
        <div className="group-university">{group.university}</div>
        {isSuggested && <div className="group-level">{group.level}</div>}
      </div>
      <button
          className="plus-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleJoinGroup(group);
          }}
        >
          +
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
          <button className="btn btn-success" onClick={() => onConfirmJoin(group)}>Join</button>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
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
        <div
          className={`filter-dropdown-container ${filtersVisible ? 'visible' : 'hidden'}`}
          ref={filtersRef}  // Riferimento alla tendina dei filtri
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

      {/* Gruppi Suggeriti */}
      <h4>Suggested for You</h4>
      {isLoading ? (
        <p>Loading...</p>
      ) : filteredGroups.length > 0 ? (
        <ul className="scrollable-cards">
          {filteredGroups.map((group) => (
            <SuggestedGroupCard
              key={group.id}
              group={group}
              onClick={() => handleJoinGroup(group)}
              isSuggested={true}
            />
          ))}
        </ul>
      ) : (
        <p>No suggested groups found.</p>
      )}

      {/* Altri Gruppi */}
      <h4>Other Groups</h4>
      <div className="other-groups-container">
        {isLoading ? (
          <p>Loading...</p>
        ) : otherGroups.length > 0 ? (
          <ul>
            {otherGroups.map((group) => (
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

      {/* Modal */}
      {modalOpen && selectedGroup && (
        <Modal
          group={selectedGroup}
          onClose={handleCloseModal}
          onConfirmJoin={handleConfirmJoin}
        />
      )}
    </div>
  );
};

export default SearchGroup;
