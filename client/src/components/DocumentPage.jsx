import React, { useState, useEffect } from "react";
import { FaFilePdf, FaFileWord, FaFileAlt, FaCloudDownloadAlt, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getDocument } from "../../API.mjs";
import "./../css/documentpage.css";

const DocumentPage = ({ group, setFooterOption }) => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (setFooterOption) {
      setFooterOption("Documents");
    }
  }, [setFooterOption]);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!group || !group.id) return;
      try {
        const documentData = await getDocument(group.id);
        setDocuments(documentData || []); // Evita problemi se il valore è null
      } catch (err) {
        console.error("Error fetching documents:", err);
        setDocuments([]); // Imposta un array vuoto in caso di errore
      }
    };

    fetchDocuments();
  }, [group]);

  const handleOpenDocument = (url) => {
    window.open(url, "_blank");
  };

  const handleDownloadDocument = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop();
    link.click();
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="document-page">
      <div className="back-arrow" onClick={handleBack}>
        <FaArrowLeft size={25} />
      </div>

      <div className="group-card">
        <p className="group-card-title">{group.name}</p>
      </div>

      <div className="document-grid">
        {documents.length === 0 ? (
          <p>No documents found.</p>
        ) : (
          documents.map((document) => {
            const fileName = document.name.split("/").pop();

            return (
              <div
                key={document.material_id}
                className="document-card"
                onClick={() => handleOpenDocument(document.name)}
              >
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
                  <p title={fileName}>{fileName}</p>
                  <span className="document-meta">{group?.name || "Unknown Group"}</span>
                </div>
                <FaCloudDownloadAlt
                  className="download-icon"
                  title="Download"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadDocument(document.name);
                  }}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DocumentPage;
