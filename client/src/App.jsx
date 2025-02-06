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
import ImagePage from "./components/ImagePage";
import DocumentPage from "./components/DocumentPage";
import AudioPage from "./components/AudioPage";
import { useNavigate } from "react-router-dom";

const MobileAppSimulator = () => {
  const [footerOption, setFooterOption] = useState("Home");
  const [group, setGroup] = useState();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState([{ id: 1, text: "You have one new message" }, { id: 6, text: "You have one new challenge" }]);

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
    }else if (footerOption === "Images") {
      setFooterOption("Materials");
      navigate("/materials");
    }else if (footerOption === "Documents") {
      setFooterOption("Documents");
      navigate("/materials");
    } else if (footerOption === "ChallengePage" || footerOption === "NewChallenge") {
      setShowModal(true); // Trigger modal when navigating from ChallengePage or NewChallenge
    } else if (footerOption === "CreateGroup") {
      setShowModal(true); // Trigger modal when navigating from CreateGroup
    } else {
      navigate(-1); // Go back in history
    }
  };

  const handleExit = () => {
    setShowModal(false); // Close the modal
    if (footerOption === "CreateGroup") {
      setFooterOption("Home");
      navigate("/"); // Navigate to home
    } else if (footerOption === "ChallengePage" || footerOption === "NewChallenge") {
      setFooterOption("Challenges");
      navigate("/challenges"); // Navigate to challenges page
    }
  };

  const handleCancel = () => {
    setShowModal(false); // Close the modal without any action
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
          <Route path="/" element={<HomePage setFooterOption={setFooterOption} setGroup={setGroup} />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/group/:id" element={<GroupPage setFooterOption={setFooterOption} group={group} />} />
          <Route path="/create-group" element={<CreateGroup setFooterOption={setFooterOption} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/chat" element={<ChatPage setFooterOption={setFooterOption} />} />
          <Route path="/challenges" element={<Challenges setFooterOption={setFooterOption} group={group} />} />
          <Route path="/challenge" element={<ChallengePage setFooterOption={setFooterOption} group={group} />} />
          <Route path="/challenge-summary" element={<ChallengeSummary setFooterOption={setFooterOption} group={group} />} />
          <Route path="/create-challenge" element={<NewChallenge group={group} setFooterOption={setFooterOption} />} />
          <Route path="/materials" element={<MaterialPage group={group} setFooterOption={setFooterOption} />} />
          <Route path="/images" element={<ImagePage group={group} setFooterOption={setFooterOption} />} />
          <Route path="/documents" element={<DocumentPage group={group} setFooterOption={setFooterOption} />} />
          <Route path="/audio" element={<AudioPage group={group} setFooterOption={setFooterOption} />} /> 
        </Routes>
      </main>

      <footer className="mobile-footer text-white d-flex justify-content-around align-items-center">
        <FaHome
          onClick={() => {
            if (["ChallengePage", "NewChallenge"].includes(footerOption)) {
              goBack(); // Handle the "goBack" case if it's one of the special pages
            } else {
              navigateTo("/", "Home"); // Navigate to home
            }
          }}
          className="icon"
        />
        <FaSearch
          onClick={() => {
            if (["ChallengePage", "NewChallenge"].includes(footerOption)) {
              goBack(); // Handle the "goBack" case if it's one of the special pages
            } else {
              navigateTo("/search", "Search"); // Navigate to search page
            }
          }}
          className="icon"
        />
        <FaUser
          onClick={() => {
            if (["ChallengePage", "NewChallenge"].includes(footerOption)) {
              goBack(); // Handle the "goBack" case if it's one of the special pages
            } else {
              navigateTo("/profile", "Profile"); // Navigate to profile page
            }
          }}
          className="icon"
        />
      </footer>

      {/* Modal for exit confirmation */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Are you sure you want to exit?</h3>
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
