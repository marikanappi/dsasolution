import React, {useState, useRef, useEffect } from "react";
import { FaPlus, FaFilter } from "react-icons/fa";
import "./search.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { getAllGroups, joinGroup } from "/../client/API.mjs";

const GroupCard = ({ name, level, picture, onJoinGroup, joined }) => (
  <div
    className="d-flex flex-column align-items-center"
    style={{
      width: "120px",
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      backgroundColor: "#fff",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    }}
  >
    <div
      style={{
        position: "relative",
        width: "55px",
        height: "55px",
        marginBottom: "10px",
      }}
    >
      <img
        src={picture}
        alt={name}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%", // Change to "0" for square shape
          objectFit: "cover",
          border: "2px solid #3cacae",
        }}
      />
      {!joined && (
      <button
        className="floating-icon"
        onClick={onJoinGroup}
        style={{
          position: "absolute",
          width: "30px",
          height: "30px",
          top: "-5px",
          right: "-5px",
          padding: "3px 5px",
          fontSize: "12px",
          borderRadius: "50%",
        }}
      >
        <FaPlus />
      </button>
      )}
    </div>
    <div
      style={{
        width: "100%",
        height: "100%",
        fontSize: "12px",
        marginBottom: "4px",
        lineHeight: "1",
        textAlign: "center", // Ensures text is centered
        overflow: "hidden", // Prevents text from overflowing
        whiteSpace: "nowrap", // Prevents wrapping
        textOverflow: "ellipsis", // Adds "..." if the text is too long
      }}
    >
      {name}
      <p
        style={{
          fontSize: "10px",
          color: "#666",
          margin: "0",
          lineHeight: "1.2",
        }}
      >
        {level}
      </p>
    </div>
  </div>
);

const SuggestedGroups = ({ groups, onJoinGroup, joinedGroups }) => (
  <div className="scrollable-cards">
    {groups.map((group, index) => (
      <GroupCard
        key={index}
        name={group.name}
        level={group.level}
        picture={group.picture}
        onJoinGroup={() => onJoinGroup(group)}
        joined={joinedGroups.includes(group.name)}
      />
    ))}
  </div>
);

const OtherGroups = ({ groups, onJoinGroup, joinedGroups }) => (
  <div className="mb-2 vertical-scrollable" style={{ maxHeight: "200px", overflowY: "auto" }}>
    <div className="card-body">
      {groups.map((group, index) => (
        <div className="group-row" key={index}>
          <img src={group.picture} alt={group.name} className="group-profile" />
          <div className="group-content">
            <h6>{group.name}</h6>
          </div>
          {!joinedGroups.includes(group.name) && (
          <button
            className="floating-icon-row"
            onClick={() => onJoinGroup(group)}
            style={{
              width: "30px",
              height: "30px",
            }}
          >
            <FaPlus />
          </button>
          )}
        </div>
      ))}
    </div>
  </div>
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
  <div
    style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "250px",
      padding: "20px",
      backgroundColor: "#fff",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      borderRadius: "8px",
      zIndex: 1000,
    }}
  >
    <p>
      Are you sure to join <strong>{group.name}</strong> group?
    </p>
    {group.level && <p>Level: {group.level}</p>}
    {group.SLD && <p>SLD: {group.SLD}</p>}
    <button
      className="btn btn-danger"
      onClick={onClose}
      style={{ marginTop: "10px" }}
    >
      Cancel
    </button>
    <button
      className="btn btn-success"
      onClick={() => onConfirmJoin(group)}
      style={{ marginTop: "10px", marginLeft: "10px" }}
    >
      Join
    </button>
  </div>
);

