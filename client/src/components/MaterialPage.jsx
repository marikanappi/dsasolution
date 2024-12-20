import React, { useState } from "react";
import "./../css/materialpage.css";
import { FaImage, FaFileAlt, FaMusic } from "react-icons/fa";
import { addMaterial} from "../../api";


const MaterialPage = ({ setFooterOption, setGroup }) => {
  const [groups, setGroups] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [image, setImage] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [audioFile, setAudioFIle] = useState(null);
  const [selectedType, setSelectedType] = useState("");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // handle per il caricamento di un'immagine e chiamo api per aggiungere image in material
  const handleImageUpload = async () => {
    if (!image) {
      setUploadStatus("Please select an image to upload");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    const response = await addMaterial(formData);
    if (response) {
      setUploadStatus("Image uploaded successfully");
    } else {
      setUploadStatus("Failed to upload image");
    }
  };





  return (
    <div className="app-container">
      
        <div>{groups.name}</div>
      

      {/* Toolbar */}
      <div className="toolbar">
      <button className="button">
    <FaImage /> Image
      </button>
        <button className="button">
          <FaFileAlt /> 
          Document
        </button>
        <button className="button">
          <FaMusic /> 
          Audio
        </button>
      </div>

      
       {/* Main Content */}
       <div className="main-content">
        <h2>Upload Files</h2>

        {/* Sezione per caricare immagine */}
        <div className="file-upload">
          <label htmlFor="image-upload">Select Image</label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            // Gestisce la selezione di un'immagine
          />
          <button onClick={handleImageUpload}>Upload Image</button> {/* Carica l'immagine */}
        </div>

        {/* Sezione per caricare documento */}
        <div className="file-upload">
          <label htmlFor="document-upload">Select Document</label>
          <input
            id="document-upload"
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            // Gestisce la selezione di un documento
          />
          <button>Upload Document</button> {/* Carica il documento */}
        </div>

        {/* Sezione per caricare file audio */}
        <div className="file-upload">
          <label htmlFor="audio-upload">Select Audio</label>
          <input
            id="audio-upload"
            type="file"
            accept="audio/*"
            // Gestisce la selezione di un file audio
          />
          <button>Upload Audio</button> {/* Carica il file audio */}
        </div>

        {/* Messaggio di stato */}
        {uploadStatus && <p>{uploadStatus}</p>}
      </div>
    </div>
  );
};
      

export default MaterialPage;
