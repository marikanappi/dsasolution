import React, { useState, useEffect } from "react"; 
import { AiOutlineCloudUpload } from "react-icons/ai"; 
import { FaFolder, FaFolderOpen } from "react-icons/fa"; 
import { getImage } from "../../API.mjs"; 
import "./../css/imagepage.css";  
 
const ImagePage = ({ group, setFooterOption }) => { 
  const [images, setImages] = useState([]); 
 
  useEffect(() => { 
    setFooterOption("Images"); 
  }, []); 
 
  // Funzione per recuperare le immagini 
  const fetchImages = async () => { 
    if (!group || !group.id) return; // Controllo se il gruppo esiste 
    try { 
      const imagesData = await getImage(group.id); 
      console.log("imagesData", imagesData); 
      setImages(imagesData); 
    } catch (err) { 
      console.error("Error fetching images:", err); 
    } 
  }; 
 
  useEffect(() => { 
    fetchImages(); 
  }, [group]); // Chiamata ogni volta che il gruppo cambia 

  const handleImageError = (imageUrl) => {
    setImages((prevImages) => prevImages.filter((img) => img.name !== imageUrl));
  };
 
  return (
    <>
      <div className="group-card">
        <h2 className="group-card-title">{group.name}</h2>
      </div>
      <div className="images-page">
        <h1 className="page-title"></h1>
  
        <div className="images-grid">
          {images.length === 0 ? (
            <p>No images found.</p>
          ) : (
            images.map((image) => (
              <div key={image.material_id} className="image-card">
                <img
                  src={image.name}
                  alt={image.name}
                  className="image-thumbnail"
                  onError={() => handleImageError(image.name)}
                />
                <div className="image-details">
                  <p></p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
  
}; 
 
export default ImagePage;