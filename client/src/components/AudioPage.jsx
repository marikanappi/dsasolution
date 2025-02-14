import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useState } from "react-router-dom";
import "./../css/audiopage.css";
import { getaudio } from "../../API.mjs";

const AudioPage = ({ group, setFooterOption}) => {
  const navigate = useNavigate();
  const [audio, setAudio] = useState([]);

  const handleBack = () => {
    navigate(-1);
  };

  // Funzione per recuperare le immagini
  const fetchAudio = async () => {
    if (!group || !group.id) return; // Controllo se il gruppo esiste
    try {
      const audioData = await getaudio(group.id);
      console.log("audioData", audioData);
      setImages(audioData || []); // Evita problemi se il valore è null
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
        <h2 className="group-card-title">{group.name}</h2>
      </div>

      <div className="audio-page">
        <div className="audio-grid">
          {audio.length === 0 ? (
            <p>No audio files found.</p>
          ) : (
            audio.map((audioFile) => (
              <div key={audioFile.material_id} className="audio-card">
                <audio controls>
                  <source src={`http://localhost:3001/uploads/${audioFile.name}`} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <div className="audio-details">
                  <p>{audioFile.name}</p>
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
