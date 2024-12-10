import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaComments, FaTrophy, FaBook } from "react-icons/fa"; // Icons for Chat, Challenges, and Materials
import { AiOutlineLogout } from "react-icons/ai"; // Icon for Leave Group
import { leaveGroup as apiLeaveGroup } from "/../client/API.mjs"; // Import API function
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./group.css";

const GroupPage = ({ setFooterOption, group }) => {
  const navigate = useNavigate(); // Initialize navigate function

  const handleLeaveGroup = async () => {
    try {
      console.log("Leaving group with ID:", group.id);
      const result = await apiLeaveGroup(group.id); // Call API with the group ID
      if (result) {
        setFooterOption("Home"); // Set footer option to "Home" to navigate to HomePage
      } else {
        alert("Failed to leave the group. Please try again.");
      }
    } catch (error) {
      console.error("Error leaving the group:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const sections = [
    {
      name: "Chat",
      icon: <FaComments />,
      onClick: () => setFooterOption("Chat"),
    },
    {
      name: "Challenges",
      icon: <FaTrophy />,
      onClick: () => setFooterOption("Challenges"),
    },
    {
      name: "Materials",
      icon: <FaBook />,
      onClick: () => setFooterOption("Materials"),
    },
  ];

  return (
    <div className="p-3">
      {/* Sections for Chat, Challenges, and Materials */}
      <div className="row justify-content-center" style={{ marginTop: "60px" }}>
        {sections.map((section, index) => (
          <div
            key={index}
            className="col-12 text-center mb-3"
            style={{ cursor: "pointer" }}
            onClick={section.onClick}
          >
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "#3cacae",
                color: "#fff",
                margin: "0 auto",
                marginBottom: "8px",
                fontSize: "1.5rem",
              }}
            >
              {section.icon}
            </div>
            <span style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
              {section.name}
            </span>
          </div>
        ))}
      </div>

      <div className="leave-div">
        <button
          className="btn btn-leave-group"
          onClick={handleLeaveGroup}
        ><AiOutlineLogout /> Leave Group
        </button>
      </div>
    </div>
  );
};

export default GroupPage;