const SearchPage = () => {

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

  const [suggestedGroups, setSuggestedGroups] = useState([]);
  const [otherGroups, setOtherGroups] = useState([]);

  useEffect(() => {
    // Carica i dati dal server all'avvio
    async function fetchGroups() {
      try {
        const groups = await getAllGroups(); // API per ottenere i gruppi
        console.log('Fetched groups:', groups);
        setSuggestedGroups(groups.filter(group => group.university === 'Politecnico di Torino'));
        setOtherGroups(groups.filter(group => group.university !== 'Politecnico di Torino'));

      } catch (error) {
        console.error('Errore nel caricamento dei gruppi:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchGroups();
  }, []);

  useEffect(() => {
    async function fetchFilters() {
      try {
        const groups = await getAllGroups();
        setLevels([...new Set(groups.map(group => group.level))]); // Estrai i livelli unici
        setSlds([...new Set(groups.map(group => group.SLD))]); // Estrai gli SLD unici
      } catch (error) {
        console.error('Errore nel caricamento dei filtri:', error);
      }
    }
    fetchFilters();
  }, []);

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  const closeFilters = () => {
    setFiltersVisible(false);
  };

  const handleClickOutside = (e) => {
    // Ignora il clic se il target è il pulsante di filtro o un altro elemento all'interno del componente
    if (filtersRef.current && !filtersRef.current.contains(e.target) && !e.target.closest('.filter-btn')) {
      closeFilters();  // Chiudi la tendina se clicchi fuori
    }
  };
  
  useEffect(() => {
    // Aggiungi l'evento per il clic fuori quando la tendina è visibile
    if (filtersVisible) {
      document.addEventListener("click", handleClickOutside);
    }

    // Rimuovi l'evento quando la tendina è chiusa
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [filtersVisible]);


  const handleJoinGroup = (group) => {
    setSelectedGroup(group); // Imposta il gruppo selezionato
    setModalOpen(true); // Apri il modal
  };

  const handleCloseModal = () => {
    setModalOpen(false); // Chiudi il modal
    setSelectedGroup(null); // Resetta il gruppo selezionato
  };

  const handleConfirmJoin = async (group) => {
    try {
      const response = await joinGroup(group.id); // Usa l'API joinGroup
      if (response) {
        setJoinedGroups([...joinedGroups, group.name]); // Aggiorna lo stato
        alert(`You have joined the group: ${group.name}`);
      }
    } catch (error) {
      console.error('Errore durante la join del gruppo:', error);
    } finally {
      setModalOpen(false);
    }
  };
  
  const filteredGroups = suggestedGroups.filter(
    (group) =>
      (selectedLevel ? group.level === selectedLevel : true) &&
      (selectedSLD ? group.SLD === selectedSLD : true)
  );


  return (
    <div className="p-2" style={{ maxWidth: "300px" }}>
      {/* Search Bar and Filter Button */}
      <div className="d-flex mb-3" style={{ position: "relative" }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search for groups..."
          style={{ flex: 1 }}
        />
        <button
          className="btn btn-light filter-btn"
          onClick={toggleFilters}
          style={{
            width: "40px",
            height: "40px",
            marginLeft: "10px",  // Keep some space between the search bar and the filter button
            backgroundColor: "#f0f0f0",
            border: "1px solid #ddd",
            borderRadius: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <FaFilter />
        </button>
      </div>

      {/* Filters Dropdown */}
      {filtersVisible && (
        <div
        className="filters-dropdown-container"
          ref={filtersRef}  // Riferimento alla tendina dei filtri
          style={{
            position: "absolute",
            top: "70px", // Just below the search bar
            left: "0",
            width: "100%",
            backgroundColor: "#fff",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            padding: "10px",
            zIndex: 1000,
          }}
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

      {/* Suggested Groups */}
      <h6 className="row mb-2">Suggested for You</h6>
      <div className="scrollable-cards">
        {filteredGroups.map((group, index) => (
          <div key={index} className="d-flex flex-column align-items-center">
            <div
              style={{
                position: "relative",
                width: "55px",
                height: "55px",
                marginBottom: "10px",
              }}
            >
              <img
                src={group.picture}
                alt={group.name}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #3cacae",
                }}
              />
            </div>
            <div
              style={{
                width: "100%",
                fontSize: "12px",
                marginBottom: "4px",
                textAlign: "center",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {group.name}
              <p style={{ fontSize: "10px", color: "#666" }}>
                {group.level}
              </p>
            </div>
          </div>

        ))}
      </div>  

      {/* Other Groups */}
      <h6 className="row mt-4">Other Groups</h6>
      <hr />
      <OtherGroups groups={otherGroups} onJoinGroup={handleJoinGroup} joinedGroups={joinedGroups}/>

      {/* Modal */}
      {modalOpen && selectedGroup && (
        <Modal group={selectedGroup} onClose={handleCloseModal} onConfirmJoin={handleConfirmJoin}/>
      )}
    </div>
  );
};

export default SearchPage;
