import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTrophy } from "react-icons/fa"; // Per l'icona del trofeo
import "bootstrap/dist/css/bootstrap.min.css"; // Assicurati di avere Bootstrap importato

const ChallengeSummary = ({ setFooterOption}) => {
  const location = useLocation();
  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const { challenge } = location.state || {}; // Recupera l'oggetto challenge passato dallo stato

  const handleReturnToChallenges = () => {
    navigate("/challenges"); // Sostituisci "/challenges" con il percorso delle tue sfide
  };

  return (
    <div className="challenge-summary d-flex flex-column align-items-center justify-content-center">
      <h1 className="text-center my-4">Challenge Concluded</h1>
      {challenge && (
        <>
          <p className="text-center mb-4">
            Congratulations on completing the challenge: <strong>{challenge.title}</strong>
          </p>
          <FaTrophy className="trophy-icon mb-4" style={{ fontSize: "50px", color: "#FFD700" }} />
        </>
      )}
      
      {/* Bottone per tornare alla lista delle challenge */}
      <button 
        className="btn btn-primary" 
        onClick={() => setFooterOption("Challenges")}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Back to Challenges
      </button>
    </div>
  );
};

export default ChallengeSummary;
