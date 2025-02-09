import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTrophy } from "react-icons/fa";
import "./../css/challengesummary.css";

const ChallengeSummary = ({ setFooterOption }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { correctAnswers, skippedQuestions, wrongAnswers, challengeTitle } =
    location.state || {};

  useEffect(() => {
    setFooterOption("ChallengeSummary");
  }, []);

  const score = Math.round((correctAnswers / 4) * 100);

  return (
    <div className="challenge-summary">
      <div className="summery-header">
        <h5>Challenge Summary</h5>
      </div>
      <div className="summary-content">
        <div className="summary-title">
          <p>{challengeTitle}</p>
          <hr></hr>
        </div>

        <div className="summary-item">
          <p>Total Questions: {4}</p>
        </div>
        <div className="summary-item">
          <p>Correct Answers: {correctAnswers}</p>
        </div>
        <div className="summary-item">
          <p>Skipped Questions: {skippedQuestions}</p>
        </div>
        <div className="summary-item">
          <p>Wrong Answers: {wrongAnswers}</p>
        </div>
        <hr></hr>
        <div className="score-item">
          <FaTrophy className="summary-icon" size={50} />
          <span>Score: {score}%</span>
        </div>
      </div>
      <div>
        <button
          className="create-button"
          onClick={() => {
            navigate("/challenges");
            setFooterOption("Challenges");
          }}
        >
          Return to Challenges
        </button>
      </div>
    </div>
  );
};

export default ChallengeSummary;
