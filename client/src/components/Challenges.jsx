import React, { useEffect, useState } from "react";
import { FaTrophy } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "../css/challenges.css";
import { getChallenge } from "/../client/API.mjs";

const Challenges = ({ setFooterOption, group }) => {
  const [challenges, setChallenges] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    setFooterOption("Challenges");
  }, []);
  
  useEffect(() => {
    const loadChallenges = async () => {
      console.log("Loading challenges for group:", group.id);
      const challengesData = await getChallenge(group.id);
      if (challengesData) {
        setChallenges(challengesData); 
      }
    };

    loadChallenges(); 
  }, [group.id]);

  return (
    <div className="challenges-container">
      <h2 className="text-center mb-4 challenge-group-name">Challenges for Group {group.name}</h2>
      <div className="row text-center challenge-grid">
        {challenges.length === 0 ? (
          <p>No challenges available for this group.</p>
        ) : (
          challenges.map((challenge) => (
            <div className="col-md-6 mb-3" key={challenge.id}>
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
      <div className="generate-button-container">
        <button
          className="generate-button"
          onClick={() => {
            navigate('/create-challenge');
            setFooterOption("NewChallenge");
            group = { group };}}
        >
          Generate Challenge
        </button>
      </div>
    </div>
  );
};

export default Challenges;
