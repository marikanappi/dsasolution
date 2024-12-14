import React, { useState, useEffect } from "react";
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
    <div className="d-flex flex-column"
      style={{
        height: "100%", // Rende il contenitore flessibile
        overflow: "hidden", // Evita lo scroll non desiderato
      }}
    >
      {/* Recent Notifications Frame */}
      <NotificationsCard onCollapseChange={handleCollapseChange} />

      {/* User Groups Section */}
      <div
        className={`d-flex flex-column flex-grow-1 ${isNotificationsCollapsed ? "expanded-groups" : "collapsed-groups"
          }`}
        style={{
          marginTop: "-20px", // Sposta leggermente verso l'alto
          transition: "height 0.3s ease", // Animazione fluida per l'espansione
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h5 className="text mb-0">My Groups</h5>
        </div>

        <div className="vertical-scrollable">
            <div className="my-groups-card-body mb-4">
              <ul className="list-unstyled">
                {userGroups.map((group, index) => (
                  <li
                    key={index}
                    className="d-flex align-items-start mb-3"
                    onClick={() => {
                      setFooterOption("Group");
                      setGroup(group);
                    }}
                    style={{
                      cursor: "pointer",
                      padding: "10px",
                      borderBottom: "1px solid #ddd", // Separatore visivo
                    }}
                  >
                    <Link
                      to={{
                        pathname: `/group/${group.name}`, // Pass group.name as part of the URL
                        state: { group }, // Pass entire group object as state
                      }}
                      className="d-flex align-items-center w-100 text-decoration-none text-dark"
                    >
                      <img
                        src={group.picture}
                        alt="Group Icon"
                        className="rounded-circle me-2"
                        width="40" /* Aggiornato per corrispondere al CSS */
                        height="40" /* Aggiornato per corrispondere al CSS */
                      />
                      <div>
                        <div className="group-name">{group.name}</div>
                        <div className="group-level">{group.level}</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
          </div>
        </div>
      </div>

      {/* Create Group Button */}
      <div className="d-flex justify-content-center mb-5 mt-auto">
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setFooterOption("CreateGroup")}
        >
          Create Group
        </button>
      </div>
    </div>

  );
};

export default HomePage;
