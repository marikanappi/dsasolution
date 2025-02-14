import { AiOutlineCloudUpload } from "react-icons/ai"; // Upload icon
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { FaFilePdf, FaFolder, FaPlus, FaArrowLeft } from "react-icons/fa"; // Folder & Back icon
import { MdInsertDriveFile } from "react-icons/md"; // Generic file icon
import { addMaterial } from "../../API.mjs";
import "./../css/materialpage.css";

const MaterialPage = ({ group, setFooterOption }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null); // Selected file
  const [filePreview, setFilePreview] = useState(null); // File preview
  const [modalOpen, setModalOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    setFooterOption("Materials");
  }, [setFooterOption]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);

      // Controlla il tipo di file
      if (selectedFile.type.startsWith("image/")) {
        // Anteprima per immagini
        const reader = new FileReader();
        reader.onload = () => setFilePreview(reader.result);
        reader.readAsDataURL(selectedFile);
      } else if (selectedFile.type === "application/pdf") {
        // Immagine statica per i PDF
        setFilePreview("/images/pdf-preview.png");
      } else if (selectedFile.type.startsWith("audio/")) {
        // Immagine statica per audio
        setFilePreview("/images/audio-preview.png");
      } else {
        // Anteprima generica per altri file
        setFilePreview("/images/file-preview.png");
      }

      setModalOpen(true);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Seleziona un file prima di caricare!");
      return;
    }

    let type;
    if (file.type.startsWith("image/")) type = "image";
    else if (file.type === "application/pdf") type = "document";
    else if (file.type.startsWith("audio/")) type = "audio";
    else {
      alert("Tipo di file non supportato!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("group_id", group.id);
      formData.append("type", type);

      const result = await fetch("http://localhost:3001/material", {
        method: "POST",
        body: formData,
      });

      if (!result.ok) {
        throw new Error("Errore durante l'upload del file");
      }

      const data = await result.json();
      const fileUrl = data.material.name;

      // Navigazione basata sul tipo di file
      if (fileUrl.endsWith(".jpg") || fileUrl.endsWith(".png")) {
        navigate("/images");
      } else if (fileUrl.endsWith(".pdf")) {
        navigate("/documents");
      } else if (fileUrl.endsWith(".mp3")) {
        navigate("/audio");
      }

      setFile(null);
      setFilePreview(null);
      setModalOpen(false); // Chiudi il modal dopo l'upload
    } catch (error) {
      console.error("Errore durante l'upload:", error);
    }
  };

  const closeModal = () => {
    setModalOpen(false); // Chiude il modal
  };

  const cancelUpload = () => {
    setFile(null); // Resetta il file selezionato
    setFilePreview(null); // Cancella l'anteprima
    setModalOpen(false); // Chiude il modal
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="material-container">
      <div className="back-arrow" onClick={handleBack}>
        <FaArrowLeft size={25} />
      </div>

      <div className="group-page">
        <div className="group-card">
          <p className="group-card-title">{group.name}</p>
        </div>

        <div className="material-page">
          {/* Bottoni per scegliere il tipo di materiale */}
          <div className="material-filters d-flex justify-content-around">
            <button className="folder-btn" onClick={() => handleNavigate("/images")}>
              <FaFolder className="folder-icon" />
              <span>Images</span>
            </button>

            <button className="folder-btn" onClick={() => handleNavigate("/documents")}>
              <FaFolder className="folder-icon" />
              <span>Documents</span>
            </button>

            <button className="folder-btn" onClick={() => handleNavigate("/audio")}>
              <FaFolder className="folder-icon" />
              <span>Audio</span>
            </button>
          </div>

          {/* Sezione per l'upload del file */}
          <div className="plus-icon-container">
            <button
              className="plus-icon-button"
              onClick={() => document.getElementById("fileInput").click()}
            >
              <FaPlus className="plus-icon" />
            </button>
            <input
              type="file"
              id="fileInput"
              accept=".png,.jpg,.jpeg,.pdf,.mp3"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
        </div>
      </div>

      {/* Modal per la preview e il caricamento del file */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">

            {/* Anteprima del file */}
            {filePreview && (
              file.type.startsWith("image/") ? (
                <img src={filePreview} alt="Preview" className="preview-image" />
              ) : file.type === "application/pdf" ? (
                <FaFilePdf className="pdf-icon" />
              ) : file.type.startsWith("audio/") ? (
                <img src="/images/audio-preview.png" alt="Audio Preview" className="preview-image" />
              ) : (
                <MdInsertDriveFile className="generic-file-icon" />
              ) 
            )}
            <p>{file?.name}</p>
            <div className="modal-actions">
              <button onClick={handleUpload} className="btn modal-button" style={{ backgroundColor: "green", color: "white" }}>
                <AiOutlineCloudUpload className="upload-icon" /> Upload
              </button>
              <button onClick={cancelUpload} className="btn modal-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialPage;
