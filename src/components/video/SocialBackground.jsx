import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const GEN_Z_ITEMS = [
  "fr fr", "no cap", "slay", "valid", "literally", "bruh",
  "main character energy", "rent free", "sus", "periodt",
  "body so tea", "spill the tea", "i'm so delulu fr", 
  "i'm just like him fr", "bro thinks he's him", "she's just like me", 
  "girl like", "it's giving video", "lowkey cringe", "hear me out", 
  "btw means by the way btw", "fuck it we ball", "it's so over", 
  "in my flop era", "what is bro yapping about", "mejor mierda",
  "💀", "😭", "✨", "👀", "🔥", "💅", "🚩", "W", "L",
  "🥀", "🫠", "👄", "🙏", "💁‍♀️"
];

function FloatingItem({ item, isImage, delay, duration, startX, startY, endX, endY, scale }) {
  return (
    <motion.div
      initial={{ x: startX, y: startY, opacity: 0, scale }}
      animate={{ 
        x: endX, 
        y: endY, 
        opacity: [0, isImage ? 0.6 : 0.4, isImage ? 0.6 : 0.4, 0],
        rotate: [0, Math.random() * 20 - 10, Math.random() * -20 + 10, 0]
      }}
      transition={{ 
        duration, 
        repeat: Infinity, 
        delay,
        ease: "linear"
      }}
      style={{
        position: 'absolute',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        fontFamily: 'monospace',
        color: 'var(--text-color)',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        zIndex: 0
      }}
    >
      {isImage ? (
        <img 
          src={item} 
          alt="meme" 
          style={{ width: '150px', height: 'auto', borderRadius: '10px', filter: 'grayscale(30%)' }} 
        />
      ) : (
        item
      )}
    </motion.div>
  );
}

function SocialBackground() {
  const floatingItems = useMemo(() => {
    // Generate an array of random items with random paths
    return Array.from({ length: 45 }).map((_, i) => {
      const isMeme = Math.random() > 0.75; // 25% chance to be a meme image
      let item, isIcon, scale;
      
      if (isMeme) {
        const randomMemeIndex = Math.floor(Math.random() * 24) + 1; // memes 1 to 24
        item = `/socialmedia/meme${randomMemeIndex}.jpeg`;
        isIcon = false;
        scale = 0.6 + Math.random() * 0.4;
      } else {
        item = GEN_Z_ITEMS[Math.floor(Math.random() * GEN_Z_ITEMS.length)];
        isIcon = item.length <= 2; // Roughly check if it's an emoji
        scale = isIcon ? 1.5 + Math.random() * 1.5 : 0.8 + Math.random() * 1;
      }
      
      const startX = `${Math.random() * 100}vw`;
      const startY = `${100 + Math.random() * 20}vh`; // Start below screen
      const endX = `${Math.random() * 100}vw`;
      const endY = `-${20 + Math.random() * 20}vh`; // End above screen
      
      const duration = 15 + Math.random() * 20; // 15-35s
      const delay = Math.random() * 15; // 0-15s start delay
      
      return { id: i, item, isImage: isMeme, startX, startY, endX, endY, duration, delay, scale };
    });
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0
    }}>
      {floatingItems.map(config => (
        <FloatingItem key={config.id} {...config} />
      ))}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(circle at center, transparent 0%, var(--bg-color) 80%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />
    </div>
  );
}

export default SocialBackground;
