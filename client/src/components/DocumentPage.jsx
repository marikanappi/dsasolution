import React, { useState, useEffect } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FaFolder, FaFolderOpen, FaFilePdf } from "react-icons/fa";
import { getDocument } from "../../API.mjs";
import "./../css/documentpage.css"; 

const DocumentPage = ({ group, setFooterOption }) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    setFooterOption("Documents");
  }, []);
  
  const fetchDocuments = async () => {
    if (!group || !group.id) return; // Controllo se il gruppo esiste
    try {
      const documentsData = await getDocument(group.id);
      console.log("documentsData", documentsData);
      setDocuments(documentsData);
    } catch (err) {
      console.error("Error fetching documents:", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [group]); // Chiamata ogni volta che il gruppo cambia
  console.log("SEI IN DOCUMENTS:::::", documents);
  return (
    <div className="document-page">
      <h1 className="page-title">Documents Gallery</h1>

      <div className="document-grid">
        {documents.length === 0 ? (
          <p>No documents found.</p>
        ) : (
          documents.map((document) => (
            <div key={document.material_id} className="document-card">

                <div className="document-thumbnail">
                  <FaFolder className="folder-icon" /> {/* Icona per la cartella */}
                </div>

              <div className="document-details">
                <p>{document.name}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};



export default DocumentPage;
