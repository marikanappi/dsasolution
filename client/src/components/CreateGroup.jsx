// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { FaQuestionCircle, FaArrowLeft } from "react-icons/fa";
import { addGroup } from "../../API.mjs"; // Import API functions
import "./../css/creategroup.css"; // Import CSS for styling
import { useNavigate } from "react-router-dom"; // Import the navigate hook

// eslint-disable-next-line react/prop-types
const CreateGroup = ({ setFooterOption }) => {
  const [formData, setFormData] = useState({
    name: "",
    university: "",
    level: "",
    specialNeeds: "",
    description: "",
    maxParticipants: 0,
  });

  const navigate = useNavigate(); // Use the navigate hook

  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState("");
  const [error, setError] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [setMandatoryWarningVisible] = useState(false);
  const [tooltipModal, setTooltipModal] = useState({
    visible: false,
    text: "",
  });

  const [exitModalVisible, setExitModalVisible] = useState(false); // State for exit confirmation modal

  useEffect(() => {
    setFooterOption("CreateGroup");
  }, [setFooterOption]);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleBack = () => {
    navigate(-1); // Torna indietro alla pagina precedente
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setImageFile(file); // Salva il file nello stato
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result); // Mostra l'anteprima
      reader.readAsDataURL(file);
      setImageName(file.name);
    } else {
      alert("Please upload a PNG or JPG file.");
    }
  };

  // Handle group creation
  const handleCreate = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.university ||
      !formData.level ||
      !formData.specialNeeds
    ) {
      setError(true);
      setMandatoryWarningVisible(true);
      return;
    }

    const groupData = {
      ...formData,
      imageFile: imageFile,
    };

    try {
      const result = await addGroup(groupData);
      if (result) {
        alert("Group added successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group. Please try again.");
    }
  };

  const handleExit = () => {
    setFooterOption("Home"); // Explicitly set footerOption to "Home" here
    setExitModalVisible(false); // Close the exit modal
    navigate("/"); // Navigate to the home page
  };

  // Render the component
  return (
    <div>
      <div className="title-header" onClick={handleBack}>
      <FaArrowLeft size={25} style={{ cursor: "pointer", color: "white", marginRight: "5px"}} />
        <h5>Create a New Group</h5>
      </div>
      <div className="p-3">
        <form onSubmit={handleCreate}>
          <div>
            <div className="row">
              <div
                className="col-4 d-flex flex-column align-items-right"
                style={{ marginTop: "14px" }}
              >
                <div
                  className={`image-upload-container ${
                    imagePreview ? "image-uploaded" : ""
                  }`}
                  style={{
                    backgroundImage: imagePreview
                      ? `url(${imagePreview})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "100px",
                    height: "100px",
                    border: "1px solid #ccc",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {!imagePreview && <span className="add-text">+ Add</span>}
                </div>
                <input
                  type="file"
                  id="group-pic"
                  name="profile_pic"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleFileChange}
                  style={{
                    fontSize: "13px",
                    maxWidth: "94px",
                    paddingTop: "8px",
                  }}
                />
              </div>
              <div className="col-7" style={{ paddingRight: "10px" }}>
                <div className="row mb-2">
                  <label className="form-label">Group Name*</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`form-control`}
                    placeholder="Enter group name"
                  />
                </div>

                <div className="row mb-3">
                  <label htmlFor="university" className="form-label">
                    University*
                  </label>
                  <input
                    type="text"
                    id="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    className={`form-control`}
                    placeholder="Enter university name"
                  />
                </div>
              </div>
            </div>

            {/* Level Selection */}
            <div className="mb-3">
              <label
                htmlFor="level"
                className="form-items form-label d-flex align-items-center"
              >
                Level*
                <FaQuestionCircle
                  className="help-icon ms-2"
                  onClick={() =>
                    setTooltipModal({
                      visible: true,
                      text: "Selecting the appropriate difficulty level for your study group helps tailor the content and discussions.",
                    })
                  }
                />
              </label>
              <select
                id="level"
                value={formData.level}
                onChange={handleInputChange}
                className={`form-control form-select`}
              >
                <option value="">Select level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Special Needs */}
            <div className="mb-3">
              <label
                htmlFor="specialNeeds"
                className="form-label d-flex align-items-center"
              >
                Special Needs*
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
                className={`form-control form-select`}
              >
                <option value="">Select special need</option>
                <option value="Dyslexia">Dyslexia</option>
                <option value="Dysgraphia">Dysgraphia</option>
                <option value="Dyscalculia">Dyscalculia</option>
                <option value="Dysorthography">Dysorthography</option>
              </select>
            </div>

            {/* Max Participants */}
            <div className="mb-3 d-flex align-items-center">
              <div className="me-3 d-flex flex-column">
                <label htmlFor="maxParticipants" className="form-label mb-0">
                  Max Number of Participants
                </label>
                <small style={{ fontSize: "11px" }}>
                  Set a limit up to 50.
                </small>
              </div>

              <select
                id="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleInputChange}
                className="form-select"
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

            {/* Description */}
            <div className="mb-4">
              <label
                htmlFor="description"
                className="form-items form-label d-flex"
              >
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
          </div>

          {/* Mandatory Fields Notice */}
          {error && (
            <p className="form-items text-danger">
              * Mandatory fields to fill.
            </p>
          )}

          {/* Create Button */}
          <div className="text-center mb-3 create-container">
            <button type="submit" className="create-button">
              Create
            </button>
          </div>
        </form>

        {/* Tooltip Modal */}
        {tooltipModal.visible && (
          <div className="modal">
          <div className="modal-content">
            <p>{tooltipModal.text}</p>
            <button
              className="btn btn-secondary"
              onClick={() => setTooltipModal({ visible: false, text: "" })}
            >
              Close
            </button>
          </div>
          </div>
        )}

        {/* Exit Confirmation Modal */}
        {exitModalVisible && (
          <div className="exit-modal">
            <p>Are you sure you want to exit?</p>
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-secondary"
                onClick={() => setExitModalVisible(false)}
              >
                No
              </button>
              <button className="btn btn-danger" onClick={handleExit}>
                Yes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateGroup;
