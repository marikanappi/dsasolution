import React, { useState, useEffect } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FaFolder, FaFolderOpen } from "react-icons/fa";
import { getAudio } from "../../API.mjs";
//import "./../css/audiopage.css"; 

const AudioPage = ({ group, setFooterOption }) => {
  const [audio, setAudio] = useState([]);

  useEffect(() => {
    setFooterOption("Audio");
  }, []);

  // Funzione per recuperare le immagini
  const fetchAudio = async () => {
    if (!group || !group.id) return; // Controllo se il gruppo esiste
    try {
      const audioData = await getAudio(group.id);
      setImages(audioData);
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  useEffect(() => {
    fetchAudio();
  }, [group]); // Chiamata ogni volta che il gruppo cambia

  return (
    <div className="images-page">
      <h1 className="page-title">Gallery</h1>
      
      <div className="images-grid">
        {audio.length === 0 ? (
          <p>No images found.</p>
        ) : (
          audio.map((audio) => (
            <div key={audio.material_id} className="image-card">

              <img src={`http://localhost:3001/uploads/${audio.name}`} alt={audio.name} className="image-thumbnail" />
              <div className="image-details">
                <p>{audio.name}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AudioPage;
