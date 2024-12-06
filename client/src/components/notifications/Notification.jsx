import React, { useState, useEffect } from "react";
import { getAllGroups } from "/../client/API.mjs";
import "./notifications.css";

const NotificationsCard = ({ onCollapseChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [groups, setGroups] = useState([]);

  // Funzione per gestire il toggle della card
  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapseChange(newCollapsedState);
  };

  // Effettua la chiamata API al montaggio del componente
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const allGroups = await getAllGroups();
        const joinedGroups = allGroups.filter((group) => group.joined === 1);
        setGroups(joinedGroups);
      } catch (error) {
        console.error("Errore nel recupero dei gruppi:", error);
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
            <table className="table">
              <thead>
                <tr>
                  <th className="text-center">Notification</th>
                  <th className="text-center">Group</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group, index) => (
                  <tr key={index}>
                    <td className="text-center">New Challenge Available</td>
                    <td className="text-center group-labels">{group.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">No notifications available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsCard;
