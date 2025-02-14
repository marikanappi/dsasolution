import React, { useState, useEffect } from "react";
import { FaFilePdf, FaFileWord, FaFileAlt, FaCloudDownloadAlt, FaArrowLeft, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getDocument, deleteMaterial } from "../../API.mjs";
import "./../css/documentpage.css";

const DocumentPage = ({ group, setFooterOption }) => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

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
        setDocuments(documentData || []);
      } catch (err) {
        console.error("Error fetching documents:", err);
        setDocuments([]);
      }
    };

    fetchDocuments();
  }, [group]);

  const handleOpenDocument = (url) => {
    window.open(url, "_blank");
  };

  const handleDownloadDocument = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = url.split("/").pop();
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Error downloading the document. Please try again.');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  

  const handleDeleteDocument = async (material_id) => {
    try {
      await deleteMaterial(material_id);
      setDocuments((prevDocuments) =>
        prevDocuments.filter((doc) => doc.material_id !== material_id)
      );
      setShowModal(false);
    } catch (err) {
      console.error("Error deleting document:", err);
    }
  };

  const handleConfirmDelete = (document) => {
    setDocumentToDelete(document);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="document-page">
      <div className="back-arrow" onClick={handleBack}>
        <FaArrowLeft size={25} />
      </div>

      <div className="group-card">
        <h2 className="group-card-title">Documents for {group?.name || "Group"}</h2>
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
                  className="download-icon-doc"
                  title="Download"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadDocument(document.name);
                  }}
                />
                <FaTrash
                  className="delete-icon-doc"
                  title="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConfirmDelete(document);
                  }}
                />
              </div>
            );
          })
        )}
      </div>

      {/* Modal per conferma eliminazione */}
      {showModal && (
        <div className="modal-delete-doc">
          <p>Are you sure you want to delete this document?</p>
          <div className="modal-buttons">
            <button className="btn btn-success" onClick={() => handleDeleteDocument(documentToDelete?.material_id)}>
              Yes
            </button>
            <button className="btn btn-danger" onClick={handleCloseModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentPage;
