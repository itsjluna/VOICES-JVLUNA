import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaTrash, FaPen } from 'react-icons/fa';
import './Sketchpad.css';

export default function Sketchpad({ onClose }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#111111');
  const [brushSize, setBrushSize] = useState(5);

  const colors = [
    '#111111', '#ffffff', '#ef4444', '#f97316', '#eab308', 
    '#22c55e', '#3b82f6', '#a855f7', '#ec4899'
  ];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Prevent scrolling when drawing on touch devices
    const preventScroll = (e) => e.preventDefault();
    canvas.addEventListener('touchstart', preventScroll, { passive: false });
    canvas.addEventListener('touchmove', preventScroll, { passive: false });
    
    const handleResize = () => {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.putImageData(imgData, 0, 0);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      canvas.removeEventListener('touchstart', preventScroll);
      canvas.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getCoordinates = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    const { x, y } = getCoordinates(e.nativeEvent);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e.nativeEvent);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.closePath();
      setIsDrawing(false);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <motion.div 
      className="sketchpad-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <canvas
        ref={canvasRef}
        className="sketchpad-canvas"
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        onTouchCancel={stopDrawing}
      />
      
      <div className="sketchpad-toolbar">
        <div className="sketchpad-colors">
          {colors.map(c => (
            <button
              key={c}
              className={`sketchpad-color-btn ${color === c ? 'active' : ''}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
              title={c}
            />
          ))}
        </div>
        
        <div className="sketchpad-slider-container">
          <FaPen size={14} style={{ opacity: 0.7 }} />
          <input 
            type="range" 
            min="1" 
            max="50" 
            value={brushSize} 
            onChange={(e) => setBrushSize(parseInt(e.target.value))} 
          />
        </div>

        <button className="sketchpad-action-btn" onClick={clearCanvas} title="Clear Canvas">
          <FaTrash />
        </button>
      </div>

      <button className="sketchpad-close" onClick={onClose} title="Close Studio">
        <FaTimes size={20} />
      </button>
    </motion.div>
  );
}
