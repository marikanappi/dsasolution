import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTrophy } from "react-icons/fa";
import "./../css/challengesummary.css";

const ChallengeSummary = ({ setFooterOption }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { correctAnswers, skippedQuestions, challengeTitle } = location.state || {};

  useEffect(() => {
    setFooterOption("ChallengeSummary");
  }, []);

  const wrongAnswers = 4 - correctAnswers - skippedQuestions;
  const score = Math.round((correctAnswers / 4) * 100);

  return (
    <div className="challenge-summary">
      <h1>Challenge Summary</h1>
      <div className="summary-content">
        <div className="summary-item">
          <p>Challenge: {challengeTitle}</p>
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
        <div className="summary-item">
          <FaTrophy className="summary-icon" />
          <p>Score: {score}%</p>
        </div>
      </div>
      <button
        className="return-button"
        onClick={() => {
          navigate("/challenges");
          setFooterOption("Challenges");
        }}
      >
        Return to Challenges
      </button>
    </div>
  );
};

export default ChallengeSummary;
