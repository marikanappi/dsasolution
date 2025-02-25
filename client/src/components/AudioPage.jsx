import React from "react";
import { FaArrowLeft, FaCloudDownloadAlt, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import "./../css/audiopage.css";
import { getAudio, deleteMaterial } from "../../API.mjs";

const AudioPage = ({ group, setFooterOption }) => {
  const navigate = useNavigate();
  const [audio, setAudio] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [audioToDelete, setAudioToDelete] = useState(null);
  const isAdmin = group.usercreate === 1; // Replace with actual admin check

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (setFooterOption) {
      setFooterOption("Audio");
    }
  }, [setFooterOption]);


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

  const handleDownloadAudio = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = url.split("/").pop(); // Scarica il file con il nome finale

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading audio:', error);
      alert('Error downloading the audio. Please try again.');
    }
  };


  const handleDeleteAudio = async (material_id) => {
    try {
      await deleteMaterial(material_id);
      setAudio((prevAudio) =>
        prevAudio.filter((doc) => doc.material_id !== material_id)
      );
      setShowModal(false);
    } catch (err) {
      console.error("Error deleting document:", err);
    }
  };

  const handleConfirmDelete = (audio) => {
    setAudioToDelete(audio);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="back-arrow" onClick={handleBack}>
        <FaArrowLeft size={25} />
      </div>

      <div className="group-card">
        <h2 className="group-card-title">Audio for {group.name}</h2>
      </div>

      <div className="audio-page">
        <div className="audio-grid">
          {audio.length === 0 ? (
            <p className="m-4">No audio files found.</p>
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
                  {isAdmin ? (
                    <div>
                      <FaCloudDownloadAlt
                        className="download-icon-doc"
                        title="Download"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadAudio(`http://localhost:3001/uploads/${audioFile.name}`);
                        }}
                      />
                      <FaTrash
                        className="delete-icon-audio"
                        title="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirmDelete(audioFile);
                        }}
                      />
                    </div>
                  ) : (
                    <FaCloudDownloadAlt
                    className="download-icon-doc"
                    title="Download"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadAudio(`http://localhost:3001/uploads/${audioFile.name}`);
                    }}
                  />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal per conferma eliminazione */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <p className="text-left">Are you sure you want to delete this file audio?</p>
              <div className="row-buttons-container">
              <button className="btn btn-success" onClick={() => handleDeleteAudio(audioToDelete?.material_id)}>
                Yes
              </button>
              <button className="btn modal-button" onClick={handleCloseModal}>
                Cancel
              </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default AudioPage;
