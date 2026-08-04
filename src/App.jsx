import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import DockNav from './components/DockNav';
import CustomCursor from './components/CustomCursor';

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
      <DockNav />
      <div className="container">
        <Suspense fallback={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
            <div style={{ width: '40px', height: '40px', border: '2px solid var(--text-color)', borderBottomColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', opacity: 0.5 }}></div>
            <p style={{ marginTop: '1rem', fontFamily: 'monospace', letterSpacing: '2px', opacity: 0.5, fontSize: '0.8rem' }}>INITIALIZING...</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        }>
          <AnimatedRoutes />
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
