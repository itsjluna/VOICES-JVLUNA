import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import { Winter, Spring, Summer, Autumn } from './SeasonBackgrounds';
import { SeasonDebris } from './SeasonDebris';
import Polaroid from './Polaroid';
import PostIt from './PostIt';

function ChapterView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [poems, setPoems] = useState([]);
  const [quoteReal, setQuoteReal] = useState(null);
  const [quoteFictional, setQuoteFictional] = useState(null);
  const [postItColor1, setPostItColor1] = useState('#fdfd96');
  const [postItColor2, setPostItColor2] = useState('#ffb7b2');

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
    
    async function fetchQuotes() {
      try {
        const popQuotes = [
          { quote: "Do, or do not. There is no try.", author: "Yoda" },
          { quote: "I'm not bad. I'm just drawn that way.", author: "Jessica Rabbit" },
          { quote: "To infinity, and beyond!", author: "Buzz Lightyear" },
          { quote: "I solemnly swear that I am up to no good.", author: "Harry Potter" },
          { quote: "Just keep swimming.", author: "Dory" },
          { quote: "You shall not pass!", author: "Gandalf" },
          { quote: "Why so serious?", author: "The Joker" },
          { quote: "With great power comes great responsibility.", author: "Uncle Ben" },
          { quote: "Winter is coming.", author: "Ned Stark" },
          { quote: "Hello, friend.", author: "Elliot Alderson" },
          { quote: "I am Groot.", author: "Groot" },
          { quote: "I have a bad feeling about this.", author: "Han Solo" },
          { quote: "I see dead people.", author: "Cole Sear" },
          { quote: "There's no place like home.", author: "Dorothy Gale" },
          { quote: "E.T. phone home.", author: "E.T." },
          { quote: "May the Force be with you.", author: "Obi-Wan Kenobi" },
          { quote: "I am your father.", author: "Darth Vader" },
          { quote: "It's alive! It's alive!", author: "Henry Frankenstein" },
          { quote: "Here's Johnny!", author: "Jack Torrance" },
          { quote: "Hasta la vista, baby.", author: "The Terminator" },
          { quote: "My precious.", author: "Gollum" },
          { quote: "Life is like a box of chocolates.", author: "Forrest Gump" },
          { quote: "I'm the king of the world!", author: "Jack Dawson" },
          { quote: "Wakanda Forever!", author: "Black Panther" },
          { quote: "Keep your friends close, but your enemies closer.", author: "Michael Corleone" }
        ];

        setQuoteFictional(popQuotes[Math.floor(Math.random() * popQuotes.length)]);

        if (Math.random() > 0.7) {
          const kojimaQuotes = [
            { quote: "Building the future and keeping the past alive are one and the same thing.", author: "Hideo Kojima" },
            { quote: "Half of me is made of movies.", author: "Hideo Kojima" },
            { quote: "Games shouldn't just be fun. They should teach or spark an interest in other things.", author: "Hideo Kojima" },
            { quote: "I want to create things that people will remember forever.", author: "Hideo Kojima" }
          ];
          setQuoteReal(kojimaQuotes[Math.floor(Math.random() * kojimaQuotes.length)]);
        } else {
          const res = await fetch('https://dummyjson.com/quotes/random');
          const data = await res.json();
          setQuoteReal(data);
        }
        
        // Pick random post-it colors
        const colors = ['#fdfd96', '#ffb7b2', '#c1e1c1', '#b5ead7', '#e2f0cb'];
        setPostItColor1(colors[Math.floor(Math.random() * colors.length)]);
        setPostItColor2(colors[Math.floor(Math.random() * colors.length)]);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
    fetchQuotes();
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
              
              {quoteReal && (
                <PostIt 
                  quote={quoteReal.quote}
                  author={quoteReal.author}
                  color={postItColor1}
                  style={{ zIndex: 5 }}
                  initialAnimation={{
                    initial: { opacity: 0, scale: 0.8, rotate: 10, y: 0 },
                    animate: { opacity: 1, scale: 1, rotate: -5, y: -20 },
                    transition: { delay: 1.2, duration: 0.5 }
                  }}
                />
              )}
              {quoteFictional && (
                <PostIt 
                  quote={quoteFictional.quote}
                  author={quoteFictional.author}
                  color={postItColor2}
                  style={{ zIndex: 6 }}
                  initialAnimation={{
                    initial: { opacity: 0, scale: 0.8, rotate: -10, y: 0, x: 0 },
                    animate: { opacity: 1, scale: 1, rotate: 8, y: 80, x: -40 },
                    transition: { delay: 1.4, duration: 0.5 }
                  }}
                />
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
