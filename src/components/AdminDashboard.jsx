import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-wysiwyg';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBookOpen, FaTicketAlt, FaFileAlt, FaArrowUp, FaArrowDown, FaImage, FaStickyNote, FaChevronDown, FaChevronRight, FaPlus, FaExpand, FaCompress } from 'react-icons/fa';
import api from '../api';

function AdminDashboard() {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [password, setPassword] = useState('');
  
  const [chapters, setChapters] = useState([]);
  const [poems, setPoems] = useState([]);
  
  const [newChapterTitle, setNewChapterTitle] = useState('');
  
  const [poemForm, setPoemForm] = useState({ _id: null, title: '', titleEn: '', content: '', contentEn: '', chapterId: '', image: '' });
  const [isPoemModalOpen, setIsPoemModalOpen] = useState(false);

  const [intermissionForm, setIntermissionForm] = useState({ _id: null, title: '', titleEn: '', content: '', contentEn: '', image: '', isIntermission: true });
  const [isIntermissionModalOpen, setIsIntermissionModalOpen] = useState(false);

  const [ventForm, setVentForm] = useState({ _id: null, title: '', titleEn: '', content: '', contentEn: '', image: '', isVent: true });
  const [isVentModalOpen, setIsVentModalOpen] = useState(false);

  const [chapterForm, setChapterForm] = useState({ _id: null, title: '', titleEn: '', image: '', theme: 'winter' });
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);

  const [expandedChapters, setExpandedChapters] = useState(new Set());

  const toggleChapter = (chapterId) => {
    setExpandedChapters(prev => {
      const next = new Set(prev);
      if (next.has(chapterId)) next.delete(chapterId);
      else next.add(chapterId);
      return next;
    });
  };

  const expandAll = () => setExpandedChapters(new Set(chapters.map(c => c._id)));
  const collapseAll = () => setExpandedChapters(new Set());

  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const [chapRes, poemRes] = await Promise.all([
        api.get('/chapters'),
        api.get('/poems')
      ]);
      setChapters(chapRes.data);
      setPoems(poemRes.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) handleLogout();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', { password });
      localStorage.setItem('admin_token', res.data.token);
      setToken(res.data.token);
    } catch (err) {
      alert('Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const handleFileChange = async (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large (max 5MB)");
        return;
      }
      const base64 = await toBase64(file);
      setter(prev => ({ ...prev, image: base64 }));
    }
  };

  // --- Chapter Actions ---
  const saveChapter = async (e) => {
    e.preventDefault();
    if (chapterForm._id) await api.put(`/chapters/${chapterForm._id}`, chapterForm);
    else await api.post('/chapters', { ...chapterForm, isIntermission: false });
    setIsChapterModalOpen(false);
    fetchData();
  };

  const openChapterModalForEdit = (c) => {
    setChapterForm({ _id: c._id, title: c.title, titleEn: c.titleEn || '', image: c.image || '', theme: c.theme || 'winter' });
    setIsChapterModalOpen(true);
  };

  const deleteChapter = async (id) => {
    if (confirm('Delete this item? If it is a chapter, all poems inside will be deleted.')) {
      await api.delete(`/chapters/${id}`);
      fetchData();
    }
  };

  const moveChapter = async (index, direction) => {
    const newChapters = [...chapters];
    if (direction === 'up' && index > 0) {
      [newChapters[index - 1], newChapters[index]] = [newChapters[index], newChapters[index - 1]];
    } else if (direction === 'down' && index < newChapters.length - 1) {
      [newChapters[index + 1], newChapters[index]] = [newChapters[index], newChapters[index + 1]];
    } else return;
    
    setChapters(newChapters);
    await api.put('/chapters/reorder', { orderedIds: newChapters.map(c => c._id) });
  };

  // --- Poem Actions ---
  const savePoem = async (e) => {
    e.preventDefault();
    if (poemForm._id) await api.put(`/poems/${poemForm._id}`, poemForm);
    else await api.post('/poems', poemForm);
    setIsPoemModalOpen(false);
    fetchData();
  };

  const deletePoem = async (id) => {
    if (confirm('Delete poem?')) {
      await api.delete(`/poems/${id}`);
      fetchData();
    }
  };

  const movePoem = async (poem, direction) => {
    const chapterPoems = poems.filter(p => p.chapterId === poem.chapterId);
    const index = chapterPoems.findIndex(p => p._id === poem._id);
    let target = null;
    if (direction === 'up' && index > 0) target = chapterPoems[index - 1];
    else if (direction === 'down' && index < chapterPoems.length - 1) target = chapterPoems[index + 1];
    
    if (target) {
      const newPoems = [...poems];
      const i1 = newPoems.findIndex(p => p._id === poem._id);
      const i2 = newPoems.findIndex(p => p._id === target._id);
      [newPoems[i1], newPoems[i2]] = [newPoems[i2], newPoems[i1]];
      setPoems(newPoems);
      await api.put('/poems/reorder', { orderedIds: newPoems.map(p => p._id) });
    }
  };

  const openPoemModalForNew = (chapterId) => {
    setPoemForm({ _id: null, title: '', titleEn: '', content: '', contentEn: '', chapterId: chapterId, image: '' });
    setIsPoemModalOpen(true);
  };

  const openPoemModalForEdit = (poem) => {
    setPoemForm(poem);
    setIsPoemModalOpen(true);
  };

  // --- Intermission Actions ---
  const saveIntermission = async (e) => {
    e.preventDefault();
    if (intermissionForm._id) await api.put(`/chapters/${intermissionForm._id}`, intermissionForm);
    else await api.post('/chapters', intermissionForm);
    setIsIntermissionModalOpen(false);
    fetchData();
  };

  const openIntermissionModalForNew = () => {
    setIntermissionForm({ _id: null, title: '', titleEn: '', content: '', contentEn: '', image: '', isIntermission: true });
    setIsIntermissionModalOpen(true);
  };

  const openIntermissionModalForEdit = (chap) => {
    setIntermissionForm(chap);
    setIsIntermissionModalOpen(true);
  };

  // --- Vent Actions ---
  const saveVent = async (e) => {
    e.preventDefault();
    if (ventForm._id) await api.put(`/chapters/${ventForm._id}`, ventForm);
    else await api.post('/chapters', ventForm);
    setIsVentModalOpen(false);
    fetchData();
  };

  const openVentModalForNew = () => {
    setVentForm({ _id: null, title: '', titleEn: '', content: '', contentEn: '', image: '', isVent: true });
    setIsVentModalOpen(true);
  };

  const openVentModalForEdit = (chap) => {
    setVentForm(chap);
    setIsVentModalOpen(true);
  };

  if (!token) {
    return (
      <div style={{ padding: '4rem 0', maxWidth: '400px', margin: '0 auto' }}>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin} className="admin-form">
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 0', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Anthology Structure</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <motion.div 
        layout
        initial={false}
        animate={{
          padding: isScrolled ? '0.5rem 1.5rem' : '0.5rem 2rem',
          gap: isScrolled ? '1.5rem' : '1rem'
        }}
        style={{ 
          position: 'sticky', 
          top: '1rem', 
          zIndex: 50,
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '35px',
          background: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          width: 'fit-content',
          margin: '0 auto 2rem auto',
          transformOrigin: 'top center'
        }}
      >
        <div style={{ display: 'flex', gap: isScrolled ? '1.5rem' : '1rem', alignItems: 'center' }}>
          <button 
            onClick={() => { setChapterForm({ _id: null, title: '', titleEn: '', image: '', theme: 'winter' }); setIsChapterModalOpen(true); }} 
            style={{ padding: isScrolled ? '0.5rem' : '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'var(--text-color)', border: 'none' }}
            title="Add Chapter"
          >
            {isScrolled ? <FaBookOpen size={20} /> : <><FaPlus size={12}/> Add Chapter</>}
          </button>
          <button 
            onClick={openIntermissionModalForNew} 
            style={{ padding: isScrolled ? '0.5rem' : '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: isScrolled ? 'transparent' : 'var(--text-color)', color: isScrolled ? 'var(--text-color)' : 'var(--bg-color)', border: 'none' }}
            title="Add Intermission"
          >
            {isScrolled ? <FaTicketAlt size={20} /> : <><FaPlus size={12}/> Add Intermission</>}
          </button>
          <button 
            onClick={openVentModalForNew} 
            style={{ padding: isScrolled ? '0.5rem' : '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: isScrolled ? 'transparent' : '#fdfd96', color: isScrolled ? 'var(--text-color)' : '#111', border: isScrolled ? 'none' : '1px solid #111' }}
            title="Add Vent"
          >
            {isScrolled ? <FaStickyNote size={20} /> : <><FaPlus size={12}/> Add Vent</>}
          </button>
        </div>
        
        {isScrolled && <div style={{ width: '1px', height: '24px', background: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }} />}

        <div style={{ display: 'flex', gap: isScrolled ? '1.5rem' : '0.5rem', alignItems: 'center' }}>
          <button onClick={expandAll} style={{ padding: isScrolled ? '0.5rem' : '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'var(--text-color)', border: 'none' }} title="Expand All">
            {isScrolled ? <FaExpand size={20} /> : 'Expand All'}
          </button>
          <button onClick={collapseAll} style={{ padding: isScrolled ? '0.5rem' : '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'var(--text-color)', border: 'none' }} title="Collapse All">
            {isScrolled ? <FaCompress size={20} /> : 'Collapse All'}
          </button>
        </div>
      </motion.div>

      <ul className="admin-list" style={{ padding: 0 }}>
        {chapters.map((c, index) => {
          const chapterPoems = poems.filter(p => p.chapterId === c._id);
          const isExpanded = expandedChapters.has(c._id);
          const hasPoems = !c.isIntermission && !c.isVent;
          
          return (
            <li key={c._id} style={{ display: 'block', padding: 0, marginBottom: '1rem', border: 'none' }}>
              <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                padding: '0.8rem 1rem', background: 'var(--border-color)', borderRadius: '4px',
                cursor: hasPoems ? 'pointer' : 'default',
                userSelect: 'none'
              }}
              onClick={() => { if(hasPoems) toggleChapter(c._id); }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.2rem' }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => moveChapter(index, 'up')} style={{ padding: '0.2rem 0.4rem', fontSize: '0.8rem' }} title="Move Up"><FaArrowUp /></button>
                    <button onClick={() => moveChapter(index, 'down')} style={{ padding: '0.2rem 0.4rem', fontSize: '0.8rem' }} title="Move Down"><FaArrowDown /></button>
                  </div>
                  
                  <strong style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {hasPoems && (
                      <span style={{ color: '#888', display: 'flex', alignItems: 'center' }}>
                        {isExpanded ? <FaChevronDown size={14} /> : <FaChevronRight size={14} />}
                      </span>
                    )}
                    {c.isIntermission ? <><FaTicketAlt /> Intermission: {c.title}</> : c.isVent ? <><FaStickyNote /> Vent: {c.title}</> : <><FaBookOpen /> Chapter: {c.title}</>}
                    {c.image && <FaImage title="Has Image" style={{ marginLeft: '0.5rem', color: '#888', fontSize: '0.9rem' }} />}
                  </strong>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {hasPoems && !isExpanded && (
                    <span style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                      {chapterPoems.length} poem{chapterPoems.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  <div style={{ display: 'flex', gap: '0.5rem' }} onClick={e => e.stopPropagation()}>
                    {c.isIntermission ? (
                      <button onClick={() => openIntermissionModalForEdit(c)} style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>Edit</button>
                    ) : c.isVent ? (
                      <button onClick={() => openVentModalForEdit(c)} style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>Edit</button>
                    ) : (
                      <button onClick={() => openChapterModalForEdit(c)} style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>Edit Theme</button>
                    )}
                    <button onClick={() => deleteChapter(c._id)} style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>Delete</button>
                  </div>
                </div>
              </div>

              {hasPoems && isExpanded && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  style={{ padding: '1rem 0 1rem 2.5rem', borderLeft: '2px solid var(--border-color)', marginLeft: '1.5rem', marginTop: '0.5rem' }}
                >
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {chapterPoems.map(p => (
                      <li key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px dashed var(--border-color)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaFileAlt /> {p.title} {p.image && <FaImage title="Has Image" style={{ color: '#888' }} />}</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => movePoem(p, 'up')} style={{ padding: '0.2rem 0.4rem', fontSize: '0.8rem' }}><FaArrowUp /></button>
                          <button onClick={() => movePoem(p, 'down')} style={{ padding: '0.2rem 0.4rem', fontSize: '0.8rem' }}><FaArrowDown /></button>
                          <button onClick={() => openPoemModalForEdit(p)} style={{ padding: '0.1rem 0.4rem', marginRight: '0.5rem', fontSize: '0.7rem' }}>Edit</button>
                          <button onClick={() => deletePoem(p._id)} style={{ padding: '0.1rem 0.4rem', fontSize: '0.7rem' }}>Delete</button>
                        </div>
                      </li>
                    ))}
                    {chapterPoems.length === 0 && (
                      <li style={{ fontStyle: 'italic', color: '#888', padding: '0.5rem 0', borderBottom: 'none' }}>No poems in this chapter.</li>
                    )}
                  </ul>
                  <button onClick={() => openPoemModalForNew(c._id)} style={{ marginTop: '1rem', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                    + Add Poem Here
                  </button>
                </motion.div>
              )}
            </li>
          );
        })}
      </ul>

      {/* CHAPTER MODAL */}
      <AnimatePresence>
        {isChapterModalOpen && (
          <motion.div 
            className="modal-overlay"
            onClick={(e) => { if (e.target === e.currentTarget) setIsChapterModalOpen(false); }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content"
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
            >
              <button className="modal-close" onClick={() => setIsChapterModalOpen(false)}>&times;</button>
              <h2 style={{ marginBottom: '2rem' }}>{chapterForm._id ? 'Edit Chapter' : 'Create Chapter'}</h2>
              <form onSubmit={saveChapter} className="admin-form" style={{ border: 'none', padding: 0 }}>
                <input type="text" placeholder="Chapter Title (ES)" value={chapterForm.title} onChange={e => setChapterForm({...chapterForm, title: e.target.value})} required />
                <input type="text" placeholder="Chapter Title (EN)" value={chapterForm.titleEn} onChange={e => setChapterForm({...chapterForm, titleEn: e.target.value})} />
                
                <label>Room Aesthetic Theme</label>
                <select value={chapterForm.theme || 'winter'} onChange={e => setChapterForm({...chapterForm, theme: e.target.value})} required>
                  <option value="winter">Winter</option>
                  <option value="spring">Spring</option>
                  <option value="summer">Summer</option>
                  <option value="autumn">Autumn</option>
                </select>

                <label>Chapter Cover Polaroid (optional)</label>
                <input type="file" accept="image/*" onChange={e => handleFileChange(e, setChapterForm)} />
                {chapterForm.image && <img src={chapterForm.image} alt="preview" style={{ width: '150px' }} />}
                
                <button type="submit" style={{ marginTop: '2rem', padding: '1rem', background: 'var(--text-color)', color: 'var(--bg-color)' }}>
                  {chapterForm._id ? 'Save Changes' : 'Create Chapter'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* POEM MODAL */}
      <AnimatePresence>
        {isPoemModalOpen && (
          <motion.div 
            className="modal-overlay"
            onClick={(e) => { if (e.target === e.currentTarget) setIsPoemModalOpen(false); }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content"
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
            >
              <button className="modal-close" onClick={() => setIsPoemModalOpen(false)}>&times;</button>
              <h2 style={{ marginBottom: '2rem' }}>{poemForm._id ? 'Edit Poem' : 'Create Poem'}</h2>
              <form onSubmit={savePoem} className="admin-form" style={{ border: 'none', padding: 0 }}>
                <input type="text" placeholder="Poem Title (ES)" value={poemForm.title} onChange={e => setPoemForm({...poemForm, title: e.target.value})} required />
                <input type="text" placeholder="Poem Title (EN)" value={poemForm.titleEn} onChange={e => setPoemForm({...poemForm, titleEn: e.target.value})} />
                
                <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
                  <div style={{ flex: 1 }}>
                    <label>Chapter</label>
                    <select value={poemForm.chapterId} onChange={e => setPoemForm({...poemForm, chapterId: e.target.value})} required style={{ width: '100%' }}>
                      {chapters.filter(c => !c.isIntermission && !c.isVent).map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Background Animation</label>
                    <select value={poemForm.theme || 'none'} onChange={e => setPoemForm({...poemForm, theme: e.target.value})} required style={{ width: '100%' }}>
                      <option value="none">None (Default)</option>
                      <option value="winter">Winter (Snow)</option>
                      <option value="spring">Spring (Dandelions)</option>
                      <option value="summer">Summer (Fireflies)</option>
                      <option value="autumn">Autumn (Leaves)</option>
                      <option value="ambient">Ambient Dust</option>
                      <option value="digital">Digital Rain</option>
                      <option value="embers">Floating Embers</option>
                      <option value="clocks">Time & Clocks</option>
                      <option value="dawn">Dawn Light</option>
                    </select>
                  </div>
                </div>

                <div style={{ background: 'white', color: 'black', marginBottom: '1.5rem', minHeight: '300px' }}>
                  <label style={{color: '#111'}}>Content (ES)</label>
                  <Editor value={poemForm.content} onChange={e => setPoemForm({...poemForm, content: e.target.value})} style={{ height: '300px' }} />
                </div>
                <div style={{ background: 'white', color: 'black', marginBottom: '1.5rem', minHeight: '300px' }}>
                  <label style={{color: '#111'}}>Content (EN)</label>
                  <Editor value={poemForm.contentEn} onChange={e => setPoemForm({...poemForm, contentEn: e.target.value})} style={{ height: '300px' }} />
                </div>
                <label>Image (optional)</label>
                <input type="file" accept="image/*" onChange={e => handleFileChange(e, setPoemForm)} />
                {poemForm.image && <img src={poemForm.image} alt="preview" style={{ width: '150px' }} />}
                <button type="submit" style={{ marginTop: '2rem', padding: '1rem', background: 'var(--text-color)', color: 'var(--bg-color)' }}>
                  {poemForm._id ? 'Save Changes' : 'Create Poem'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INTERMISSION MODAL */}
      <AnimatePresence>
        {isIntermissionModalOpen && (
          <motion.div 
            className="modal-overlay"
            onClick={(e) => { if (e.target === e.currentTarget) setIsIntermissionModalOpen(false); }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content"
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
            >
              <button className="modal-close" onClick={() => setIsIntermissionModalOpen(false)}>&times;</button>
              <h2 style={{ marginBottom: '2rem' }}>{intermissionForm._id ? 'Edit Intermission' : 'Create Intermission'}</h2>
              <form onSubmit={saveIntermission} className="admin-form" style={{ border: 'none', padding: 0 }}>
                <input type="text" placeholder="Intermission Title (ES)" value={intermissionForm.title} onChange={e => setIntermissionForm({...intermissionForm, title: e.target.value})} required />
                <input type="text" placeholder="Intermission Title (EN)" value={intermissionForm.titleEn} onChange={e => setIntermissionForm({...intermissionForm, titleEn: e.target.value})} />
                
                <label>Transport Type</label>
                <select value={intermissionForm.theme || 'plane'} onChange={e => setIntermissionForm({...intermissionForm, theme: e.target.value})} required>
                  <option value="plane">Plane (Midnight Radar)</option>
                  <option value="train">Train (Metro Map)</option>
                  <option value="bus">Bus (Highway)</option>
                  <option value="train-cherry">Train (Cherry Yum Yum)</option>
                </select>

                <div style={{ background: 'white', color: 'black', margin: '1.5rem 0', minHeight: '300px' }}>
                  <label style={{color: '#111'}}>Content (ES)</label>
                  <Editor value={intermissionForm.content} onChange={e => setIntermissionForm({...intermissionForm, content: e.target.value})} style={{ height: '300px' }} />
                </div>
                <div style={{ background: 'white', color: 'black', margin: '1.5rem 0', minHeight: '300px' }}>
                  <label style={{color: '#111'}}>Content (EN)</label>
                  <Editor value={intermissionForm.contentEn} onChange={e => setIntermissionForm({...intermissionForm, contentEn: e.target.value})} style={{ height: '300px' }} />
                </div>
                <label>Image (optional)</label>
                <input type="file" accept="image/*" onChange={e => handleFileChange(e, setIntermissionForm)} />
                {intermissionForm.image && <img src={intermissionForm.image} alt="preview" style={{ width: '150px', display: 'block', marginTop: '1rem' }} />}
                <button type="submit" style={{ marginTop: '2rem', padding: '1rem', background: 'var(--text-color)', color: 'var(--bg-color)' }}>
                  {intermissionForm._id ? 'Save Changes' : 'Create Intermission'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* VENT MODAL */}
      <AnimatePresence>
        {isVentModalOpen && (
          <motion.div 
            className="modal-overlay"
            onClick={(e) => { if (e.target === e.currentTarget) setIsVentModalOpen(false); }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content"
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
            >
              <button className="modal-close" onClick={() => setIsVentModalOpen(false)}>&times;</button>
              <h2 style={{ marginBottom: '2rem' }}>{ventForm._id ? 'Edit Vent' : 'Create Vent'}</h2>
              <form onSubmit={saveVent} className="admin-form" style={{ border: 'none', padding: 0 }}>
                <input type="text" placeholder="Vent Title (ES)" value={ventForm.title} onChange={e => setVentForm({...ventForm, title: e.target.value})} required />
                <input type="text" placeholder="Vent Title (EN)" value={ventForm.titleEn} onChange={e => setVentForm({...ventForm, titleEn: e.target.value})} />
                
                <label>Vent Aesthetic Theme</label>
                <select value={ventForm.theme || 'notebook'} onChange={e => setVentForm({...ventForm, theme: e.target.value})} required>
                  <option value="notebook">Notebook (Stacked Pages)</option>
                  <option value="postits">Post-its (Scattered)</option>
                </select>

                <div style={{ background: 'white', color: 'black', margin: '1.5rem 0', minHeight: '300px' }}>
                  <label style={{color: '#111'}}>Content (ES)</label>
                  <Editor value={ventForm.content} onChange={e => setVentForm({...ventForm, content: e.target.value})} style={{ height: '300px' }} />
                </div>
                <div style={{ background: 'white', color: 'black', margin: '1.5rem 0', minHeight: '300px' }}>
                  <label style={{color: '#111'}}>Content (EN)</label>
                  <Editor value={ventForm.contentEn} onChange={e => setVentForm({...ventForm, contentEn: e.target.value})} style={{ height: '300px' }} />
                </div>
                <label>Cover Image (optional)</label>
                <input type="file" accept="image/*" onChange={e => handleFileChange(e, setVentForm)} />
                {ventForm.image && <img src={ventForm.image} alt="preview" style={{ width: '150px', display: 'block', marginTop: '1rem' }} />}
                <button type="submit" style={{ marginTop: '2rem', padding: '1rem', background: '#fdfd96', color: '#111', border: '1px solid #111' }}>
                  {ventForm._id ? 'Save Vent' : 'Create Vent'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminDashboard;
