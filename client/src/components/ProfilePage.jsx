import React, { useEffect, useState } from "react";
import "./../css/profilepage.css";

const ProfilePage = ({ setFooterOption, setGroup }) => {
  useEffect(() => {
    if (setFooterOption) setFooterOption("profile");
    if (setGroup) setGroup(null);
  }, [setFooterOption, setGroup]);

  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "Mario",
    lastName: "Rossi",
    university: "Politecnico di Torino",
    disorder: "DSA",
    profile_image: 'image_static/profile.png',
    email: "mario.rossi@studenti.polito.it",
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    console.log("Updated user data:", userData);
    // Here you would typically send the userData to your backend to save the changes.
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img src={userData.profile_image} alt="Profile" className="profile-image" />
          {isEditing ? (
            <div>
              <input type="text" name="firstName" value={userData.firstName} onChange={handleInputChange} placeholder="First Name" />
              <input type="text" name="lastName" value={userData.lastName} onChange={handleInputChange} placeholder="Last Name" />
            </div>
          ) : (
            <h2 className="profile-name">{userData.firstName} {userData.lastName}</h2>
          )}
        </div>
        <div className="profile-content">

          <div className="info-card">
            <span className="info-label">University:</span>
            {isEditing ? (
              <input type="text" name="university" value={userData.university} onChange={handleInputChange} placeholder="University" />
            ) : (
              <span className="info-value">{userData.university}</span>
            )}
          </div>
          <div className="info-card">
            <span className="info-label">SLD:</span>
            {isEditing ? (
              <input type="text" name="disorder" value={userData.disorder} onChange={handleInputChange} placeholder="SLD" />
            ) : (
              <span className="info-value">{userData.disorder}</span>
            )}
          </div>
          <div className="info-card">
            <span className="info-label">Email:</span>
            {isEditing ? (
              <input type="email" name="email" value={userData.email} onChange={handleInputChange} placeholder="Email" />
            ) : (
              <span className="info-value">{userData.email}</span>
            )}
          </div>

          <div className="edit-button">
            <button onClick={isEditing ? handleSaveClick : handleEditClick}>
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;