import React from "react";
import "./profile.css";

const ProfilePage = () => {
  const name = "Mario";
  const surname = "Rossi";
  const email = 's33333@studenti.polito.it';
  const age = 24;
  const university = "Politecnico di Torino";
  const SLD = ['Dyscalculic', 'Dyslexic']; // Esempio di array con i disturbi SLD

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src="profile.jpg" alt="Profile" className="profile-img" />
        <div className="profile-info">
          <h1>{name} {surname}</h1>
          <p className="profile-university">{university}</p>
        </div>
      </div>
      <div className="profile-details">
        <div className="profile-detail">
          <strong>SLD: </strong>
          <ul className="sld-list">
            {SLD.map((item, index) => (
              <li key={index} className="sld-item">{item}</li>
            ))}
          </ul>
        </div>
        <div className="profile-detail">
          <strong>Email: </strong>
          <p>{email}</p>
        </div>
        <div className="profile-detail">
          <strong>Age: </strong>
          <p>{age} years old</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
