import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi"; // Importa l'icona di upload
import "./../css/materialpage.css"; // File CSS per lo stile
import { getGroupByName, addImage, getImage } from "../../api";


const MaterialPage = ({ setFooterOption, group }) => {
  const [groupName, setGroupName] = useState("");
  const [selectedType, setSelectedType] = useState("image"); // Default: immagini
  const [materials, setMaterials] = useState([]); // Stato per i materiali
  const [modalData, setModalData] = useState({ nome: "", file: null });
  const [modalVisible, setModalVisible] = useState(false); // Stato per la visibilità della modal
  const navigate = useNavigate();

  // Funzione per ottenere i materiali dal gruppo
  useEffect(() => {
    const fetchMaterials = async () => {
      if (material) {
        try {
          const materialsData = await getImage(material.id); 
          const filteredMaterials = materialsData.filter((item) => item.tipo === selectedType);
          setMaterials(filteredMaterials); 
        } catch (err) {
          console.error("Error fetching materials:", err);
          alert("Error fetching materials.");
        }
      }
    };
    
    fetchMaterials();
  }, [group, selectedType]);
  
  const closeModal = () => {
    setModalVisible(false);
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
      closeModal(); // Chiude la modal dopo l'invio
      fetchMaterials(group); // Aggiorna i materiali
    } catch (err) {
      console.error(`Failed to add file:`, err);
      alert(`Error adding file.`);
    }
  };

  return (
    <div className="material-page">
      <div className="material-filters">
        <button
          className={`filter-btn ${selectedType === "image" ? "active" : ""}`}
          onClick={() => setSelectedType("image")}
        >
          Images
        </button>
        <button
          className={`filter-btn ${selectedType === "document" ? "active" : ""}`}
          onClick={() => setSelectedType("document")}
        >
          Documents
        </button>
        <button
          className={`filter-btn ${selectedType === "audio" ? "active" : ""}`}
          onClick={() => setSelectedType("audio")}
        >
          Audio
        </button>
      </div>

      
      <div className="material-list">
        {materials.length === 0 ? (
          <p>No materials found.</p>
        ) : (
          materials.map((material) => (
            <div key={material.id} className="material-item">
              {selectedType === "image" && (
                //material ha id, groupId,nome e tipo 
                <img
                  
                  alt={material.nome}
                  className="material-image"/>
                
              )}
              <p>{material.nome}</p>
            </div>
          ))
        )}
      </div>

      
      <div className="upload-section">
        <div className="upload-box">
          <FiUpload className="upload-icon" />
          <p>Drag and drop your file here or</p>
          <input
            type="file"
            id="material-file"
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
