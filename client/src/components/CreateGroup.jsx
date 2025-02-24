// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { FaQuestionCircle, FaArrowLeft } from "react-icons/fa";
import { addGroup } from "../../API.mjs"; // Import API functions
import "./../css/creategroup.css"; // Import CSS for styling
import { useNavigate } from "react-router-dom"; // Import the navigate hook
import Select from "react-select";

const CreateGroup = ({ setFooterOption }) => {
  const [formData, setFormData] = useState({
    name: "",
    university: "",
    level: "",
    specialNeeds: "",
    description: "",
    maxParticipants: 10,
  });

  const navigate = useNavigate(); // Use the navigate hook

  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState("");
  const [error, setError] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [MandatoryWarningVisible, setMandatoryWarningVisible] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [tooltipModal, setTooltipModal] = useState({
    visible: false,
    text: "",
  });
  const [showExitModal, setShowExitModal] = useState(false); // State for exit confirmation modal
  const [exitModalVisible, setExitModalVisible] = useState(false); // State for exit confirmation modal

  useEffect(() => {
    setFooterOption("CreateGroup");
  }, [setFooterOption]);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minWidth: "150px", // Adjust width as needed
      fontSize: "14px", // Adjust font size
    }),
    menu: (provided) => ({
      ...provided,
      minWidth: "150px",
    }),
  };

  const customStylesNumber = {
    control: (provided) => ({
      ...provided,
      minWidth: "100px", // Adjust width as needed
      fontSize: "14px", // Adjust font size
    }),
    menu: (provided) => ({
      ...provided,
      minWidth: "100px",
    }),
  };

  const levelOptions = [
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" },
  ];

  const specialNeedsOptions = [
    { value: "Dyslexia", label: "Dyslexia" },
    { value: "Dysgraphia", label: "Dysgraphia" },
    { value: "Dyscalculia", label: "Dyscalculia" },
    { value: "Dysorthography", label: "Dysorthography" },
  ];

  const maxParticipantsOptions = [...Array(50)].map((_, i) => ({
    value: i + 1,
    label: i + 1,
  }));

  // Handle form field changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleBack = () => {
    setShowExitModal(true); // Attiva il modal di conferma uscita
  };

  const handleCancelArrow = () => {
    setShowExitModal(false); // Close the modal without any action
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
      setError("Please fill in all required fields."); // Imposta il messaggio di errore
      return;
    }

    const groupData = {
      ...formData,
      imageFile: imageFile,
    };

    try {
      const result = await addGroup(groupData);
      if (result) {
        setShowSuccessModal(true);
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
        <FaArrowLeft
          size={25}
          style={{ cursor: "pointer", color: "white", marginRight: "5px" }}
        />
        <h5>Create a New Group</h5>
      </div>
      <div className="p-3">
        <form onSubmit={handleCreate} className="create-group-form">
          <div>
            <div className="row">
              <div
                className="col-4 d-flex flex-column align-items-right"
                style={{ marginTop: "30px" }}
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
                    width: "110px",
                    height: "110px",
                    border: "1px solid #ccc",
                    borderRadius: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer", // Makes it clear that it's clickable
                  }}
                  onClick={() => document.getElementById("group-pic").click()} // Triggers input on div click
                >
                  {!imagePreview && <span className="add-text">+ Add</span>}
                </div>
                <input
                  type="file"
                  id="group-pic"
                  name="profile_pic"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleFileChange}
                  style={{ display: "none" }} // Hide the file input
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
                    className={`form-control `}
                    required
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
                    className={`form-control `}
                    required
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
              <Select
                id="level"
                value={levelOptions.find(
                  (option) => option.value === formData.level
                )}
                onChange={(selectedOption) =>
                  handleInputChange({
                    target: { id: "level", value: selectedOption.value },
                  })
                }
                options={levelOptions}
                styles={customStyles}
              />
            </div>

            {/* Special Needs */}
            <div className="mb-3">
              <label
                htmlFor="specialNeeds"
                className="form-label d-flex align-items-center"
              >
                SLD*
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
              <Select
                id="specialNeeds"
                value={specialNeedsOptions.find(
                  (option) => option.value === formData.specialNeeds
                )}
                onChange={(selectedOption) =>
                  handleInputChange({
                    target: { id: "specialNeeds", value: selectedOption.value },
                  })
                }
                options={specialNeedsOptions}
                styles={customStyles}
              />
            </div>

            {/* Max Participants */}
            <div className="mb-3 d-flex align-items-center">
              <div className="me-3 d-flex flex-column">
                <label htmlFor="maxParticipants" className="form-label m-0">
                  Max Number of Participants
                  <FaQuestionCircle
                    className="help-icon ms-1"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      setTooltipModal({
                        visible: true,
                        text: "Set a number up to 50.",
                      })
                    }
                  />
                </label>
              </div>
              <Select
                id="maxParticipants"
                value={maxParticipantsOptions.find(
                  (option) => option.value === formData.maxParticipants
                )}
                onChange={(selectedOption) =>
                  handleInputChange({
                    target: {
                      id: "maxParticipants",
                      value: selectedOption.value,
                    },
                  })
                }
                options={maxParticipantsOptions}
                styles={{
                  ...customStylesNumber,
                  control: (base) => ({ ...base, width: "100px" }),
                }}
              />
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
        </form>

        {error && <div className="error-message text-left">{error}</div>}

        {/* Create Button */}
        <div className="create-container">
          <button
            type="submit"
            className="create-button"
            onClick={handleCreate}
          >
            Create
          </button>
        </div>

        {/* Tooltip Modal */}
        {tooltipModal.visible && (
          <div className="modal">
            <div className="modal-content">
              <p className="text-left">{tooltipModal.text}</p>
              <button
                className="btn modal-button"
                onClick={() => setTooltipModal({ visible: false, text: "" })}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {showSuccessModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Group Created Successfully!</h3>
              <p>Your group has been created and is ready for use.</p>
              <button
                className="btn modal-button"
                onClick={() => {
                  navigate("/"); // Naviga alla home
                }}
              >
                Go to Home
              </button>
            </div>
          </div>
        )}

        {/* Exit Confirmation Modal */}
        {exitModalVisible && (
          <div className="exit-modal">
            <p className="text-left">Are you sure you want to exit?</p>
            <div className="d-flex justify-content-center">
              <button
                className="btn modal-button"
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
        {showExitModal && (
          <div className="modal">
            <div className="modal-content">
              <h3 className="text-left">Are you sure you want to exit?</h3>
              <p className="text-left">All your changes will be discarded.</p>
              <div className="row-buttons-container">
                <button className="btn btn-danger" onClick={handleExit}>
                  Exit
                </button>
                <button
                  className="btn modal-button"
                  onClick={handleCancelArrow}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateGroup;
