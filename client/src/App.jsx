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
import MaterialPage from "./components/MaterialPage";

import { useNavigate } from "react-router-dom";


const MobileAppSimulator = () => {
  const [footerOption, setFooterOption] = useState("Home");
  const [group, setGroup] = useState();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const navigateTo = (path, option) => {
    setFooterOption(option);
    navigate(path);
  };

  const goBack = () => {
    if (footerOption === "GroupPage") {
      setFooterOption("Home");
      navigate("/");
    } else if (["Chat", "Challenges", "Materials"].includes(footerOption)) {
      setFooterOption("Group");
      navigate("/group/:id");
    } else if (footerOption === "ChallengeSummary") {
      setFooterOption("Challenges");
      navigate("/challenges");
    } else if (footerOption === "ChallengePage" || footerOption === "NewChallenge") {
      setShowModal(true);
    } else if (footerOption === "CreateGroup") {
      setShowModal(true);
    } else {
      navigate(-1);
    }
  };

  const handleExit = () => {
    setShowModal(false); // Chiudi il modal
    if (footerOption === "CreateGroup") {
      setFooterOption("Home"); // Imposta footerOption su Home
      navigate("/"); // Naviga alla home
    } else if (footerOption === "ChallengePage" || footerOption === "NewChallenge") {
      setFooterOption("Challenges"); // Imposta footerOption su Challenges
      navigate("/challenges"); // Naviga alla pagina delle Challenges
    }
  };  

  // Funzione per annullare (chiudere il modal senza fare nulla)
  const handleCancel = () => {
    setShowModal(false); // Chiudi il modal senza fare nulla
  };
  

  const renderHeader = () => {
    const isMainOption = ["Home", "Search", "Profile"].includes(footerOption);
  
    return (
      <div className="header-group d-flex align-items-center">
        {!isMainOption && (
          <FaArrowLeft
            onClick={goBack}
            className="icon-back-arrow"
            style={{ position: "absolute", left: "20px", cursor: "pointer" }}
          />

          
        )}
        <img
          src="logo.png"
          alt="Logo"
          className="logo"
          onClick={() => navigateTo("/", "Home")}
        />
      </div>
    );
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
            element={
              <HomePage setFooterOption={setFooterOption} setGroup={setGroup} />
            }
          />
          <Route path="/search" element={<SearchPage />} />
          <Route
            path="/group/:id"
            element={
              <GroupPage setFooterOption={setFooterOption} group={group} setGroup={setGroup} />
            }
          />
          <Route
            path="/create-group"
            element={<CreateGroup setFooterOption={setFooterOption} />}
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/chat"
            element={<ChatPage setFooterOption={setFooterOption} />}
          />
          <Route
            path="/challenges"
            element={
              <Challenges setFooterOption={setFooterOption} group={group} />
            }
          />
          <Route
            path="/challenge"
            element={
              <ChallengePage setFooterOption={setFooterOption} group={group} />
            }
          />
          <Route
            path="/challenge-summary"
            element={
              <ChallengeSummary
                setFooterOption={setFooterOption}
                group={group}
              />
            }
          />
          <Route
            path="/create-challenge"
            element={
              <NewChallenge group={group} setFooterOption={setFooterOption} />
            }
          />
          <Route 
          path="/materials" 
          element={
          <MaterialPage group={group} setFooterOption={setFooterOption} />} />
        </Routes>
      </main>

      <footer className="mobile-footer text-white d-flex justify-content-around align-items-center">
        <FaHome onClick={() => navigateTo("/", "Home")} className="icon" />
        <FaSearch
          onClick={() => navigateTo("/search", "Search")}
          className="icon"
        />
        <FaUser
          onClick={() => navigateTo("/profile", "Profile")}
          className="icon"
        />
      </footer>

      {/* Modal di conferma per uscire */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Are you sure to exit?</h3>
            <p>All your changes will be discarded.</p>
            <button className="btn btn-danger" onClick={handleExit}>Exit</button>
            <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default MobileAppSimulator;
