import React, { useEffect, useState } from "react";
import { FaTrophy } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./challenge.css";
import { getChallenge } from "/../client/API.mjs"; // Import API function

const Challenges = ({ setFooterOption, group }) => {
  const [challenges, setChallenges] = useState([]); // State for challenges

  useEffect(() => {
    // When the component mounts, load challenges
    const loadChallenges = async () => {
      console.log("Loading challenges for group:", group.id);
      const challengesData = await getChallenge(group.id);
      if (challengesData) {
        setChallenges(challengesData); // Set challenges state
      }
    };

    loadChallenges(); // Load challenges
  }, [group.id]); // Reload when group.id changes

  return (
    <div className="challenges-container">
      {/* Header */}
      <h2 className="text-center mb-4 group-name">Challenges for Group {group.name}</h2>

      {/* Challenges Grid */}
      <div className="row text-center challenge-grid">
        {challenges.length === 0 ? (
          <p>No challenges available for this group.</p>
        ) : (
          challenges.map((challenge) => (
            <div className="col-md-6 mb-3" key={challenge.id}>
              {/* Using Link to navigate to the challenge page */}
              <Link to={`/challenge/${challenge.id}`} className="text-decoration-none" state={{ challenge }} >
              <button
                className="challenge-card"
                onClick={() => setFooterOption("DoChallenge")} >
                <FaTrophy className="trophy-icon" />
                <span>{challenge.title}</span>
              </button>
            </Link>
            </div>
          ))
        )}
      </div>

      {/* Generate Button */}
      <div className="d-flex justify-content-end mt-4">
        <button
          className="generate-button btn"
          onClick={() => setFooterOption("NewChallenge")}
        >
          Generate Challenge
        </button>
      </div>
    </div>
  );
};

export default Challenges;
