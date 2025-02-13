import React from "react";

const AudioPage = ({ group, audio = [] }) => {
  return (
    <>
      <div className="group-card">
        <h2 className="group-card-title">{group.name}</h2>
      </div>

      <div className="audio-page">
       

        <div className="audio-grid">
          {audio.length === 0 ? (
            <p>No audio files found.</p>
          ) : (
            audio.map((audioFile) => (
              <div key={audioFile.material_id} className="audio-card">
                <audio controls>
                  <source src={`http://localhost:3001/uploads/${audioFile.name}`} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <div className="audio-details">
                  <p>{audioFile.name}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default AudioPage;
