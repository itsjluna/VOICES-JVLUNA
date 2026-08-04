import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import { Winter, Spring, Summer, Autumn } from './SeasonBackgrounds';
import { SeasonDebris } from './SeasonDebris';
import Polaroid from './Polaroid';

function ChapterView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [poems, setPoems] = useState([]);
  const [quote, setQuote] = useState(null);
  const [postItColor, setPostItColor] = useState('#fdfd96');

  useEffect(() => {
    async function fetchData() {
      try {
        const [chapRes, poemRes] = await Promise.all([
          api.get('/chapters'),
          api.get(`/poems?chapterId=${id}`)
        ]);
        const found = chapRes.data.find(c => c._id === id);
        setChapter(found);
        setPoems(poemRes.data);
      } catch (err) {
        console.error(err);
      }
    }
    
    async function fetchQuote() {
      try {
        const res = await fetch('https://dummyjson.com/quotes/random');
        const data = await res.json();
        setQuote(data);
        
        // Pick random post-it color
        const colors = ['#fdfd96', '#ffb7b2', '#c1e1c1', '#b5ead7', '#e2f0cb'];
        setPostItColor(colors[Math.floor(Math.random() * colors.length)]);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
    fetchQuote();
  }, [id]);

  if (!chapter) return <div style={{ padding: '2rem' }}>Loading...</div>;

  const renderSeason = () => {
    switch (chapter?.theme) {
      case 'winter': return <Winter />;
      case 'spring': return <Spring />;
      case 'summer': return <Summer />;
      case 'autumn': return <Autumn />;
      default: return <Winter />; // Fallback to Winter
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
      style={{ flex: 1, padding: '2rem 0', position: 'relative' }}
    >
      {renderSeason()}
      <button style={{ marginBottom: '2rem', border: 'none', padding: '0', textDecoration: 'underline', position: 'relative', zIndex: 10 }} onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <div className="editorial-margin left">
        VOL. {id.slice(-4).toUpperCase()} — CHAPTER
      </div>


      <div className="book-layout">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="book-content"
          style={{ position: 'relative' }}
        >
          <SeasonDebris theme={chapter.theme} />
          <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', position: 'relative', zIndex: 10 }}>{chapter.title}</h1>
          
          {chapter.image && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.5 }}
              className="book-media"
              style={{ position: 'relative' }}
            >
              <Polaroid src={chapter.image} alt={chapter.title} containerStyle={{ margin: 0 }} />
              
              {quote && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                  animate={{ opacity: 1, scale: 1, rotate: -5 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="post-it"
                  style={{ background: postItColor }}
                >
                  <p>"{quote.quote}"</p>
                  <small>— {quote.author}</small>
                </motion.div>
              )}
            </motion.div>
          )}

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', letterSpacing: '0.05em', marginBottom: '1rem' }}>POEMS IN THIS CHAPTER</h3>
            <ul style={{ listStyle: 'none' }}>
              {poems.map((poem, index) => (
                <li key={poem._id} style={{ margin: '1rem 0' }}>
                  <Link to={`/poem/${poem._id}`} style={{ fontSize: '1.2rem' }}>
                    {index + 1}. {poem.title}
                  </Link>
                </li>
              ))}
              {poems.length === 0 && <p style={{ fontStyle: 'italic' }}>No poems yet.</p>}
            </ul>
          </div>
        </motion.div>
        <div style={{ clear: 'both' }}></div>
      </div>
    </motion.div>
  );
}

export default ChapterView;
