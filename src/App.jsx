import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import DockNav from './components/DockNav';
import CustomCursor from './components/CustomCursor';
import TypewriterLoader from './components/TypewriterLoader';
import FlashlightOverlay from './components/FlashlightOverlay';

import WelcomeScreen from './components/WelcomeScreen'; // We can keep WelcomeScreen immediate since it's the root, or lazy it. Let's lazy it.
const IndexView = React.lazy(() => import('./components/IndexView'));
const ChapterView = React.lazy(() => import('./components/ChapterView'));
const PoemView = React.lazy(() => import('./components/PoemView'));
const IntermissionView = React.lazy(() => import('./components/IntermissionView'));
const VentView = React.lazy(() => import('./components/VentView'));
const JournalView = React.lazy(() => import('./components/JournalView'));
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'));
const ErrorView = React.lazy(() => import('./components/ErrorView'));
const PlaceholderView = React.lazy(() => import('./components/PlaceholderView'));

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
      <React.Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-color)' }}>Loading...</div>}>
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
      </React.Suspense>
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
