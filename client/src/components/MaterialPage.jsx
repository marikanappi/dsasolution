import { AiOutlineCloudUpload } from "react-icons/ai"; // Upload icon
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { FaFolder, FaPlus } from "react-icons/fa"; // Folder icon
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
        // Se è un'immagine, usa FileReader per mostrare l'anteprima
        const reader = new FileReader();
        reader.onload = () => setFilePreview(reader.result);
        reader.readAsDataURL(selectedFile);
      } else if (selectedFile.type === "application/pdf") {
        // Se è un PDF, crea un URL per visualizzarlo con <embed>
        const fileURL = URL.createObjectURL(selectedFile);
        setFilePreview(fileURL);
      } else {
        setFilePreview(null); // Reset dell'anteprima per altri tipi di file
      }

      // Open the modal when file is selected
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
      //se il file finisce per .jpg o png vai a images
      if (fileUrl.endsWith(".jpg") || fileUrl.endsWith(".png")) {
      navigate("/images");
      }
      //se il file finisce per .pdf vai a documents
      else if (fileUrl.endsWith(".pdf")) {
      navigate("/documents");
      }
      setFile(null);
      setFilePreview(null);
      setModalOpen(false); // Close the modal after upload
    } catch (error) {
      console.error("Errore durante l'upload:", error);
    }
  };

  const closeModal = () => {
    setModalOpen(false); // Close the modal when clicking on cancel or close
  };

  return (
    <div className="material-container">
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
              accept=".png,.jpg,.jpeg,.pdf"
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
            {filePreview ? (
              file.type.startsWith("image/") ? (
                <img src={filePreview} alt="Preview" className="preview-image" />
              ) : file.type === "application/pdf" ? (
                <embed src={filePreview} type="application/pdf" width="100%" height="200px" />
              ) : null
            ) : (
              <MdInsertDriveFile className="file-icon" />
            )}
            <p>{file.name}</p>
            <div className="modal-actions">
              <button onClick={handleUpload} className="upload-btn">
              <AiOutlineCloudUpload className="upload-icon" /> Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialPage;
