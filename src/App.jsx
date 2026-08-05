import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import DockNav from './components/DockNav';
import CustomCursor from './components/CustomCursor';
import TypewriterLoader from './components/TypewriterLoader';
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
