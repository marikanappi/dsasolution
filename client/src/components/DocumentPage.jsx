import React, { useState, useEffect } from "react";
import { FaFilePdf, FaFileWord, FaFileAlt, FaCloudDownloadAlt } from "react-icons/fa";
import { getDocument } from "../../API.mjs";
import "./../css/documentpage.css";

const DocumentPage = ({ group, setFooterOption }) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    setFooterOption("Documents");
  }, []);

  const fetchDocuments = async () => {
    if (!group || !group.id) return;
    try {
      const documentData = await getDocument(group.id);
      setDocuments(documentData);
    } catch (err) {
      console.error("Error fetching documents:", err);
    }
  };

  useEffect(() => {
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

  return (
    <div className="document-page">
      <div className="group-card">
        <h2 className="group-card-title">{group.name}</h2>
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
                  <span className="document-meta">{group.name}</span>
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
