import { AiOutlineCloudUpload } from "react-icons/ai"; // Upload icon
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { FaFolder } from "react-icons/fa"; // Folder icon
import { MdInsertDriveFile } from "react-icons/md"; // Generic file icon
import { addMaterial } from "../../API.mjs";
import "./../css/materialpage.css";

const MaterialPage = ({ group, setFooterOption }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null); // Selected file
  const [filePreview, setFilePreview] = useState(null); // File preview

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

      // Aggiungi ai materiali del gruppo
      await addMaterial(group.id, fileUrl, type);

      alert(`File "${file.name}" caricato con successo!`);
      setFile(null);
      setFilePreview(null);
    } catch (error) {
      console.error("Errore durante l'upload:", error);
    }
  };

  return (
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
      <div className="upload-section">
        <input type="file" accept=".png,.jpg,.jpeg,.pdf" onChange={handleFileChange} />

        {/* Anteprima del file */}
        {file && (
          <div className="file-preview">
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
          </div>
        )}

        <button className="upload-btn" onClick={handleUpload}>
          <AiOutlineCloudUpload className="upload-icon" />
          Carica File
        </button>
      </div>
    </div>
  );
};

export default MaterialPage;
