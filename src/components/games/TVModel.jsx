import React from 'react';
import { useGLTF, Html, Center, PresentationControls } from '@react-three/drei';

export function TVModel({ videoId }) {
  // Load the GLB model from the public media folder
  const { scene } = useGLTF('/media/70_tv.glb');

  return (
    <PresentationControls
      global
      config={{ mass: 2, tension: 500 }}
      snap={{ mass: 4, tension: 1500 }}
      rotation={[0, 0, 0]}
      polar={[-Math.PI / 3, Math.PI / 3]}
      azimuth={[-Math.PI / 1.4, Math.PI / 2]}
    >
      <Center>
        <primitive object={scene} scale={1.5} />
        
        {/* CSS3D HTML embed for YouTube Video */}
        {/* 
          IMPORTANT: The position and rotation below are estimates.
          You may need to tweak these numbers [x, y, z] to perfectly 
          align the iframe with the TV's screen bezel.
        */}
        <Html
          transform
          wrapperClass="tv-screen-wrapper"
          position={[0, 0.2, 0.4]} // Adjust Z and Y to align perfectly
          rotation={[0, 0, 0]}
          scale={0.1}
        >
          <div style={{
            width: '480px',
            height: '360px',
            background: '#000',
            overflow: 'hidden',
            borderRadius: '4px',
            pointerEvents: 'auto'
          }}>
            {videoId ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&modestbranding=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title="Game Trailer"
                style={{ border: 'none' }}
              />
            ) : (
              <div style={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontFamily: 'monospace' }}>NO SIGNAL</div>
            )}
          </div>
        </Html>
      </Center>
    </PresentationControls>
  );
}

// Preload the model
useGLTF.preload('/media/70_tv.glb');