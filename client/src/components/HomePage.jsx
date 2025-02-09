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

  const navigate = useNavigate(); // Usa il hook per la navigazione

  // Toggle collapse
  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
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
        console.log("Groups fetched:", joinedGroups);
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
      {/* Overlay when notifications are expanded */}
      {!isCollapsed && notifications.length !== 0 && (
        <div className="overlay" onClick={toggleCollapse}></div>
      )}

      {/* Notifications Panel */}
      <div
        className={`notifications-container ${isCollapsed ? "hide" : "show"}`}
      >
        <div className="notifications-header" onClick={toggleCollapse}>
          <div>Recent Notifications</div>
          <span className="notif-badge">{notifications.length}</span>
        </div>

        <div className="notifications-content">
          <Notification
            notifications={notifications}
            setNotifications={setNotifications}
            groups={groups}
          />
        </div>
      </div>

      {/* Groups List */}

      <h5 className="my-groups-header">My Groups</h5>
      <div className="my-groups-container">
        {groups.length > 0 ? (
          <ul>
            {groups.map((group) => (
              <li
                key={group.id}
                className="group-item mine"
                onClick={() => {
                  setFooterOption("Group");
                  setGroup(group);
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
                  <div className="my-group-info">
                    <div className="group-name">{group.name}</div>
                    <div className="group-level">{group.level}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No group found! You can create a group or join one.</p>
        )}
      </div>

      {/* Create Group Button */}
      <div className="create-container">
        <button className="create-button" onClick={handleCreateGroup}>
          Create Group
        </button>
      </div>
    </div>
  );
};

export default HomePage;
