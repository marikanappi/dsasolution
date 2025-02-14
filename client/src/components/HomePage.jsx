import React, { useEffect, useState } from "react";
import { FaExclamationCircle, FaQuestionCircle, FaBell } from "react-icons/fa"; // Import FaBell
import { getAllGroups } from "../../API.mjs";
import { useNavigate, Link } from "react-router-dom";
import NotificationSystem from "./Notification";
import "./../css/homepage.css";
import Notification from "./Notification";

const HomePage = ({
  setFooterOption,
  setGroup,
  notifications,
  setNotifications,
}) => {
  const [groups, setGroups] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false); // State for notification visibility

  const navigate = useNavigate();

  useEffect(() => {
    setFooterOption("Home");
    const fetchGroups = async () => {
      try {
        const fetchedGroups = await getAllGroups();
        const joinedGroups = fetchedGroups.filter((group) => group.joined === 1);
        setGroups(joinedGroups);
        console.log("Groups fetched:", joinedGroups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
    // Set initial notifications (you might fetch these from an API)
    setNotifications([ // Correct sample notifications
      { id: 1, message: "New challenge is added to the group!", groupId: 1 },
      { id: 3, message: "Look there is new material !", groupId: 3 },
    ]);
  }, [setFooterOption, setNotifications]);

  const handleCreateGroup = () => {
    navigate("/create-group");
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="home-page-container">
      <div className="home-page-header">
        <h4 className="my-groups-header">My Groups</h4>
        <div className="notification-container"> {/* Container for the bell */}
          <NotificationSystem
            notifications={notifications}
            setNotifications={setNotifications}
            groups={groups}
          />
        </div>
      </div>  
      <div className="my-groups-container"> 
      <div className="my-groups-container-scroll">
      
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
      </div>
  
      <div className="create-container">
        <button className="create-button" onClick={handleCreateGroup}>
          Create Group
        </button>
      </div>
    </div>
  );
};  


export default HomePage;
