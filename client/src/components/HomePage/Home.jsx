import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./home.css";
import { Link } from "react-router-dom";
import NotificationsCard from "../notifications/Notification.jsx";
import { getAllGroups } from "../../../API.mjs";

const HomePage = ({ setFooterOption, setGroup }) => {
  const [isNotificationsCollapsed, setIsNotificationsCollapsed] =
    useState(false);
  const [userGroups, setUserGroups] = useState([]);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const group = await getAllGroups();
        const joinedGroup = group.filter((group) => group.joined === 1);
        setUserGroups(joinedGroup);
      } catch (err) {
        console.error(err);
      }
    }
    fetchGroups();
  }, []);

  const handleCollapseChange = (collapsed) => {
    setIsNotificationsCollapsed(collapsed);
  };

  return (
    <div className="p-3">
      {/* Recent Notifications Frame */}
      <NotificationsCard onCollapseChange={handleCollapseChange} />

      {/* User Groups Section */}
      <h5 className="text-center mb-4">Your Groups</h5>
      <div
        className="vertical-scrollable mb-4"
        style={{
          maxHeight: isNotificationsCollapsed ? "300px" : "200px",
          overflowY: "auto",
        }}
      >
        <div className="card-body mb-4">
          <ul className="list-unstyled">
            {userGroups.map((group, index) => (
              <li
                key={index}
                className="d-flex align-items-start mb-3"
                onClick={() => {
                  setFooterOption("Group");
                  setGroup(group);
                }}
                style={{ cursor: "pointer" }}
              >
                <Link
                  to={{
                    pathname: `/group/${group.name}`, // Pass group.name as part of the URL
                    state: { group }, // Pass entire group object as state
                  }}
                  style={{ textDecoration: "none", color: "inherit" }}
                ></Link>
                <img
                  src={group.picture || "../../../public/default.png"}
                  alt="Group Icon"
                  className="rounded-circle me-2"
                  width="50"
                  height="50"
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop in case the fallback image is also missing
                    e.target.src = "../../../public/default.png"; // Load default image
                  }}
                />

                <div>
                  <div className="group-name">{group.name}</div>
                  <div className="group-level">{group.level}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Floating + Icon */}
      <div className="floating-icon">
        <FaPlus
          onClick={() => setFooterOption("CreateGroup")}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
};

export default HomePage;
