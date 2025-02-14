import React, { useEffect, useState } from "react";
import { FaTrophy, FaArrowLeft } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "../css/challenges.css";
import { getChallenge } from "/../client/API.mjs";
import { PiCatBold } from "react-icons/pi";

const Challenges = ({ setFooterOption, group }) => {
  const [challenges, setChallenges] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setFooterOption("Challenges");
  }, []);

  const handleBack = () => {
    navigate("/group/:id");
  };

  useEffect(() => {
    const loadChallenges = async () => {
      console.log("Loading challenges for group:", group.id);
      const challengesData = await getChallenge(group.id);
      if (challengesData) {
        console.log("Challenges loaded:", challengesData);
        setChallenges(challengesData);
      }
    };

    loadChallenges();
  }, [group.id]);

  return (
    <div className="challenges-container">
      <div className="challenge-title">
      <div className="back-arrow" onClick={handleBack}>
        <FaArrowLeft size={25} style={{ cursor: "pointer", color: "white"}} />
      </div>
        <FaTrophy className="left-header-icon" size={88} />
        <span className="challenge-group-name">
          Challenges for Group {group.name}
        </span>
      </div>


      <div className="scrollable-challenges">
        <div className="row text-center challenge-grid">
          {challenges.length === 0 ? (
            <p>No challenges available for this group.</p>
          ) : (
            challenges.map((challenge) => (
              <div className="cards-container" key={challenge.id}>
                <button
                  className="challenge-card"
                  onClick={() => {
                    navigate("/challenge", { state: { challenge } });
                    setFooterOption("DoChallenge");
                  }}
                >
                  <FaTrophy className="trophy-icon" />
                  <span>{challenge.title}</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="create-container">
        <button
          className="create-button"
          onClick={() => {
            navigate("/create-challenge");
            setFooterOption("NewChallenge");
            group = { group };
          }}
        >
          <PiCatBold className="cat-icon" size={26} />
          Generate Challenge
        </button>
      </div>
    </div>
  );
};

export default Challenges;
