import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHome, FaSearch, FaUser } from "react-icons/fa";
import "../style.css";
import HomePage from "./HomePage/Home";
import SearchPage from "./SearchPage/Search";
import CreateGroup from "./CreateGroupPage";
import GroupPage from "./GroupPage/Group";
import ProfilePage from "./Profile/Profile";

const MobileAppSimulator = ({children}) => {
  const [footerOption, setFooterOption] = useState("Home");  
  return (
    <div className="mobile-frame d-flex flex-column ">
      {/* Header */}
      <header className="mobile-header text-white d-flex align-items-center justify-content-center">
        <img src="logo.png" alt="Logo" className="logo" />
      </header>

      {/* Main Content */}
      <main className="mobile-content flex-grow-1 bg-light d-flex flex-column align-items-center">
        {footerOption === "Home" && (
          <HomePage setFooterOption={setFooterOption} />
        )}
        {footerOption === "Search" && <SearchPage />}
        {footerOption === "Group" && <GroupPage setFooterOption={setFooterOption}/>}
        {footerOption === "CreateGroup" && <CreateGroup setFooterOption={setFooterOption} />}
        {footerOption === "Profile" && <ProfilePage/>}
      </main>

      {/* Footer */}
      <footer className="mobile-footer text-white d-flex justify-content-around align-items-center">
        <FaHome onClick={() => setFooterOption("Home")} className="icon" />
        <FaSearch onClick={() => setFooterOption("Search")} className="icon" />
        <FaUser onClick={() => setFooterOption("Profile")} className="icon"/>
      </footer>
    </div>
  );
};

export default MobileAppSimulator;
