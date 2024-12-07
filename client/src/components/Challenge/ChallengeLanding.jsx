import React from "react";
import { FaArrowLeft, FaTrophy } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Challenges = ({ group }) => {
  // { stFooterOption, onGenerateChallenge }
  return (
    <div className="p-3">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <FaArrowLeft style={{ cursor: "pointer" }} />
        <h5 className="text-center m-0">{group.name}</h5>
        <img
          src={group.picture} // Replace with actual image URL
          alt="Profile"
          style={{
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            objectFit: "cover",
          }}
        />
      </div>
      <hr />

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
          className="btn btn-primary"
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
