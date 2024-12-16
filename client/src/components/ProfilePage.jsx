import React, { useEffect } from "react";
import { FaExclamationCircle, FaEdit } from "react-icons/fa";
import "./../css/profilepage.css"; // Il file CSS per lo stile

const ProfilePage = ({ setFooterOption, setGroup }) => {
  useEffect(() => {
    if (setFooterOption) setFooterOption("profile");
    if (setGroup) setGroup(null);
  }, [setFooterOption, setGroup]);

  const user = {
    firstName: "Mario",
    lastName: "Rossi",
    university: "Politecnico di Torino",
    sld: "Dyscalculic",
    profilePicture: "image_static/profile.png", // Sostituisci con un URL valido
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={user.profilePicture}
            alt="Immagine del profilo"
            className="profile-image"
          />
          <button className="edit-button" title="Modifica Profilo">
            <FaEdit />
          </button>
        </div>
        <div className="profile-info">
          <p>
            <strong>Name:</strong> {user.firstName}
          </p>
          <p>
            <strong>Surname:</strong> {user.lastName}
          </p>
          <p>
            <strong>University:</strong> {user.university}
          </p>
          <p>
            <strong>SLD:</strong> {user.sld}          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
