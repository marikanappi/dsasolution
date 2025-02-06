import React, { useEffect, useState } from "react";
import { FaExclamationCircle, FaQuestionCircle } from "react-icons/fa";
import { getAllGroups } from "../../API.mjs"; // Assicurati di avere l'import corretto per le API
import { useNavigate, Link } from "react-router-dom"; // Importa correttamente Link
import "./../css/homepage.css"; // Il tuo file CSS per lo stile
import Notification from "./Notification";

const HomePage = ({
  setFooterOption,
  setGroup,
  notifications,
  setNotifications,
}) => {
  const [groups, setGroups] = useState([]); // Gruppi con joined = 1
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [tooltipModal, setTooltipModal] = useState({
    visible: false,
    text: "",
  });

  const navigate = useNavigate(); // Usa il hook per la navigazione

  // Toggle collapse
  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
  };

  // Fetch dei gruppi con joined = 1
  useEffect(() => {
    setFooterOption("Home");
    const fetchGroups = async () => {
      try {
        const fetchedGroups = await getAllGroups(); // Recupera tutti i gruppi
        const joinedGroups = fetchedGroups.filter(
          (group) => group.joined === 1
        ); // Filtra solo quelli con joined = 1
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
      {(notifications.length > 0 || !isCollapsed) && (
        <div
          className={`notifications-container ${
            notifications.length === 0
              ? "hide-notifications"
              : "show-notifications"
          }`}
        >
          <div className="notifications-header" onClick={toggleCollapse}>
            <div>Recent Notifications</div>
            <span className="notif-badge">{notifications.length}</span>
          </div>

          {/* Keep Notification in the DOM for smooth collapse */}
          <div
            className={`notifications-content ${isCollapsed ? "hide" : "show"}`}
          >
            <Notification
              notifications={notifications}
              setNotifications={setNotifications}
              groups={groups}
            />
          </div>
        </div>
      )}

      <div className="my-groups-container">
<<<<<<< HEAD
        <h5>My Groups</h5>
=======
        <h4>My Groups </h4>
>>>>>>> francesca
        {groups.length > 0 ? (
          <ul>
            {groups.map((group) => (
              <li
                key={group.id}
                className="group-item"
                onClick={() => {
                  setFooterOption("Group");
                  setGroup(group);
                  group = { group };
                }}
              >
                <Link
                  to={`/group/${group.id}`}
                  state={{ group }}
                  className="group-link"
                >
                  <img
                    src={group.picture} 
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

      {/* Pulsante per creare un nuovo gruppo */}
      <div className="create-group-container">
        <button className="create-group-button" onClick={handleCreateGroup}>
          Create Group
        </button>
      </div>
    </div>
  );
};

export default HomePage;
