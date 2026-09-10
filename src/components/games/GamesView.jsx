import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import PageWrapper from '../PageWrapper';
import BackButton from '../BackButton';
import { TVModel } from './TVModel';
import { useLanguage } from '../../contexts/LanguageContext';

// MOCK GAMES DATA (Replace with API fetch later)
const MOCK_GAMES = [
  {
    id: 1,
    title: "Neon Echoes",
    description: "A fast-paced cyberpunk roguelite shooter where you dive into digital mainframes to extract corrupted corporate secrets.",
    genre: "Action / Roguelite",
    engine: "Godot 4",
    videoId: "dQw4w9WgXcQ" // Replace with real YouTube trailer ID
  },
  {
    id: 2,
    title: "Shadows of Aether",
    description: "A narrative-driven atmospheric platformer. Explore the ruins of a floating city and uncover the mystery of the fading magic.",
    genre: "Puzzle Platformer",
    engine: "Unity 3D",
    videoId: "jNQXAC9IVRw" // Replace with real YouTube trailer ID
  },
  {
    id: 3,
    title: "Project: PROTOCOL",
    description: "Tactical turn-based espionage game. Command a squad of elite hackers to infiltrate high-security networks undetected.",
    genre: "Turn-based Strategy",
    engine: "Unreal Engine 5",
    videoId: "ScMzIvxBSi4" // Replace with real YouTube trailer ID
  }
];

// Simple particle background using framer-motion
const BackgroundParticles = () => {
  const particles = Array.from({ length: 30 });
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
      {particles.map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: ['-10%', '110%'],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear'
          }}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: '-10%',
            width: '2px',
            height: `${Math.random() * 30 + 10}px`,
            background: 'var(--text-color)',
            boxShadow: '0 0 10px var(--text-color)'
          }}
        />
      ))}
    </div>
  );
};

export default function GamesView() {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeGame = MOCK_GAMES[activeIndex];

  const nextGame = () => setActiveIndex((p) => (p + 1) % MOCK_GAMES.length);
  const prevGame = () => setActiveIndex((p) => (p - 1 + MOCK_GAMES.length) % MOCK_GAMES.length);

  return (
    <PageWrapper style={{ minHeight: '100vh', background: '#050505', color: 'var(--text-color)' }}>
      <BackgroundParticles />
      <BackButton />

      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        maxWidth: '1400px', 
        margin: '0 auto', 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: '2rem',
        paddingTop: '6rem'
      }}>
        
        {/* Main Content Layout */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '2rem',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          
          {/* Left Side: Game Info */}
          <div style={{ flex: '1 1 400px', maxWidth: '600px' }}>
            <motion.div
              key={activeGame.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 style={{ fontSize: '4rem', fontFamily: 'var(--font-serif)', margin: '0 0 1rem 0', lineHeight: 1.1 }}>
                {activeGame.title}
              </h1>
              
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', fontFamily: 'monospace', opacity: 0.7 }}>
                <span style={{ padding: '0.2rem 0.5rem', border: '1px solid var(--text-color)', borderRadius: '4px' }}>
                  {activeGame.genre}
                </span>
                <span style={{ padding: '0.2rem 0.5rem', border: '1px solid var(--text-color)', borderRadius: '4px' }}>
                  {activeGame.engine}
                </span>
              </div>
              
              <p style={{ fontSize: '1.2rem', lineHeight: 1.6, opacity: 0.9, marginBottom: '2rem' }}>
                {activeGame.description}
              </p>

              {/* Carousel Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button 
                  onClick={prevGame}
                  style={{ background: 'none', border: '1px solid var(--text-color)', color: 'var(--text-color)', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
                >
                  <FaChevronLeft />
                </button>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {MOCK_GAMES.map((_, i) => (
                    <div 
                      key={i}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'var(--text-color)',
                        opacity: i === activeIndex ? 1 : 0.2,
                        transition: 'opacity 0.2s ease'
                      }}
                    />
                  ))}
                </div>
                <button 
                  onClick={nextGame}
                  style={{ background: 'none', border: '1px solid var(--text-color)', color: 'var(--text-color)', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
                >
                  <FaChevronRight />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Side: 3D TV Canvas */}
          <div style={{ flex: '1 1 400px', minHeight: '50vh', position: 'relative' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[10, 10, 5]} intensity={2} />
              <Suspense fallback={null}>
                <TVModel videoId={activeGame.videoId} />
                <Environment preset="studio" />
              </Suspense>
            </Canvas>
          </div>
          
        </div>
      </div>
    </PageWrapper>
  );
}