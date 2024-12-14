import React, { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { addGroup } from "../../../API.mjs";
import "./createGroup.css"; // Importa il file CSS separato

const CreateGroup = ({ setFooterOption }) => {
  const [formData, setFormData] = useState({
    name: "",
    university: "",
    level: "",
    specialNeeds: "",
    description: "",
    maxParticipants: 0,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState(""); // Store the image name dynamically
  const [error, setError] = useState(false);
  const [tooltipModal, setTooltipModal] = useState({
    visible: false,
    text: "",
  });
  const [isMandatoryWarningVisible, setMandatoryWarningVisible] = useState(false);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "image/png") {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setImageName(file.name); // Store the image file name
    } else {
      alert("Please upload a PNG file.");
    }
  };

  // Handle group creation
  const handleCreate = async (e) => {
    e.preventDefault();

    // Validation: check if mandatory fields are filled
    if (!formData.name || !formData.university || !formData.level || !formData.specialNeeds) {
      setError(true);
      setMandatoryWarningVisible(true);
      return;
    }

    // Construct group data object
    const newGroup = {
      ...formData,
      picture: imageName || "default.png", // Use default picture name if no image is uploaded
      joined: true,
    };

    // Call the API to add the group
    try {
      const result = await addGroup(newGroup);
      if (result) {
        alert("Group added successfully!");
        setFooterOption("Home");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group. Please try again.");
    }
  };

  // Render the component
  return (
    <div className="create-group-container p-3">
      {/* Header */}
      <div className="d-flex align-items-center mb-3">
        <h5 className="text-center flex-grow-1 m-0">Create a Group</h5>
      </div>
      <hr />

      {/* Form */}
      <form onSubmit={handleCreate} className="mb-2 scrollable-form">
        {/* Picture Upload and Group Details */}
        <div className="row mb-3">
          <div className="col-md-4 text-center" style={{ marginTop: "10px" }}>
            <div
              className={`form-items border d-flex align-items-center justify-content-center ${
                imagePreview ? "image-uploaded" : ""
              }`}
            >
              {!imagePreview && <span>+ Add</span>}
            </div>
            <input
              type="file"
              id="group-pic"
              className="form-items form-control mt-2"
              style={{ width: "80px", height: "30px", fontSize: "10px" }}
              onChange={handleFileChange}
            />
          </div>

          <div className="col-md-8">
            <div className="mb-2">
              <label htmlFor="name" className="form-items form-label">
                Group Name*
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-control form-items ${error && "border-danger"}`}
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
                value={formData.university}
                onChange={handleInputChange}
                className={`form-control form-items ${error && "border-danger"}`}
                placeholder="Enter university name"
              />
            </div>
          </div>
        </div>

        {/* Level Selection */}
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
              value={formData.level}
              onChange={handleInputChange}
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
              htmlFor="specialNeeds"
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
              id="specialNeeds"
              value={formData.specialNeeds}
              onChange={handleInputChange}
              className={`form-control form-items form-label ${error && "border-danger"}`}
            >
              <option value="">Select special need</option>
              <option value="Dyslexia">Dyslexia</option>
              <option value="Dysgraphia">Dysgraphia</option>
              <option value="Dyscalculia">Dyscalculia</option>
              <option value="Dysorthography">Dysorthography</option>
            </select>
          </div>
        </div>

        {/* Max Participants */}
        <div className="mb-3 d-flex flex-column">
          <div
            className="d-flex form-label form-items"
            style={{ gap: "10px", marginBottom: "-15px" }}
          >
            <label
              htmlFor="maxParticipants"
              className="form-items form-label mb-0"
              style={{ whiteSpace: "nowrap", marginBottom: "5px" }}
            >
              Max Number of Participants
            </label>
            <select
              id="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleInputChange}
              className="form-items form-select"
              style={{ width: "120px" }}
            >
              <option value={0}>No Limit</option>
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

        {/* Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-items form-label d-flex">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-items form-control"
            rows="3"
            placeholder="Enter description"
          ></textarea>
        </div>

        {/* Mandatory Fields Notice */}
        {error && (
          <p className="form-items text-danger">
            * Mandatory fields to fill.
          </p>
        )}

        {/* Create Button */}
        <div className="text-center mb-3">
          <button type="submit" className="custom-button btn">
            Create
          </button>
        </div>
      </form>

      {/* Mandatory Fields Warning Modal */}
      {isMandatoryWarningVisible && (
        <div className="mandatory-warning-modal">
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
        <div className="tooltip-modal">
          <p>{tooltipModal.text}</p>
          <button
            className="btn btn-secondary"
            onClick={() => setTooltipModal({ visible: false, text: "" })}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateGroup;
