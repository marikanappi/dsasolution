import React from "react";
import { FaFilePdf, FaFileWord, FaFileAlt } from "react-icons/fa";

const DocumentPage = ({ group, documents = []}) => {
  const handleDocumentError = (fileName) => {
    console.error(`Errore nel caricamento del documento: ${fileName}`);
  };

  return (
    <>
      <div className="group-card">
        <h2 className="group-card-title">{group.name}</h2>
      </div>

      <div className="document-page">
        <div className="document-grid">
          {documents.length === 0 ? (
            <p>No documents found.</p>
          ) : (
            documents.map((document) => {
              const fileName = document.name.split("/").pop(); // Estrai solo il nome del file

              return (
                <div key={document.material_id} className="document-card">
                  <div className="document-thumbnail">
                    {fileName.endsWith(".pdf") ? (
                      <FaFilePdf className="file-icon pdf-icon" title="PDF File" />
                    ) : fileName.endsWith(".doc") || fileName.endsWith(".docx") ? (
                      <FaFileWord className="file-icon word-icon" title="Word Document" />
                    ) : (
                      <FaFileAlt className="file-icon default-icon" title="Other Document" />
                    )}
                  </div>
                  <div className="document-details">
                    <p>{fileName}</p>
                    <a href={document.name} target="_blank" rel="noopener noreferrer">
                      Open Document
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default DocumentPage;
