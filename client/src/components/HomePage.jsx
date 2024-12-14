import React, { useEffect, useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { getAllGroups } from "../../api"; // Assicurati di avere l'import corretto per le API
import { useNavigate } from "react-router-dom"; // Importa useNavigate per la navigazione
import "./../css/homepage.css"; // Il tuo file CSS per lo stile

const HomePage = ({ setFooterOption, setGroup }) => {
  const [groups, setGroups] = useState([]);
  const [notifications, setNotifications] = useState([
    "Nuovo gruppo creato!",
    "Nuove notifiche disponibili.",
    "Partecipa alla sfida in corso!"
  ]);

  const navigate = useNavigate(); // Usa il hook per la navigazione

  useEffect(() => {
    // Carica i gruppi quando la HomePage è montata
    const fetchGroups = async () => {
      const fetchedGroups = await getAllGroups();
      if (fetchedGroups) setGroups(fetchedGroups);
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
        <h5>Recent Notifications</h5>
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
                onClick={() => {
                  setGroup(group);
                  setFooterOption("Group");
                }}
              >
                {group.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nessun gruppo trovato. Crea un nuovo gruppo!</p>
        )}
      </div>

      {/* Pulsante per creare un nuovo gruppo */}
      <button className="create-group-button" onClick={handleCreateGroup}>
        Crea un nuovo gruppo
      </button>
    </div>
  );
};

export default HomePage;
