import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import "./../css/audiopage.css";
import { getAudio } from "../../API.mjs";

const AudioPage = ({ group, setFooterOption }) => {
  const navigate = useNavigate();
  const [audio, setAudio] = useState([]);

  const handleBack = () => {
    navigate(-1);
  };

  // Funzione per recuperare le immagini
  const fetchAudio = async () => {
    if (!group || !group.id) return; // Controllo se il gruppo esiste
    try {
      const audioData = await getAudio(group.id);
      console.log("audioData", audioData);
      setAudio(audioData || []); // Evita problemi se il valore è null
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  useEffect(() => {
    fetchAudio();
  }, [group]); // Chiamata ogni volta che il gruppo cambia

  return (
    <>
      <div className="back-arrow" onClick={handleBack}>
        <FaArrowLeft size={25} />
      </div>

      <div className="group-card">
        <p className="group-card-title">{group.name}</p>
      </div>

      <div className="audio-page">
        <div className="audio-grid">
          {audio.length === 0 ? (
            <p className="no-files-message">No audio files found.</p>
          ) : (
            audio.map((audioFile) => (
              <div key={audioFile.material_id} className="audio-card">
                <div className="audio-player">
                  <audio controls>
                    <source
                      src={`${audioFile.name}`}
                      type="audio/mpeg"
                    />
                    Your browser does not support the audio element.
                  </audio>
                </div>
                <div className="audio-details">
                  <p className="audio-name">{audioFile.name.split('/').pop()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default AudioPage;
