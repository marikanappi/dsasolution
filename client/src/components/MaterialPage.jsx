import React, { useEffect, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FaFolder, FaFolderOpen } from "react-icons/fa"; // Icone per le cartelle
import "./../css/materialpage.css"; // File CSS per lo stile
import { getGroupByName, addImage, getImage } from "../../api"; // Importa le API

const MaterialPage = ({ setFooterOption, group }) => {
  const [selectedType, setSelectedType] = useState("image"); // Default: immagini
  const [materials, setMaterials] = useState([]); // Stato per i materiali
  const [modalData, setModalData] = useState({ nome: "", file: null });

  // Funzione per recuperare i materiali filtrati per tipo
  const fetchMaterials = async (group) => {
    try {
      const images = await getImage(group.id);

      if (!images || images.length === 0) {
        console.warn("No materials found for the group:", group.name);
        setMaterials([]);
      }

      const filteredMaterials = images.filter(
        (image) => image.tipo === selectedType
      );

      setMaterials(filteredMaterials);
    } catch (err) {
      console.error("Failed to fetch materials:", err);
      setMaterials([]);
    }
  };

  // Effettua il fetch dei materiali quando cambia il gruppo o il tipo selezionato
  useEffect(() => {
    if (group) {
      fetchMaterials(group);
    }
  }, [group, selectedType]);

  // Funzione per chiudere la modal
  const closeModal = () => {
    setModalData({ nome: "", file: null });
  };

  // Funzione per gestire l'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!modalData.file) {
      alert("Please select a file to upload.");
      return;
    }

    try {
      const fileType = modalData.file.type;
      const validImageTypes = ["image/png", "image/jpeg", "image/jpg"];
      const validDocumentTypes = ["application/pdf", "text/plain"];
      const validAudioTypes = ["audio/mpeg", "audio/wav"];

      let tipo = "";
      if (validImageTypes.includes(fileType)) {
        tipo = "image";
      } else if (validDocumentTypes.includes(fileType)) {
        tipo = "document";
      } else if (validAudioTypes.includes(fileType)) {
        tipo = "audio";
      } else {
        alert("Unsupported file type.");
        return;
      }

      const formData = new FormData();
      formData.append("group", group);
      formData.append("nome", modalData.nome);
      formData.append("file", modalData.file);
      formData.append("tipo", tipo);

      const result = await addImage(formData); // Presuppone che addImage supporti FormData
      alert(`${tipo} added successfully with ID: ` + result.imageId);
      closeModal();
      fetchMaterials(group);
    } catch (err) {
      console.error(`Failed to add file:`, err);
      alert(`Error adding file.`);
    }
  };

  // Stili dinamici per le cartelle
  const folderStyles = (type) =>
    selectedType === type
      ? "folder-btn active-folder"
      : "folder-btn inactive-folder";

  return (
    <div className="material-page">
      {/* Filtri a forma di cartelle */}
      <div className="material-filters d-flex justify-content-around">
        <div
          className={folderStyles("image")}
          onClick={() => setSelectedType("image")}
        >
          <FaFolder className="folder-icon" />
          <span>Images</span>
        </div>
        <div
          className={folderStyles("document")}
          onClick={() => setSelectedType("document")}
        >
          <FaFolder className="folder-icon" />
          <span>Documents</span>
        </div>
        <div
          className={folderStyles("audio")}
          onClick={() => setSelectedType("audio")}
        >
          <FaFolder className="folder-icon" />
          <span>Audio</span>
        </div>
      </div>

      {/* Lista dei materiali */}
      <div className="material-list">
        {materials.length === 0 ? (
          <p>No materials found.</p>
        ) : (
          materials.map((material) => (
            <div key={material.id} className="material-item">
              {selectedType === "image" && (
                <img
                  alt={material.nome}
                  className="material-image"
                />
              )}
              <p>{material.nome}</p>
            </div>
          ))
        )}
      </div>

      
      <div className="upload-section">
        <div className="upload-box">
          <AiOutlineCloudUpload className="upload-icon" />
          <p>Drag and drop your file here or</p>
          <label htmlFor="material-file" className="custom-file-btn">
           Select File
          </label>
          <input
             type="file"
             id="material-file"
             style={{ display: "none" }} // Nascondi il file input
             onChange={(e) =>
             setModalData((prevState) => ({
                ...prevState,
                file: e.target.files[0],
        }))
      }
    />
        </div>
        <button onClick={handleSubmit} className="submit-btn">
          Upload
        </button>
      </div>
    </div>
  );
};

export default MaterialPage;
