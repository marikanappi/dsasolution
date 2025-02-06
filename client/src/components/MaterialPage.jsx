import { AiOutlineCloudUpload } from "react-icons/ai"; // Icon for the upload button 
import { useNavigate } from "react-router-dom"; 
import React, { useEffect, useState } from "react"; 
import { FaFolder } from "react-icons/fa"; // Icon for the folder 
import "./../css/materialpage.css"; 
 
const MaterialPage = ({group, setFooterOption }) => { 
  const navigate = useNavigate(); 
  const [file, setFile] = useState(null); // File to upload 
 
  useEffect(() => {  
    setFooterOption("Materials"); // Set the footer option to Materials 
  }, []); 
 
  const handleNavigate = (path) => { 
    navigate(path);  // Usa la funzione navigate di react-router 
  }; 
 
  const handleFileChange = (event) => { 
    setFile(event.target.files[0]); // Salva il file selezionato 
  }; 
 
  // Funzione per caricare il file 
  const handleUpload = async () => { 
    if (!file) { 
      alert("Seleziona un file prima di caricare!"); 
      return; 
    } 
  } 
 
   
 
  return ( 
    <div className="material-page"> 
      {/* Bottoni per scegliere il tipo di materiale */} 
      <div className="material-filters d-flex justify-content-around"> 
        <button 
          className="folder-btn" 
          onClick={() => handleNavigate("/images")}  // Naviga alla pagina delle immagini 
        > 
          <FaFolder className="folder-icon" /> 
          <span>Images</span> 
        </button> 
 
        <button 
          className="folder-btn" 
          onClick={() => handleNavigate("/documents")}  // Naviga alla pagina dei documenti 
        > 
          <FaFolder className="folder-icon" /> 
          <span>Documents</span> 
        </button> 
 
        <button 
          className="folder-btn" 
          onClick={() => handleNavigate("/audio")}  // Naviga alla pagina degli audio 
        > 
          <FaFolder className="folder-icon" /> 
          <span>Audio</span> 
        </button> 
      </div> 
 
      {/* Sezione per l'upload del file */} 
      <div className="upload-section"> 
        <input type="file" onChange={handleFileChange} /> 
        <button className="upload-btn" onClick={handleUpload}> 
          <AiOutlineCloudUpload className="upload-icon" /> 
          Carica File 
        </button> 
      </div> 
    </div> 
  ); 
}; 
 
 
 
export default MaterialPage;