import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHome, FaSearch, FaUser, FaArrowLeft } from "react-icons/fa";
import "./style.css";
import HomePage from "./components/HomePage";
import SearchPage from "./components/SearchPage";
import GroupPage from "./components/GroupPage";
import CreateGroup from "./components/CreateGroup";
import ProfilePage from "./components/ProfilePage";
import ChatPage from "./components/ChatPage";
import Challenges from "./components/Challenges";
import ChallengePage from "./components/ChallengePage";
import ChallengeSummary from "./components/ChallengeSummary";
import NewChallenge from "./components/CreateChallenge";

import { useNavigate } from "react-router-dom";

const MobileAppSimulator = () => {
  const [footerOption, setFooterOption] = useState("Home");
  const [group, setGroup] = useState();
  const navigate = useNavigate();

  const navigateTo = (path, option) => {
    setFooterOption(option);
    navigate(path);
  };

  const goBack = () => {
    console.log('footerOption:', footerOption);  // Aggiungi questa linea per debug
    if (footerOption === "Chat" || footerOption === "Challenges" || footerOption === "Materials") {
      navigate(-1);
    } 
    else if (footerOption === "CreateGroup" ) {
      navigateTo("/", "Home");
    } else {
      navigateTo("/", "Home");
    }
  };
  
  const renderHeader = () => {
  if (footerOption === "Group" || footerOption === "Chat" || footerOption === "Challenges" || footerOption === "Materials" || footerOption === "CreateGroup") {
    return (
      <div className="header-group d-flex align-items-center">
        <FaArrowLeft
          onClick={goBack}
          className="icon-back-arrow"
          style={{ position: "absolute", left: "20px", cursor: "pointer" }}
        />
          <h4 className="group-name-header">{group.name}</h4>
          <img
            src={group?.picture}
            className="group-profile ml-3"
            alt="Group Profile"
          />
      </div>
    );
  }
  return <img src="logo.png" alt="Logo" className="logo" />;
};

  return (
    <div className="mobile-frame d-flex flex-column">
      <header className="mobile-header text-white d-flex align-items-center justify-content-center">
        {renderHeader()}
      </header>
      <main className="mobile-content flex-grow-1">
        <Routes>
          <Route
            path="/"
            element={<HomePage setFooterOption={setFooterOption} setGroup={setGroup} />}
          />
          <Route path="/search" element={<SearchPage />} />
          <Route
            path="/group/:id"
            element={<GroupPage setFooterOption={setFooterOption} group={group} />}
          />
          <Route path="/create-group" element={<CreateGroup setFooterOption={setFooterOption}/>} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/chat"
            element={<ChatPage setFooterOption={setFooterOption} />}
          />
          <Route
            path="/challenges"
            element={<Challenges setFooterOption={setFooterOption} group={group} />}
          />
          <Route
            path="/challenge"
            element={<ChallengePage setFooterOption={setFooterOption} group={group} />}
          />
          <Route
            path="/challenge-summary"
            element={<ChallengeSummary setFooterOption={setFooterOption} group={group} />}
          />
          <Route 
          path="/create-challenge" 
          element={<NewChallenge group={group} setFooterOption={setFooterOption}/>} />
        </Routes>
      </main>
      
      <footer className="mobile-footer text-white d-flex justify-content-around align-items-center">
        <FaHome onClick={() => navigateTo("/", "Home")} className="icon" />
        <FaSearch onClick={() => navigateTo("/search", "Search")} className="icon" />
        <FaUser onClick={() => navigateTo("/profile", "Profile")} className="icon" />
      </footer>
    </div>
  );
};

export default MobileAppSimulator;
