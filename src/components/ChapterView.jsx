import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import { Winter, Spring, Summer, Autumn } from './SeasonBackgrounds';
import { SeasonDebris } from './SeasonDebris';
import Polaroid from './Polaroid';
import PostIt from './PostIt';
import CDJewelCase from './CDJewelCase';
import ScatteredItem from './ScatteredItem';
import AmbientAudio from './AmbientAudio';
import { useLanguage } from '../contexts/LanguageContext';
import TypewriterLoader from './TypewriterLoader';

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
  const { language } = useLanguage();

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
          { quoteEn: "Do, or do not. There is no try.", quoteEs: "Hazlo, o no lo hagas. Pero no lo intentes.", author: "Yoda" },
          { quoteEn: "I'm not bad. I'm just drawn that way.", quoteEs: "No soy mala, es que me han dibujado así.", author: "Jessica Rabbit" },
          { quoteEn: "To infinity, and beyond!", quoteEs: "¡Al infinito, y más allá!", author: "Buzz Lightyear" },
          { quoteEn: "I solemnly swear that I am up to no good.", quoteEs: "Juro solemnemente que mis intenciones no son buenas.", author: "Harry Potter" },
          { quoteEn: "Just keep swimming.", quoteEs: "Sigue nadando.", author: "Dory" },
          { quoteEn: "You shall not pass!", quoteEs: "¡No puedes pasar!", author: "Gandalf" },
          { quoteEn: "Why so serious?", quoteEs: "¿Por qué tan serio?", author: "The Joker" },
          { quoteEn: "With great power comes great responsibility.", quoteEs: "Un gran poder conlleva una gran responsabilidad.", author: "Uncle Ben" },
          { quoteEn: "Winter is coming.", quoteEs: "El invierno se acerca.", author: "Ned Stark" },
          { quoteEn: "Hello, friend.", quoteEs: "Hola, amigo.", author: "Elliot Alderson" },
          { quoteEn: "I am Groot.", quoteEs: "Yo soy Groot.", author: "Groot" },
          { quoteEn: "I have a bad feeling about this.", quoteEs: "Tengo un mal presentimiento sobre esto.", author: "Han Solo" },
          { quoteEn: "I see dead people.", quoteEs: "Veo gente muerta.", author: "Cole Sear" },
          { quoteEn: "There's no place like home.", quoteEs: "No hay lugar como el hogar.", author: "Dorothy Gale" },
          { quoteEn: "E.T. phone home.", quoteEs: "E.T. llamar a casa.", author: "E.T." },
          { quoteEn: "May the Force be with you.", quoteEs: "Que la Fuerza te acompañe.", author: "Obi-Wan Kenobi" },
          { quoteEn: "I am your father.", quoteEs: "Yo soy tu padre.", author: "Darth Vader" },
          { quoteEn: "It's alive! It's alive!", quoteEs: "¡Está vivo! ¡Está vivo!", author: "Henry Frankenstein" },
          { quoteEn: "Here's Johnny!", quoteEs: "¡Aquí está Johnny!", author: "Jack Torrance" },
          { quoteEn: "Hasta la vista, baby.", quoteEs: "Hasta la vista, baby.", author: "The Terminator" },
          { quoteEn: "My precious.", quoteEs: "Mi tesoro.", author: "Gollum" },
          { quoteEn: "Life is like a box of chocolates.", quoteEs: "La vida es como una caja de bombones.", author: "Forrest Gump" },
          { quoteEn: "I'm the king of the world!", quoteEs: "¡Soy el rey del mundo!", author: "Jack Dawson" },
          { quoteEn: "Wakanda Forever!", quoteEs: "¡Wakanda por siempre!", author: "Black Panther" },
          { quoteEn: "Keep your friends close, but your enemies closer.", quoteEs: "Mantén a tus amigos cerca, pero a tus enemigos más cerca.", author: "Michael Corleone" },
          // Comics
          { quoteEn: "It's not who I am underneath, but what I do that defines me.", quoteEs: "No es quien soy debajo, sino lo que hago lo que me define.", author: "Batman" },
          { quoteEn: "Whatever happened to the American Dream? It came true. You're lookin' at it.", quoteEs: "¿Qué le pasó al Sueño Americano? Se hizo realidad. Lo estás mirando.", author: "The Comedian" },
          { quoteEn: "I am Iron Man.", quoteEs: "Yo soy Iron Man.", author: "Tony Stark" },
          { quoteEn: "Avengers, assemble!", quoteEs: "¡Vengadores, reúnanse!", author: "Captain America" },
          { quoteEn: "I can do this all day.", quoteEs: "Podría hacer esto todo el día.", author: "Steve Rogers" },
          { quoteEn: "We're not just our failures. As much as they hurt, we learn from them.", quoteEs: "No somos solo nuestros fracasos. Por mucho que duelan, aprendemos de ellos.", author: "Spider-Man" },
          // Videogames
          { quoteEn: "War. War never changes.", quoteEs: "La guerra. La guerra nunca cambia.", author: "Fallout Narrator" },
          { quoteEn: "It's dangerous to go alone! Take this.", quoteEs: "¡Es peligroso ir solo! Toma esto.", author: "Old Man" },
          { quoteEn: "Would you kindly...", quoteEs: "Serías tan amable...", author: "Atlas" },
          { quoteEn: "I need a weapon.", quoteEs: "Necesito un arma.", author: "Master Chief" },
          { quoteEn: "Boy.", quoteEs: "Chico.", author: "Kratos" },
          { quoteEn: "Kept you waiting, huh?", quoteEs: "Te hice esperar, ¿eh?", author: "Solid Snake" },
          { quoteEn: "We can't change what's done, we can only move on.", quoteEs: "No podemos cambiar lo que está hecho, solo podemos seguir adelante.", author: "Arthur Morgan" },
          { quoteEn: "The cake is a lie.", quoteEs: "El pastel es una mentira.", author: "Ratman" },
          { quoteEn: "Praise the sun!", quoteEs: "¡Alabado sea el sol!", author: "Solaire of Astora" },
          { quoteEn: "Nothing is true, everything is permitted.", quoteEs: "Nada es verdad, todo está permitido.", author: "Ezio Auditore" },
          { quoteEn: "A man chooses, a slave obeys.", quoteEs: "Un hombre elige, un esclavo obedece.", author: "Andrew Ryan" },
          { quoteEn: "Stand in the ashes of a trillion dead souls and ask the ghosts if honor matters.", quoteEs: "Párate en las cenizas de un billón de almas muertas y pregúntale a los fantasmas si el honor importa.", author: "Javik" },
          // Movies & Other
          { quoteEn: "Get away from her, you b***h!", quoteEs: "¡Aléjate de ella, perra!", author: "Ellen Ripley" },
          { quoteEn: "There is no spoon.", quoteEs: "No hay cuchara.", author: "Spoon Boy" },
          { quoteEn: "You can't handle the truth!", quoteEs: "¡No puedes soportar la verdad!", author: "Col. Jessep" },
          { quoteEn: "I drink your milkshake!", quoteEs: "¡Me bebo tu batido!", author: "Daniel Plainview" },
          { quoteEn: "Elementary, my dear Watson.", quoteEs: "Elemental, mi querido Watson.", author: "Sherlock Holmes" },
          { quoteEn: "To boldly go where no man has gone before.", quoteEs: "Audazmente ir a donde ningún hombre ha ido antes.", author: "James T. Kirk" }
        ];

        setQuoteFictional(popQuotes[Math.floor(Math.random() * popQuotes.length)]);

        if (Math.random() > 0.3) {
          const kojimaQuotes = [
            { quoteEn: "Building the future and keeping the past alive are one and the same thing.", quoteEs: "Construir el futuro y mantener vivo el pasado son la misma cosa.", author: "Hideo Kojima" },
            { quoteEn: "Half of me is made of movies.", quoteEs: "El setenta por ciento de mi cuerpo está hecho de películas.", author: "Hideo Kojima" },
            { quoteEn: "Games shouldn't just be fun. They should teach or spark an interest in other things.", quoteEs: "Los juegos no solo deberían ser divertidos. Deberían enseñar o despertar un interés en otras cosas.", author: "Hideo Kojima" },
            { quoteEn: "I want to create things that people will remember forever.", quoteEs: "Quiero crear cosas que la gente recuerde para siempre.", author: "Hideo Kojima" }
          ];
          setQuoteReal(kojimaQuotes[Math.floor(Math.random() * kojimaQuotes.length)]);
        } else {
          // Use more hardcoded dual-language quotes instead of english-only dummyjson
          const realQuotes = [
            { quoteEn: "To be, or not to be, that is the question.", quoteEs: "Ser o no ser, esa es la cuestión.", author: "William Shakespeare" },
            { quoteEn: "I think, therefore I am.", quoteEs: "Pienso, luego existo.", author: "René Descartes" },
            { quoteEn: "The only thing we have to fear is fear itself.", quoteEs: "Lo único que debemos temer es al miedo mismo.", author: "Franklin D. Roosevelt" },
            { quoteEn: "That's one small step for a man, one giant leap for mankind.", quoteEs: "Es un pequeño paso para un hombre, un gran salto para la humanidad.", author: "Neil Armstrong" }
          ];
          
          setQuoteReal(realQuotes[Math.floor(Math.random() * realQuotes.length)]);
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
            "Griff", "Taichu", "RIXXIA", "Junior Varsity", "Magnolian", "BLACKPINK", "Six Sex", "UPSAHL"
          ];
          const randomArtist = belovedArtists[Math.floor(Math.random() * belovedArtists.length)];
          
          // Use a massive limit so we can safely filter out false positives before picking 3
          const itunesRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(randomArtist)}&entity=album&attribute=artistTerm&limit=50`);
          const itunesData = await itunesRes.json();
          if (itunesData.results && itunesData.results.length > 0) {
            
            // 1. Filter ALL results to remove hard-blocked items universally
            const universallySafeResults = itunesData.results.filter(a => {
              const name = a.collectionName ? a.collectionName.toLowerCase() : '';
              const isBlockedChappell = a.artistName === 'Chappell Roan' && (name.includes('school nights') || name.includes('good hurt'));
              const isBlockedBadBunny = a.artistName === 'Bad Bunny' && name.includes('super bowl');
              
              const isAllowedUpsahl = a.artistName === 'UPSAHL' && name.includes('i like it');
              const isSingle = !isAllowedUpsahl && name.includes('single'); // More aggressive catch-all
              const isGarbage = name.includes('karaoke') || name.includes('instrumental') || name.includes('tribute') || name.includes('cover');
              
              return !isBlockedChappell && !isBlockedBadBunny && !isSingle && !isGarbage;
            });

            // 2. Try to get exact artist matches (strict case-sensitive equal to prevent collisions like EmJay vs EMJAY)
            const exactMatches = universallySafeResults.filter(a => a.artistName === randomArtist);
            
            // 3. Try to get "clean" main albums (no deluxe, remixes, live, etc.)
            const cleanMatches = exactMatches.filter(a => {
              const name = a.collectionName ? a.collectionName.toLowerCase() : '';
              const isAllowedUpsahl = a.artistName === 'UPSAHL' && name.includes('i like it');
              const isSmall = !isAllowedUpsahl && (a.trackCount && a.trackCount <= 3 && !name.includes('ep'));
              const isAltVersion = name.includes('remix') || 
                                   name.includes('live') || 
                                   name.includes('deluxe') || 
                                   name.includes('bonus') || 
                                   name.includes('tour edition') || 
                                   name.includes('greatest hits') || 
                                   name.includes('essential') || 
                                   name.includes('anthology') || 
                                   name.includes('the best of');
              const isAlbumType = a.collectionType === 'Album';
              
              return !isSmall && !isAltVersion && isAlbumType;
            });

            // 4. Fallback chain
            let pool = cleanMatches;
            if (pool.length === 0) pool = exactMatches;
            // Removed fallback to universallySafeResults because if exactMatches is empty, 
            // the remaining results belong to completely unrelated artists (like Yangnara).
            
            if (pool.length > 0) {
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
          }
        } catch (e) {
          console.error("Failed to fetch iTunes album", e);
        }

        const possibleDecorations = [
          'brioche.png', 'camera.png', 'cochinita.png', 'coffee.png', 
          'deathstranding.png', 'dualsense.png', 'glasses.png', 'inderalici.png', 
          'logitech.png', 'marvel.png', 'pen.png', 'pencil.png', 'pepsi.png', 'rubik.png', 
          'slims.png', 'sw.png', 'transformers.png', 'watch.png', 
          'whisky.png', 'wine.png', 'hummingbird.webp', 'magnolia.webp', 'origami.webp',
          'pulparindo.png', 'lgbtflag.png', 'munecalele.png', 'vynilplayer.png', 'mazapan.png'
        ];
        
        const decorationMeta = {
          'brioche.png': { titleEn: 'Sweet Brioche', titleEs: 'Pan Brioche', descEn: 'Soft bread for the morning.', descEs: 'Pan suave para la mañana.' },
          'camera.png': { titleEn: 'Sony DSC-V1', titleEs: 'Sony DSC-V1', descEn: 'Vintage digital camera.', descEs: 'Cámara digital antigua.' },
          'cochinita.png': { titleEn: 'Taco de Cochinita', titleEs: 'Taco de Cochinita', descEn: 'Cochinita pibil from Yucatan.', descEs: 'Cochinita pibil de Yucatán.' },
          'coffee.png': { titleEn: 'Black Coffee', titleEs: 'Café Negro', descEn: 'Roasted morning brew.', descEs: 'Café tostado de la mañana.' },
          'deathstranding.png': { titleEn: 'Death Stranding', titleEs: 'Death Stranding', descEn: 'A physical copy of the game.', descEs: 'Copia física del juego.' },
          'dualsense.png': { titleEn: 'DualSense', titleEs: 'DualSense', descEn: 'Textured white plastic.', descEs: 'Plástico blanco texturizado.' },
          'glasses.png': { titleEn: 'Reading Glasses', titleEs: 'Gafas de Lectura', descEn: 'Tortoiseshell frames.', descEs: 'Armazones de carey.' },
          'inderalici.png': { titleEn: 'Inderalici', titleEs: 'Inderalici', descEn: 'Small white tablets.', descEs: 'Pequeñas tabletas blancas.' },
          'logitech.png': { titleEn: 'G733 K/DA Edition', titleEs: 'G733 K/DA Edition', descEn: 'Wireless gaming headset.', descEs: 'Auriculares inalámbricos.' },
          'marvel.png': { titleEn: 'Captain Marvel', titleEs: 'Capitana Marvel', descEn: 'Action figure.', descEs: 'Figura de acción.' },
          'pen.png': { titleEn: 'Zebra Pen', titleEs: 'Zebra Pen', descEn: 'Steel ballpoint ink.', descEs: 'Tinta de bolígrafo de acero.' },
          'pencil.png': { titleEn: 'Apple Pencil', titleEs: 'Apple Pencil', descEn: 'White digital stylus.', descEs: 'Lápiz digital blanco.' },
          'pepsi.png': { titleEn: 'Diet Pepsi', titleEs: 'Pepsi Light', descEn: 'Diet Pepsi 0 cal.', descEs: 'Diet Pepsi 0 cal.' },
          'rubik.png': { titleEn: 'Rubik\'s Cube', titleEs: 'Cubo Rubik', descEn: 'Colored plastic squares.', descEs: 'Cuadrados de plástico de colores.' },
          'slims.png': { titleEn: 'China Superslims', titleEs: 'China Superslims', descEn: 'Thin white cigarettes.', descEs: 'Cigarrillos delgados y blancos.' },
          'sw.png': { titleEn: 'Rey', titleEs: 'Rey', descEn: 'Star Wars figure.', descEs: 'Figura de Star Wars.' },
          'transformers.png': { titleEn: 'Autobot Emblem', titleEs: 'Emblema Autobot', descEn: 'Die-cast metal badge.', descEs: 'Insignia de metal fundido.' },
          'watch.png': { titleEn: 'CMF Watch Pro', titleEs: 'CMF Watch Pro', descEn: 'Digital smartwatch.', descEs: 'Reloj inteligente digital.' },
          'whisky.png': { titleEn: 'Aged Whisky', titleEs: 'Whisky Añejo', descEn: 'Amber liquid on ice.', descEs: 'Líquido ámbar en hielo.' },
          'wine.png': { titleEn: 'Rosé Wine', titleEs: 'Vino Rosado', descEn: 'Light pink glass.', descEs: 'Copa color rosa claro.' },
          'hummingbird.webp': { titleEn: 'Hummingbird', titleEs: 'Colibrí', descEn: 'Iridescent green feathers.', descEs: 'Plumas verdes iridiscentes.' },
          'magnolia.webp': { titleEn: 'Magnolia', titleEs: 'Magnolia', descEn: 'Smooth white petals.', descEs: 'Pétalos blancos suaves.' },
          'origami.webp': { titleEn: 'Origami Bunny', titleEs: 'Conejito de Origami', descEn: 'Folded paper edges.', descEs: 'Bordes de papel doblado.' },
          'pulparindo.png': { titleEn: 'Pulparindo', titleEs: 'Pulparindo', descEn: 'Tamarind candy.', descEs: 'Dulce de tamarindo.' },
          'lgbtflag.png': { titleEn: 'Pride Flag', titleEs: 'Bandera del Orgullo', descEn: 'Colored fabric.', descEs: 'Tela de colores.' },
          'munecalele.png': { titleEn: 'Muñeca Lele', titleEs: 'Muñeca Lele', descEn: 'Traditional rag doll.', descEs: 'Muñeca de trapo tradicional.' },
          'vynilplayer.png': { titleEn: 'Record Player', titleEs: 'Tocadiscos', descEn: 'Turntable and needle.', descEs: 'Plato y aguja.' },
          'mazapan.png': { titleEn: 'De la Rosa Mazapán', titleEs: 'Mazapán de la Rosa', descEn: 'Peanut confection.', descEs: 'Dulce de cacahuate.' }
        };

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
            titleEn: decorationMeta[item]?.titleEn,
            titleEs: decorationMeta[item]?.titleEs,
            descEn: decorationMeta[item]?.descEn,
            descEs: decorationMeta[item]?.descEs,
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

  if (!chapter) return <TypewriterLoader text={language === 'EN' ? 'Opening chapter...' : 'Abriendo capítulo...'} />;

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
      <AmbientAudio src={`/${chapter?.theme || 'spring'}-ambient.mp3`} volume={0.03} />
      {renderSeason()}
      <button style={{ marginBottom: '2rem', border: 'none', padding: '0', textDecoration: 'underline', position: 'relative', zIndex: 10 }} onClick={() => navigate(-1)}>
        &larr; {language === 'EN' ? 'Back' : 'Volver'}
      </button>

      <div className="editorial-margin left">
        VOL. {id.slice(-4).toUpperCase()} — {language === 'EN' ? 'CHAPTER' : 'CAPÍTULO'}
      </div>


      <div className="book-layout">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="book-content"
          style={{ position: 'relative' }}
        >
          <SeasonDebris theme={chapter.theme} />
          <h1 className="chapter-title">{language === 'EN' && chapter.titleEn ? chapter.titleEn : chapter.title}</h1>
          
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
                alt="Nothing Ear"
                title="Nothing Ear"
                description={language === 'EN' ? "Transparent wireless audio." : "Audio inalámbrico transparente."}
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
                  alt={(language === 'EN' ? dec.titleEn : dec.titleEs) || "Decoration"}
                  title={language === 'EN' ? dec.titleEn : dec.titleEs}
                  description={language === 'EN' ? dec.descEn : dec.descEs}
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
                  quote={language === 'EN' && quoteReal.quoteEn ? quoteReal.quoteEn : (quoteReal.quoteEs || quoteReal.quoteEn)}
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
                  quote={language === 'EN' && quoteFictional.quoteEn ? quoteFictional.quoteEn : (quoteFictional.quoteEs || quoteFictional.quoteEn)}
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

          <div className="glass-panel" style={{ marginTop: '3rem' }}>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', letterSpacing: '0.05em', marginBottom: '1.5rem', opacity: 0.8 }}>
              {language === 'EN' ? 'IN THIS CHAPTER' : 'EN ESTE CAPÍTULO'}
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {poems.map((poem, index) => (
                <li key={poem._id} style={{ margin: '0' }}>
                  <Link 
                    to={`/poem/${poem._id}`} 
                    onMouseEnter={() => api.get(`/poems/${poem._id}`)}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem',
                      fontSize: '1.2rem', 
                      textDecoration: 'none', 
                      transition: 'background 0.2s, transform 0.2s',
                      borderRadius: '8px',
                      color: 'inherit'
                    }}
                    className="chapter-list-item"
                  >
                    <div>
                      <span style={{ opacity: 0.5, marginRight: '1rem', fontFamily: 'monospace' }}>
                        {String(index + 1).padStart(2, '0')}.
                      </span>
                      {language === 'EN' && poem.titleEn ? poem.titleEn : poem.title}
                    </div>
                    <span style={{ opacity: 0.3 }}>&rarr;</span>
                  </Link>
                </li>
              ))}
              {poems.length === 0 && <p style={{ fontStyle: 'italic', opacity: 0.6 }}>{language === 'EN' ? 'No poems yet.' : 'Aún no hay poemas.'}</p>}
            </ul>
          </div>
        </motion.div>
        <div style={{ clear: 'both' }}></div>
      </div>
    </motion.div>
  );
}

export default ChapterView;
