import React, { useEffect, useRef } from 'react';

const AmbientAudio = React.memo(({ src, volume = 0.1 }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0;
      audioRef.current.play().then(() => {
        let vol = 0;
        const fade = setInterval(() => {
          if (vol < volume) {
            vol += 0.01;
            if (vol > volume) vol = volume;
            if (audioRef.current) audioRef.current.volume = vol;
          } else {
            clearInterval(fade);
          }
        }, 100);
      }).catch(e => {
        console.log('Ambient audio autoplay prevented. It will play upon next interaction.', e);
        // Fallback: wait for next click to play
        const playOnClick = () => {
          if (audioRef.current) {
            audioRef.current.volume = volume;
            audioRef.current.play();
          }
          window.removeEventListener('click', playOnClick);
        };
        window.addEventListener('click', playOnClick);
      });
    }
  }, [src, volume]);

  return <audio ref={audioRef} src={src} loop style={{ display: 'none' }} />;
};

export default AmbientAudio;
