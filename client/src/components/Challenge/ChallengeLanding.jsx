import React from "react";
import { FaArrowLeft, FaTrophy } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./challenge.css";

const Challenges = ({ setFooterOption, group }) => {
  // { stFooterOption, onGenerateChallenge }
  return (
    <div className="p-3">
      

      {/* Challenges */}
      <div className="row text-center">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="col-md-6 mb-3" key={index}>
            <div
              className="border border-2 rounded d-flex align-items-center justify-content-center p-3"
              style={{
                backgroundColor: "#f8f9fa",
                height: "80px",
              }}
            >
              <FaTrophy className="me-2 text-warning" />
              <span>Challenge {index + 1}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Generate Button */}
      <div className="d-flex justify-content-end">
        <button
          className="bottom-right-button btn"
          style={{ fontSize: "14px" }}
          //   onClick={onGenerateChallenge}
        >
          Generate Challenge
        </button>
      </div>
    </div>
  );
};

export default Challenges;
