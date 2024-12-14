import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./home.css";
import { Link } from "react-router-dom";
import NotificationsCard from "../notifications/Notification.jsx";
import { getAllGroups } from "../../../API.mjs";
import { useNavigate } from "react-router-dom";

const HomePage = ({ setFooterOption, setGroup }) => {
  const [isNotificationsCollapsed, setIsNotificationsCollapsed] = useState(false);
  const [userGroups, setUserGroups] = useState([]);
  const navigate = useNavigate(); // Inizializza il navigatore

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
    <div
      className="d-flex flex-column"
      style={{
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Recent Notifications Frame */}
      <NotificationsCard onCollapseChange={handleCollapseChange} />

      {/* User Groups Section */}
      <div
        className={`d-flex flex-column flex-grow-1 ${
          isNotificationsCollapsed ? "expanded-groups" : "collapsed-groups"
        }`}
        style={{
          marginTop: "-20px",
          transition: "height 0.3s ease",
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h5 className="text mb-0">My Groups</h5>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              navigate("/create-group"); 
              setFooterOption("CreateGroup");
            }}
          >
            Create Group
          </button>
        </div>
        <div
          className="vertical-scrollable"
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <div className="card mb-5">
            <div className="card-body mb-4">
              <ul className="list-unstyled">
                {userGroups.map((group, index) => (
                  <li
                    key={index}
                    className="d-flex align-items-start mb-3"
                    onClick={() => {
                      setGroup(group); // Salva i dati del gruppo nel genitore
                      setFooterOption("Group"); // Aggiorna l'opzione del footer
                      navigate(`/group/${group.name}`); // Naviga alla pagina specifica
                    }}
                    style={{
                      cursor: "pointer",
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <div className="d-flex align-items-center w-100 text-decoration-none text-dark">
                      <img
                        src={group.picture}
                        alt="Group Icon"
                        className="rounded-circle me-2"
                        width="40"
                        height="40"
                      />
                      <div>
                        <div className="group-name">{group.name}</div>
                        <div className="group-level">{group.level}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
