import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import { Winter, Spring, Summer, Autumn } from './SeasonBackgrounds';
import { SeasonDebris } from './SeasonDebris';
import Polaroid from './Polaroid';
import PostIt from './PostIt';
import CDJewelCase from './CDJewelCase';
import ScatteredItem from './ScatteredItem';

function ChapterView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [poems, setPoems] = useState([]);
  const [quoteReal, setQuoteReal] = useState(null);
  const [quoteFictional, setQuoteFictional] = useState(null);
  const [postItColor1, setPostItColor1] = useState('#fdfd96');
  const [postItColor2, setPostItColor2] = useState('#ffb7b2');
  const [albumDecoration, setAlbumDecoration] = useState(null);
  const [randomDecorations, setRandomDecorations] = useState([]);

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
          // Original
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
          { quote: "Keep your friends close, but your enemies closer.", author: "Michael Corleone" },
          // Comics
          { quote: "It's not who I am underneath, but what I do that defines me.", author: "Batman" },
          { quote: "Whatever happened to the American Dream? It came true. You're lookin' at it.", author: "The Comedian" },
          { quote: "I am Iron Man.", author: "Tony Stark" },
          { quote: "Avengers, assemble!", author: "Captain America" },
          { quote: "I can do this all day.", author: "Steve Rogers" },
          { quote: "We're not just our failures. As much as they hurt, we learn from them.", author: "Spider-Man" },
          // Videogames
          { quote: "War. War never changes.", author: "Fallout Narrator" },
          { quote: "It's dangerous to go alone! Take this.", author: "Old Man" },
          { quote: "Would you kindly...", author: "Atlas" },
          { quote: "I need a weapon.", author: "Master Chief" },
          { quote: "Boy.", author: "Kratos" },
          { quote: "Kept you waiting, huh?", author: "Solid Snake" },
          { quote: "We can't change what's done, we can only move on.", author: "Arthur Morgan" },
          { quote: "The cake is a lie.", author: "Ratman" },
          { quote: "Praise the sun!", author: "Solaire of Astora" },
          { quote: "Nothing is true, everything is permitted.", author: "Ezio Auditore" },
          { quote: "A man chooses, a slave obeys.", author: "Andrew Ryan" },
          { quote: "Stand in the ashes of a trillion dead souls and ask the ghosts if honor matters.", author: "Javik" },
          // Movies & Other
          { quote: "Get away from her, you b***h!", author: "Ellen Ripley" },
          { quote: "There is no spoon.", author: "Spoon Boy" },
          { quote: "You can't handle the truth!", author: "Col. Jessep" },
          { quote: "I drink your milkshake!", author: "Daniel Plainview" },
          { quote: "Elementary, my dear Watson.", author: "Sherlock Holmes" },
          { quote: "To boldly go where no man has gone before.", author: "James T. Kirk" }
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
          const blockedAuthors = [
            "bill cosby", "adolf hitler", "joseph stalin", "harvey weinstein", 
            "jeffrey epstein", "o.j. simpson", "r. kelly", "kevin spacey", 
            "woody allen", "chris brown", "roman polanski", "vladimir putin",
            "osama bin laden", "saddam hussein", "charles manson", "andrew tate"
          ];
          
          let validQuote = null;
          for (let i = 0; i < 3; i++) {
            const res = await fetch('https://dummyjson.com/quotes/random');
            const data = await res.json();
            
            const authorLower = data.author ? data.author.toLowerCase() : "";
            const isBlocked = blockedAuthors.some(b => authorLower.includes(b));
            
            if (!isBlocked) {
              validQuote = data;
              break;
            }
          }
          
          // Fallback if all 3 random quotes were blocked (highly unlikely)
          if (!validQuote) {
            validQuote = { quote: "To be, or not to be, that is the question.", author: "William Shakespeare" };
          }
          
          setQuoteReal(validQuote);
        }
        
        // Pick random post-it colors
        const colors = ['#fdfd96', '#ffb7b2', '#c1e1c1', '#b5ead7', '#e2f0cb'];
        setPostItColor1(colors[Math.floor(Math.random() * colors.length)]);
        setPostItColor2(colors[Math.floor(Math.random() * colors.length)]);

        // Fetch random album decoration
        try {
          const belovedArtists = [
            "Low Roar", "Imagine Dragons", "Chappell Roan", "Laufey", "Clairo", 
            "Bad Bunny", "K.Flay", "EMJAY", "Olivia Rodrigo", "Joey Valence & Brae", 
            "Tessa Ia", "Dafna", "Susanne Sundfør", "Doris Day", "Dagny", 
            "Taylor Swift", "Addison Rae", "Alice Phoebe Lou", "Kim Petras",
            "Charli XCX", "Sigrid", "Sabrina Carpenter", "Midnight Generation", 
            "Lady Gaga", "EVERGLOW", "TWICE", "AKRIILA", "Lana Del Rey", "Lorde", 
            "Griff", "Taichu", "RIXXIA", "Junior Varsity", "Magnolian", "BLACKPINK", "Six Sex"
          ];
          const randomArtist = belovedArtists[Math.floor(Math.random() * belovedArtists.length)];
          
          // Use a massive limit so we can safely filter out false positives before picking 3
          const itunesRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(randomArtist)}&entity=album&attribute=artistTerm&limit=50`);
          const itunesData = await itunesRes.json();
          if (itunesData.results && itunesData.results.length > 0) {
            // Strict case-sensitive match to perfectly isolate the correct artist
            const exactMatches = itunesData.results.filter(a => a.artistName === randomArtist);
            
            // Filter out remixes, live albums, karaoke, compilations, deluxe editions, and strictly reject Singles
            const cleanMatches = exactMatches.filter(a => {
              const name = a.collectionName ? a.collectionName.toLowerCase() : '';
              // Reject if it has 'single' in the name, or has 3 or fewer tracks (unless explicitly marked as an EP)
              const isSingle = name.includes('- single') || name.endsWith(' single') || (a.trackCount && a.trackCount <= 3 && !name.includes('ep'));
              
              // Reject compilations, deluxe editions, live, remixes, etc. to isolate MAIN albums
              const isNonMain = name.includes('remix') || 
                                name.includes('live') || 
                                name.includes('karaoke') || 
                                name.includes('instrumental') ||
                                name.includes('deluxe') ||
                                name.includes('bonus') ||
                                name.includes('tour edition') ||
                                name.includes('greatest hits') ||
                                name.includes('essential') ||
                                name.includes('anthology') ||
                                name.includes('the best of');
                                
              const isAlbumType = a.collectionType === 'Album';
              
              return !isSingle && !isNonMain && isAlbumType;
            });
            
            // Fallback to exactMatches if cleanMatches is empty
            const pool = cleanMatches.length > 0 ? cleanMatches : (exactMatches.length > 0 ? exactMatches : itunesData.results);
            
            // Shrink coincidences per artist to 5 for top popularity while maintaining variety
            const shrunkPool = pool.slice(0, 5);
            const randomAlbum = shrunkPool[Math.floor(Math.random() * shrunkPool.length)];
            
            // Fetch track list to get preview audio
            try {
              const tracksRes = await fetch(`https://itunes.apple.com/lookup?id=${randomAlbum.collectionId}&entity=song`);
              const tracksData = await tracksRes.json();
              const track = tracksData.results.find(t => t.wrapperType === 'track' && t.previewUrl);
              if (track) {
                randomAlbum.previewUrl = track.previewUrl;
              }
            } catch (e) {
              console.error("Failed to fetch album tracks for preview", e);
            }
            
            setAlbumDecoration(randomAlbum);
          }
        } catch (e) {
          console.error("Failed to fetch iTunes album", e);
        }

        // Generate random scattered decorations from uploaded PNGs and WEBPs
        const possibleDecorations = [
          'brioche.png', 'camera.png', 'cochinita.png', 'coffee.png', 
          'deathstranding.png', 'dualsense.png', 'glasses.png', 'inderalici.png', 
          'logitech.png', 'marvel.png', 'pen.png', 'pencil.png', 'rubik.png', 
          'slims.png', 'sw.png', 'taco.png', 'transformers.png', 'watch.png', 
          'whisky.png', 'wine.png', 'hummingbird.webp', 'magnolia.webp', 'origami.webp'
        ];
        
        const isDesktop = typeof window !== 'undefined' && window.innerWidth > 768;
        const numItems = Math.floor(Math.random() * 3) + 2; // Pick 2 to 4 items
        const selectedDecs = [];
        const availableDecs = [...possibleDecorations];
        for (let i = 0; i < numItems; i++) {
          if (availableDecs.length === 0) break;
          const idx = Math.floor(Math.random() * availableDecs.length);
          const item = availableDecs.splice(idx, 1)[0];
          
          const isTop = Math.random() > 0.5;
          const isLeft = Math.random() > 0.5;
          
          const maxSpread = isDesktop ? 400 : 140;
          const minSpread = isDesktop ? 120 : 70;
          
          const minSize = 70;
          const maxSize = isDesktop ? 260 : 150;
          
          selectedDecs.push({
            src: `/${item}`,
            top: isTop ? `${Math.floor(Math.random() * maxSpread) - minSpread}px` : 'auto',
            bottom: !isTop ? `${Math.floor(Math.random() * maxSpread) - minSpread}px` : 'auto',
            left: isLeft ? `${Math.floor(Math.random() * maxSpread) - minSpread}px` : 'auto',
            right: !isLeft ? `${Math.floor(Math.random() * maxSpread) - minSpread}px` : 'auto',
            rotate: Math.floor(Math.random() * 120) - 60,
            width: `${Math.floor(Math.random() * (maxSize - minSize)) + minSize}px`,
            zIndex: Math.floor(Math.random() * 8) + 1, // Behind or above elements
            delay: 1.5 + (Math.random() * 0.5)
          });
        }
        setRandomDecorations(selectedDecs);

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
          <h1 className="chapter-title">{chapter.title}</h1>
          
          {chapter.image && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.5 }}
              className="book-media"
              style={{ position: 'relative' }}
            >
              {albumDecoration && (
                <CDJewelCase
                  coverUrl={albumDecoration.artworkUrl100}
                  artist={albumDecoration.artistName}
                  albumName={albumDecoration.collectionName}
                  previewUrl={albumDecoration.previewUrl}
                  style={{ zIndex: 12, top: '-50px', left: '-70px', transform: 'rotate(-15deg)', width: '160px', height: '160px' }}
                  initialAnimation={{
                    initial: { opacity: 0, y: 50, rotate: -35 },
                    animate: { opacity: 1, y: 0, rotate: -15 },
                    transition: { delay: 1.0, duration: 0.6 }
                  }}
                />
              )}
              
              <Polaroid src={chapter.image} alt={chapter.title} containerStyle={{ margin: 0, position: 'relative', zIndex: 5 }} />
              
              <ScatteredItem 
                src="/earbuds.png" 
                alt="Earbuds Case"
                initialAnimation={{
                  initial: { opacity: 0, scale: 0.8, rotate: 25 },
                  animate: { opacity: 1, scale: 1, rotate: 25 },
                  transition: { delay: 1.6, duration: 0.5 }
                }}
                style={{ 
                  position: 'absolute', 
                  bottom: '-50px', 
                  right: '-80px', 
                  width: '140px', 
                  zIndex: 20
                }}
              />
              
              {randomDecorations.map((dec, idx) => (
                <ScatteredItem 
                  key={idx}
                  src={dec.src}
                  alt="Decoration"
                  initialAnimation={{
                    initial: { opacity: 0, scale: 0.8, rotate: dec.rotate },
                    animate: { opacity: 1, scale: 1, rotate: dec.rotate },
                    transition: { delay: dec.delay, duration: 0.5 }
                  }}
                  style={{ 
                    position: 'absolute', 
                    top: dec.top,
                    bottom: dec.bottom,
                    left: dec.left,
                    right: dec.right,
                    width: dec.width, 
                    zIndex: dec.zIndex
                  }}
                />
              ))}

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
