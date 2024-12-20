import React from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaTrophy } from "react-icons/fa";
import "./../css/challengesummary.css";
import { useEffect } from "react";

const ChallengeSummary = ({ setFooterOption }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { correctAnswers, challengeTitle } = location.state || {}; // Aggiungi 'totalQuestions' qui

  useEffect(() => {
    setFooterOption("ChallengeSummary");
  }, []);

  console.log("Correct Answers:", correctAnswers);
  return (
    <div className="challenge-summary">
      <h1>Challenge Summary</h1>
      <div className="summary-content">
        <div className="summary-item">
          <p>Challenge: {challengeTitle}</p>
        </div>
        <div className="summary-item">
          <p>Total Questions: 4 </p>
        </div>
        <div className="summary-item">
          <FaTrophy className="summary-icon" />
          <p>Correct Answers: {correctAnswers}</p>
        </div>
        <div className="summary-item">
          <FaTrophy className="summary-icon" />
          <p>Score: {Math.round((correctAnswers / 4) * 100)}%</p>
        </div>
      </div>
      <button
        className="return-button"
        onClick={() => {
          navigate("/challenges")
          setFooterOption("Challenges");
        }}
      >
        Return to Groups
      </button>
    </div>
  );
};

export default ChallengeSummary;
