import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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
import JournalView from './components/JournalView';
import AdminDashboard from './components/AdminDashboard';
import ErrorView from './components/ErrorView';
import PlaceholderView from './components/PlaceholderView';

function AnimatedRoutes() {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleApiError = (e) => {
      if (location.pathname !== '/error') {
        navigate(`/error?code=${e.detail.code}`, { replace: true });
      }
    };
    window.addEventListener('api-error', handleApiError);
    return () => window.removeEventListener('api-error', handleApiError);
  }, [navigate, location.pathname]);
  
  return (
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/index" element={<IndexView />} />
        <Route path="/journal" element={<JournalView />} />
        <Route path="/chapter/:id" element={<ChapterView />} />
        <Route path="/intermission/:id" element={<IntermissionView />} />
        <Route path="/vent/:id" element={<VentView />} />
        <Route path="/poem/:id" element={<PoemView />} />
        <Route path="/photography" element={<PlaceholderView title="Photography" />} />
        <Route path="/video" element={<PlaceholderView title="Video Editing" />} />
        <Route path="/gamedev" element={<PlaceholderView title="Game Dev" />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/error" element={<ErrorView />} />
        <Route path="*" element={<ErrorView fallbackCode={404} />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  React.useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <Router>
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
