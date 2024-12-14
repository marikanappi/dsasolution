import React, { useEffect, useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { getAllGroups } from "../../api"; // Assicurati di avere l'import corretto per le API
import { useNavigate, Link } from "react-router-dom"; // Importa correttamente Link
import "./../css/homepage.css"; // Il tuo file CSS per lo stile

const HomePage = ({ setFooterOption, setGroup }) => {
  const [groups, setGroups] = useState([]); // Gruppi con joined = 1
  const [notifications, setNotifications] = useState([
    "Nuovo gruppo creato!",
    "Nuove notifiche disponibili.",
    "Partecipa alla sfida in corso!",
  ]);

  const navigate = useNavigate(); // Usa il hook per la navigazione

  // Fetch dei gruppi con joined = 1
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const fetchedGroups = await getAllGroups(); // Recupera tutti i gruppi
        const joinedGroups = fetchedGroups.filter((group) => group.joined === 1); // Filtra solo quelli con joined = 1
        setGroups(joinedGroups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  const handleCreateGroup = () => {
    navigate("/create-group"); // Naviga alla pagina di creazione del gruppo
  };

  return (
    <div className="home-page-container">
      {/* Sezione Notifiche */}
      <div className="notifications-container">
        <h5>
          <FaExclamationCircle /> Recent Notifications
        </h5>
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>{notification}</li>
          ))}
        </ul>
      </div>

      {/* Sezione My Groups */}
      <div className="my-groups-container">
        <h4>My Groups</h4>
        {groups.length > 0 ? (
          <ul>
            {groups.map((group) => (
              <li
                key={group.id}
                className="group-item"
                onClick={() => {
                  setFooterOption("Group");
                  setGroup(group);
                }}
              >
                <Link
                  to={`/group/${group.name}`} // URL dinamico per il gruppo
                  state={{ group }} // Passaggio dei dati tramite state
                  className="group-link"
                >
                  <img
                    src={group.picture || "/default-group-icon.png"} // Immagine di default se non disponibile
                    alt={`${group.name || "Group"} Icon`}
                    className="group-icon"
                  />
                  <div>
                    <div className="group-name">{group.name || "Unnamed Group"}</div>
                    <div className="group-level">{group.level || "Level not specified"}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nessun gruppo trovato. Crea un nuovo gruppo!</p>
        )}
      </div>

      {/* Pulsante per creare un nuovo gruppo */}
      <button className="create-group-button" onClick={handleCreateGroup}>
        Create Group
      </button>
    </div>
  );
};

export default HomePage;
