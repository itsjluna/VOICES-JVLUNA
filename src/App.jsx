import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import DockNav from './components/DockNav';
import CustomCursor from './components/CustomCursor';
import TypewriterLoader from './components/TypewriterLoader';
import PageTransition from './components/PageTransition';
import FlashlightOverlay from './components/FlashlightOverlay';

const WelcomeScreen = lazy(() => import('./components/WelcomeScreen'));
const IndexView = lazy(() => import('./components/IndexView'));
const ChapterView = lazy(() => import('./components/ChapterView'));
const PoemView = lazy(() => import('./components/PoemView'));
const IntermissionView = lazy(() => import('./components/IntermissionView'));
const VentView = lazy(() => import('./components/VentView'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><WelcomeScreen /></PageTransition>} />
        <Route path="/index" element={<PageTransition><IndexView /></PageTransition>} />
        <Route path="/chapter/:id" element={<PageTransition><ChapterView /></PageTransition>} />
        <Route path="/intermission/:id" element={<PageTransition><IntermissionView /></PageTransition>} />
        <Route path="/vent/:id" element={<PageTransition><VentView /></PageTransition>} />
        <Route path="/poem/:id" element={<PageTransition><PoemView /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <CustomCursor />
      <FlashlightOverlay />
      <DockNav />
      <div className="container">
        <Suspense fallback={<TypewriterLoader />}>
          <AnimatedRoutes />
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
