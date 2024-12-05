import React, { useState } from "react";
import { FaQuestionCircle, FaArrowLeft } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { addGroup } from "../../API.mjs";

const CreateGroup = ({ setFooterOption }) => {
  const [isMandatoryWarningVisible, setMandatoryWarningVisible] =
    useState(false);
  const [tooltipModal, setTooltipModal] = useState({
    visible: false,
    text: "",
  });

  const [error, setError] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    const name = document.getElementById("group-name").value;
    const university = document.getElementById("university").value;
    const level = document.getElementById("level").value;
    const SLD = document.getElementById("special-needs").value;
    const description = document.getElementById("description").value;
    const picture = ""; // Placeholder, replace with actual file input handling.
    const number_of_participants =
      document.getElementById("max-participants").value || null;
    const joined = false;

    if (!name || !university || !level || !SLD) {
      setError(true);
      setMandatoryWarningVisible(true);
      return;
    }

    const result = await addGroup(
      name,
      level,
      university,
      SLD,
      description,
      picture,
      number_of_participants,
      joined
    );
    if (result) {
      alert("Group added successfully!");
      setFooterOption("Home");
    }
  };

  return (
    <div className="p-3">
      {/* Header */}
      <div className="d-flex align-items-center mb-3">
        <FaArrowLeft
          style={{ cursor: "pointer" }}
          onClick={() => setFooterOption("Home")}
        />
        <h5 className="text-center flex-grow-1 m-0">Create a Group</h5>
      </div>
      <hr />

      {/* Form */}
      <form onSubmit={handleCreate} className="mb-2 scrollable-page">
        {/* Picture Upload and Group Details */}
        <div className="row mb-3">
          <div className="col-md-4 text-center" style={{ marginTop: "10px" }}>
            <div
              className="form-items border d-flex align-items-center justify-content-center"
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#3cacae43",
                borderRadius: "50%",
              }}
            >
              <span>+ Add</span>
            </div>
            <input
              type="file"
              id="group-pic"
              className="form-items form-control mt-2"
              style={{ width: "80px", height: "30px", fontSize: "10px" }}
            />
          </div>

          <div className="col-md-8">
            <div className="mb-2">
              <label htmlFor="group-name" className="form-items form-label">
                Group Name*
              </label>
              <input
                type="text"
                id="group-name"
                className={`form-control form-items ${
                  error && "border-danger"
                }`}
                placeholder="Enter group name"
              />
            </div>
            <div>
              <label htmlFor="university" className="form-items form-label">
                University*
              </label>
              <input
                type="text"
                id="university"
                className={`form-control form-items ${
                  error && "border-danger"
                }`}
                placeholder="Enter university name"
              />
            </div>
          </div>
        </div>

        {/* Level */}
        <div className="row mb-3">
          <div className="form-items">
            <label
              htmlFor="level"
              className="form-items form-label d-flex align-items-center"
            >
              Level*{" "}
              <FaQuestionCircle
                className="help-icon ms-2"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setTooltipModal({
                    visible: true,
                    text: "Selecting the appropriate difficulty level for your study group helps tailor the content and discussions to the participants' current knowledge and AI-generated challenges.",
                  })
                }
              />
            </label>
            <select
              id="level"
              className={`form-control form-items ${error && "border-danger"}`}
            >
              <option value="">Select level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Special Needs */}
        <div className="row mb-3">
          <div className="form-items">
            <label
              htmlFor="special-needs"
              className="form-items form-label d-flex align-items-center"
            >
              Special Needs*{" "}
              <FaQuestionCircle
                className="help-icon ms-2"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setTooltipModal({
                    visible: true,
                    text: "Selecting the appropriate type of SLD helps divide students into study groups tailored to their specific learning needs.",
                  })
                }
              />
            </label>
            <select
              id="special-needs"
              className={`form-control form-items form-label ${
                error && "border-danger"
              }`}
            >
              <option value="">Select special need</option>
              <option value="Dyslexia">Dyslexia</option>
              <option value="Dysgraphia">Dysgraphia</option>
              <option value="Dyscalculia">Dyscalculia</option>
              <option value="Dysorthography">Dysorthography</option>
            </select>
          </div>
        </div>

        {/* Row: Max Participants */}
        <div className="mb-3 d-flex flex-column">
          <div
            className="d-flex form-label form-items"
            style={{ gap: "10px", marginBottom: "-15px" }}
          >
            <label
              htmlFor="max-participants"
              className="form-items form-label mb-0"
              style={{ whiteSpace: "nowrap", marginBottom: "5px" }}
            >
              Max Number of Participants
            </label>
            <select
              id="max-participants"
              className="form-items form-select"
              style={{ width: "120px" }}
            >
              <option value="">No Limit</option>
              {[...Array(50)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <small
            className="form-items text-muted mt-0"
            style={{ marginTop: "-5px", fontSize: "10px" }}
          >
            Set a limit up to 50.
          </small>
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-items form-label d-flex">
            Description
          </label>
          <textarea
            id="description"
            className="form-items form-control"
            rows="3"
            placeholder="Enter description"
          ></textarea>
        </div>

        {/* Mandatory Note */}
        <p className={`form-items ${error ? "text-danger" : "text-muted"}`}>
          * Mandatory fields to fill.
        </p>

        {/* Create Button */}
        <div className="text-center mb-3">
          <button type="submit" className="custom-button btn">
            Create
          </button>
        </div>
      </form>

      {/* Mandatory Warning Modal */}
      {isMandatoryWarningVisible && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "250px",
            padding: "20px",
            backgroundColor: "#c4eaed",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            zIndex: 1000,
          }}
        >
          <p>Please fill out all mandatory fields.</p>
          <button
            className="btn btn-secondary"
            onClick={() => setMandatoryWarningVisible(false)}
          >
            OK
          </button>
        </div>
      )}

      {/* Tooltip Modal */}
      {tooltipModal.visible && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "250px",
            padding: "20px",
            backgroundColor: "#c4eaed",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            zIndex: 1000,
          }}
        >
          <p>{tooltipModal.text}</p>
          <button
            className="btn btn-secondary"
            onClick={() => setTooltipModal({ visible: false, text: "" })}
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateGroup;
