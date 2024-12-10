import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHome, FaSearch, FaUser, FaArrowLeft } from "react-icons/fa";
import "../style.css";
import HomePage from "./HomePage/Home";
import SearchPage from "./SearchPage/Search";
import CreateGroup from "./CreateGroupPage/CreateGroup";
import GroupPage from "./GroupPage/Group";
import ProfilePage from "./Profile/Profile";
import ChatPage from "./GroupPage/Chat";
import Challenges from "./Challenge/ChallengeLanding";

const MobileAppSimulator = () => {
  const [footerOption, setFooterOption] = useState("Home");
  const [group, setGroup] = useState();

  return (
    <div className="mobile-frame d-flex flex-column">
      {/* Header */}
      <header className="mobile-header text-white d-flex align-items-center justify-content-center">
        {footerOption === "Group" && (
          <FaArrowLeft
            onClick={() => setFooterOption("Home")}
            className="icon-back-arrow"
            style={{ position: "absolute", left: "20px", cursor: "pointer" }}
          />
        )}
        {footerOption === "Chat" && (
          <FaArrowLeft
            onClick={() => setFooterOption("Group")}
            className="icon-back-arrow"
            style={{ position: "absolute", left: "20px", cursor: "pointer" }}
          />
        )}
        {footerOption === "Challenges" && (
          <FaArrowLeft
            onClick={() => setFooterOption("Group")}
            className="icon-back-arrow"
            style={{ position: "absolute", left: "20px", cursor: "pointer" }}
          />
        )}
        {footerOption === "CreateGroup" && (
          <FaArrowLeft
            onClick={() => setFooterOption("Home")}
            className="icon-back-arrow"
            style={{ position: "absolute", left: "20px", cursor: "pointer" }}
          />
        )}

        {footerOption === "Group" ||
        footerOption === "Challenges" ||
        footerOption === "Chat" ? (
          <div className="p-3 d-flex align-items-center">
            <h4 className="group-name m-0 text-white">{group.name}</h4>
            <img
              src={group.picture} // Replace with actual image URL
              alt="Profile"
              className="group-profile"
            />
          </div>
        ) : (
          <img src="logo.png" alt="Logo" className="logo" />
        )}
      </header>

      <main className="mobile-content flex-grow-1 ">
        {footerOption === "Home" && (
          <HomePage setFooterOption={setFooterOption} setGroup={setGroup} />
        )}
        {footerOption === "Search" && <SearchPage />}
        {footerOption === "Group" && (
          <GroupPage setFooterOption={setFooterOption} group={group} />
        )}
        {footerOption === "CreateGroup" && (
          <CreateGroup setFooterOption={setFooterOption} />
        )}
        {footerOption === "Profile" && <ProfilePage />}
        {footerOption === "Chat" && (
          <ChatPage setFooterOption={setFooterOption} />
        )}
        {footerOption === "Challenges" && (
          <Challenges
            setFooterOption={setFooterOption}
            group={group}
          ></Challenges>
        )}
      </main>

      {/* Footer */}
      <footer className="mobile-footer text-white d-flex justify-content-around align-items-center">
        <FaHome onClick={() => setFooterOption("Home")} className="icon" />
        <FaSearch onClick={() => setFooterOption("Search")} className="icon" />
        <FaUser onClick={() => setFooterOption("Profile")} className="icon" />
      </footer>
    </div>
  );
};

export default MobileAppSimulator;
