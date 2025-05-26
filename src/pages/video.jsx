import React from 'react';
import promoVideo from '../assets/images/Promocional.mp4';
import gokuImage from '../assets/images/goku.png';

const VideoConImagen = () => {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        padding: '20px',
        maxWidth: '650px',
        margin: '0 auto',
      }}
    >
      <video
        src={promoVideo}
        controls
        style={{
          maxWidth: '600px',
          width: '100%',
          height: 'auto',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          display: 'block',
        }}
      >
        Tu navegador no soporta la reproducción de video.
      </video>
      <img
        src={gokuImage}
        alt="Goku"
        style={{
          position: 'absolute',
          top: '100px',    // bajado más
          left: '-90px',
          maxWidth: '150px',
          borderRadius: '8px',
        }}
      />
    </div>
  );
};

export default VideoConImagen;
