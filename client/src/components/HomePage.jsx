import React, { useEffect, useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { getAllGroups } from "../../api"; // Assicurati di avere l'import corretto per le API
import { useNavigate, Link } from "react-router-dom"; // Importa correttamente Link
import "./../css/homepage.css"; // Il tuo file CSS per lo stile

const HomePage = ({ setFooterOption, setGroup }) => {
  const [groups, setGroups] = useState([]); // Gruppi con joined = 1
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigate = useNavigate(); // Usa il hook per la navigazione

  // Toggle collapse
  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapseChange(newCollapsedState);
  };

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
      <div className="notifications-container" onClick={toggleCollapse}>
        <h5> Recent Notifications
        </h5>
        {!isCollapsed && (
          <div className="card-body">
            {groups.length > 0 ? (
              <div>
                {groups.map((group, index) => (
                  <div className="notification" key={index}>
                    <span className="notif-text">You just joined the group!</span>
                    <span className="notification-group-name">{group.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center">No notifications available</p>
            )}
          </div>
        )}
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
                  group = {group}; 
                }}
              >
                <Link
                  to={`/group/${group.name}`}
                  state={{ group }}
                  className="group-link"
                >
                  <img
                    src={group.picture} // Immagine di default se non disponibile
                    alt={`${group.name} Icon`}
                    className="group-icon"
                  />
                  <div>
                    <div className="group-name">{group.name}</div>
                    <div className="group-level">{group.level}</div>
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
