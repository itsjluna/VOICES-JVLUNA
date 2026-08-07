import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import DockNav from './components/DockNav';
import CustomCursor from './components/CustomCursor';
import TypewriterLoader from './components/TypewriterLoader';
import FlashlightOverlay from './components/FlashlightOverlay';

import WelcomeScreen from './components/WelcomeScreen';
import IndexView from './components/IndexView';
import ChapterView from './components/ChapterView';
import PoemView from './components/PoemView';
import IntermissionView from './components/IntermissionView';
import VentView from './components/VentView';
import AdminDashboard from './components/AdminDashboard';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/index" element={<IndexView />} />
        <Route path="/chapter/:id" element={<ChapterView />} />
        <Route path="/intermission/:id" element={<IntermissionView />} />
        <Route path="/vent/:id" element={<VentView />} />
        <Route path="/poem/:id" element={<PoemView />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </AnimatePresence>
  );
}

import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <CustomCursor />
      <FlashlightOverlay />
      <DockNav />
      <div className="container">
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
