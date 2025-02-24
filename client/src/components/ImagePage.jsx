import React, { useState, useEffect } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FaFolder, FaFolderOpen, FaArrowLeft, FaCloudDownloadAlt, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getImage, deleteMaterial } from "../../API.mjs";
import "./../css/imagepage.css";

const ImagePage = ({ group, setFooterOption }) => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const isAdmin = group.usercreate === 1; // Replace with actual admin check
  const [showModal, setShowModal] = useState(false);
  const [toBeDelete, setToBeDelete] = useState(null);
  useEffect(() => {
    if (setFooterOption) {
      setFooterOption("Images");
    }
  }, [setFooterOption]);

  const fetchImages = async () => {
    if (!group || !group.id) return;
    try {
      const imagesData = await getImage(group.id);
      console.log("imagesData", imagesData);
      setImages(imagesData || []);
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [group]);

  const handleImageError = (imageUrl) => {
    setImages((prevImages) => prevImages.filter((img) => img.name !== imageUrl));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleDownloadImage = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = imageUrl.split("/").pop();
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Error downloading the image. Please try again.');
    }
  };

  const handleDelete = async (material_id) => {
    try {
      await deleteMaterial(material_id);
      setImages((prevImages) => prevImages.filter((img) => img.material_id !== material_id));
    } catch (err) {
      console.error("Error deleting image:", err);
    }
    setShowModal(false);
  };

  return (
    <>
      <div className="back-arrow" onClick={handleBack}>
        <FaArrowLeft size={25} />
      </div>

      <div className="group-card">
        <h2 className="group-card-title">Images for {group.name}</h2>
      </div>

      <div className="images-page">
        <h1 className="page-title"></h1>

        <div className="images-grid">
          {images.length === 0 ? (
            <p >No images found.</p>
          ) : (
            images.map((image) => (
              <div key={image.material_id} className="image-card">
                <div className="image-container">
                  <img
                    src={image.name}
                    alt={image.name}
                    className="image-thumbnail"
                    onError={() => handleImageError(image.name)}
                  />
                  {isAdmin ? (
                    <div>
                  <FaCloudDownloadAlt
                    className="download-icon"
                    title="Download"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadImage(image.name);
                    }}
                  />
                  <FaTrash
                    className="delete-icon"
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowModal(true);
                      setToBeDelete(image.material_id)
                    }}
                  />
                  </div>
                  ) : (
                  <FaCloudDownloadAlt
                    className="download-icon"
                    title="Download"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadImage(image.name);
                    }}
                  />
                  )}
                </div>

                <div className="image-details">
                  <p>{image.name.split("/").pop()}</p>
                </div>
              </div>
            ))
          )}
        </div>
        {showModal && (
        <div className="modal">
        <div className="modal-content">
          <p className="text-left m-1">Are you sure you want to delete this image?</p>
          <div className="row-buttons-container">
            <button className="btn btn-success" onClick={() => handleDelete(toBeDelete)}>
              Yes
            </button>
            <button className="btn modal-button" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </div>
        </div>
      )}
      </div>
    </>
  );
};

export default ImagePage;