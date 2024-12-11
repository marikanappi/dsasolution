import React, { useState, useEffect } from "react";
import { getAllGroups } from "/../client/API.mjs";
import "./notifications.css";

const NotificationsCard = ({ onCollapseChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [groups, setGroups] = useState([]);

  // Toggle collapse
  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapseChange(newCollapsedState);
  };

  // Fetch groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const allGroups = await getAllGroups();
        const joinedGroups = allGroups.filter((group) => group.joined === 1);
        setGroups(joinedGroups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    fetchGroups();
  }, []);

  return (
    <div className="card mb-5">
      <div
        className="card-header text-white"
        onClick={toggleCollapse}
        style={{ cursor: "pointer" }}
      >
        Recent Notifications
      </div>
      {!isCollapsed && (
        <div className="card-body">
          {groups.length > 0 ? (
            <div>
              {groups.map((group, index) => (
                <div
                  className="notification d-flex justify-content-between align-items-center mb-2"
                  style={{ gap: "12px"}}
                  key={index}
                >
                  <span className="notif-text">You just joined the group!</span>
                  <span className="group-labels">{group.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No notifications available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsCard;
