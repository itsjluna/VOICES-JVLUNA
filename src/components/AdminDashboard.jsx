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
  
  const [poemForm, setPoemForm] = useState({ _id: null, title: '', titleEn: '', content: '', contentEn: '', chapterId: '', image: '', imageCredit: '' });
  const [isPoemModalOpen, setIsPoemModalOpen] = useState(false);

  const [intermissionForm, setIntermissionForm] = useState({ _id: null, title: '', titleEn: '', content: '', contentEn: '', image: '', imageCredit: '', isIntermission: true });
  const [isIntermissionModalOpen, setIsIntermissionModalOpen] = useState(false);

  const [ventForm, setVentForm] = useState({ _id: null, title: '', titleEn: '', content: '', contentEn: '', image: '', imageCredit: '', isVent: true });
  const [isVentModalOpen, setIsVentModalOpen] = useState(false);

  const [chapterForm, setChapterForm] = useState({ _id: null, title: '', titleEn: '', image: '', imageCredit: '', theme: 'winter' });
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);

  const [expandedChapters, setExpandedChapters] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());

  const toggleSelection = (e, id, type) => {
    e.stopPropagation();
    const key = `${type}:${id}`;
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedItems.size} selected item(s)?`)) return;
    for (const key of selectedItems) {
      const [type, id] = key.split(':');
      if (type === 'chapter') await api.delete(`/chapters/${id}`);
      else if (type === 'poem') await api.delete(`/poems/${id}`);
    }
    setSelectedItems(new Set());
    fetchData();
  };

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

  // Drafts logic
  useEffect(() => {
    const drafts = JSON.parse(localStorage.getItem('admin_drafts') || '{}');
    let changed = false;
    
    // Only auto-save if modal is open and it's a new entry (no _id)
    if (isChapterModalOpen && !chapterForm._id) { drafts.chapter = chapterForm; changed = true; }
    if (isPoemModalOpen && !poemForm._id) { drafts.poem = poemForm; changed = true; }
    if (isIntermissionModalOpen && !intermissionForm._id) { drafts.intermission = intermissionForm; changed = true; }
    if (isVentModalOpen && !ventForm._id) { drafts.vent = ventForm; changed = true; }
    
    if (changed) {
      localStorage.setItem('admin_drafts', JSON.stringify(drafts));
    }
  }, [chapterForm, poemForm, intermissionForm, ventForm, isChapterModalOpen, isPoemModalOpen, isIntermissionModalOpen, isVentModalOpen]);

  const clearDraft = (type) => {
    try {
      const drafts = JSON.parse(localStorage.getItem('admin_drafts') || '{}');
      delete drafts[type];
      localStorage.setItem('admin_drafts', JSON.stringify(drafts));
    } catch(e) {}
  };

  const loadDraft = (type, defaultForm) => {
    try {
      const drafts = JSON.parse(localStorage.getItem('admin_drafts') || '{}');
      const draft = drafts[type];
      if (draft && (draft.title || draft.content)) {
        if (confirm(`You have an unsaved draft for a ${type}. Would you like to load it?`)) {
          return { ...defaultForm, ...draft };
        } else {
          clearDraft(type);
        }
      }
    } catch(e) {}
    return defaultForm;
  };

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
    clearDraft('chapter');
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
    clearDraft('poem');
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
    setPoemForm(loadDraft('poem', { _id: null, title: '', titleEn: '', content: '', contentEn: '', chapterId: chapterId, image: '', imageCredit: '' }));
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
    clearDraft('intermission');
    setIsIntermissionModalOpen(false);
    fetchData();
  };

  const openIntermissionModalForNew = () => {
    setIntermissionForm(loadDraft('intermission', { _id: null, title: '', titleEn: '', content: '', contentEn: '', image: '', imageCredit: '', isIntermission: true }));
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
    clearDraft('vent');
    setIsVentModalOpen(false);
    fetchData();
  };

  const openVentModalForNew = () => {
    setVentForm(loadDraft('vent', { _id: null, title: '', titleEn: '', content: '', contentEn: '', image: '', imageCredit: '', isVent: true }));
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
    <div style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Anthology Structure</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ position: 'sticky', top: '1rem', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '2rem', width: '100%' }}>

      <motion.div 
        className="admin-toolbar"
        initial={false}
        animate={{
          padding: isScrolled ? '0.5rem 1.5rem' : '0.5rem 2rem',
          gap: isScrolled ? '1.5rem' : '1.5rem'
        }}
        transition={{ duration: 0.3 }}
        style={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '35px',
          background: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          width: 'fit-content'
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            onClick={() => { setChapterForm(loadDraft('chapter', { _id: null, title: '', titleEn: '', image: '', imageCredit: '', theme: 'winter' })); setIsChapterModalOpen(true); }} 
            style={{ padding: isScrolled ? '0.5rem' : '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'var(--text-color)', border: 'none', cursor: 'pointer' }}
            title="Add Chapter"
          >
            <FaBookOpen size={16} /> {!isScrolled && <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Add Chapter</span>}
          </button>
          <button 
            onClick={openIntermissionModalForNew} 
            style={{ padding: isScrolled ? '0.5rem' : '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'var(--text-color)', border: 'none', cursor: 'pointer' }}
            title="Add Intermission"
          >
            <FaTicketAlt size={16} /> {!isScrolled && <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Add Intermission</span>}
          </button>
          <button 
            onClick={openVentModalForNew} 
            style={{ padding: isScrolled ? '0.5rem' : '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'var(--text-color)', border: 'none', cursor: 'pointer' }}
            title="Add Vent"
          >
            <FaStickyNote size={16} /> {!isScrolled && <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Add Vent</span>}
          </button>
          {selectedItems.size > 0 && (
            <button 
              onClick={handleBulkDelete}
              style={{ padding: isScrolled ? '0.5rem' : '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ff4d4d', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '15px' }}
              title={`Delete ${selectedItems.size} items`}
            >
              {!isScrolled ? <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Delete {selectedItems.size} items</span> : <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{selectedItems.size}</span>}
            </button>
          )}
        </div>
        
        <div style={{ width: '1px', height: '24px', background: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }} />

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={expandAll} style={{ padding: isScrolled ? '0.5rem' : '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'var(--text-color)', border: 'none', cursor: 'pointer' }} title="Expand All">
            <FaExpand size={16} /> {!isScrolled && <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Expand</span>}
          </button>
          <button onClick={collapseAll} style={{ padding: isScrolled ? '0.5rem' : '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'var(--text-color)', border: 'none', cursor: 'pointer' }} title="Collapse All">
            <FaCompress size={16} /> {!isScrolled && <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Collapse</span>}
          </button>
        </div>
      </motion.div>

        <input 
          type="text" 
          placeholder="Search chapters, vents, and poems..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ 
            width: '100%', 
            maxWidth: '500px', 
            padding: '0.8rem 1.5rem', 
            borderRadius: '25px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
            background: isDark ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(10px)',
            color: 'var(--text-color)',
            outline: 'none',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <ul className="admin-list" style={{ padding: 0 }}>
        {chapters.filter(c => {
          if (!searchQuery) return true;
          const query = searchQuery.toLowerCase();
          if (c.title && c.title.toLowerCase().includes(query)) return true;
          if (c.titleEn && c.titleEn.toLowerCase().includes(query)) return true;
          const chapterPoems = poems.filter(p => p.chapterId === c._id);
          return chapterPoems.some(p => (p.title && p.title.toLowerCase().includes(query)) || (p.titleEn && p.titleEn.toLowerCase().includes(query)));
        }).map((c, index) => {
          const chapterPoems = poems.filter(p => p.chapterId === c._id);
          const isExpanded = expandedChapters.has(c._id);
          const hasPoems = !c.isIntermission && !c.isVent;
          
          return (
            <li key={c._id} style={{ display: 'block', padding: 0, marginBottom: '1rem', border: 'none' }}>
              <div className="admin-list-item" style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                padding: '1rem 1.5rem', 
                cursor: hasPoems ? 'pointer' : 'default',
                userSelect: 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.06)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)'; }}
              onClick={() => { if(hasPoems) toggleChapter(c._id); }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedItems.has(`chapter:${c._id}`)} 
                    onChange={(e) => toggleSelection(e, c._id, 'chapter')} 
                    onClick={e => e.stopPropagation()}
                    style={{ transform: 'scale(1.2)' }}
                  />
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

                <div className="admin-list-item-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {hasPoems && !isExpanded && (
                    <span style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                      {chapterPoems.length} poem{chapterPoems.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  
                  {/* Desktop Inline Actions */}
                  <div className="desktop-inline-actions" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginRight: '1rem' }} onClick={e => e.stopPropagation()}>
                    {!c.isIntermission && !c.isVent && (
                      <select 
                        value={c.theme || 'winter'} 
                        onChange={async (e) => {
                          await api.put(`/chapters/${c._id}`, { ...c, theme: e.target.value });
                          fetchData();
                        }}
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', borderRadius: '4px', background: 'transparent', color: 'var(--text-color)', border: '1px solid var(--border-color)' }}
                      >
                        <option value="winter">Winter</option>
                        <option value="spring">Spring</option>
                        <option value="summer">Summer</option>
                        <option value="autumn">Autumn</option>
                      </select>
                    )}
                    
                    <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.5rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                      <FaImage /> {c.image ? 'Change Image' : 'Add Image'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onloadend = async () => {
                            await api.put(`/chapters/${c._id}`, { ...c, image: reader.result });
                            fetchData();
                          };
                          reader.readAsDataURL(file);
                        }} 
                      />
                    </label>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }} onClick={e => e.stopPropagation()}>
                    {c.isIntermission ? (
                      <button onClick={() => openIntermissionModalForEdit(c)} style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>Edit</button>
                    ) : c.isVent ? (
                      <button onClick={() => openVentModalForEdit(c)} style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>Edit</button>
                    ) : (
                      <button onClick={() => openChapterModalForEdit(c)} style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>Edit Details</button>
                    )}
                    <button onClick={() => deleteChapter(c._id)} style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', color: '#ff4d4d', borderColor: '#ff4d4d' }}>Delete</button>
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
                      <li key={p._id} className="admin-list-poem-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <input 
                            type="checkbox" 
                            checked={selectedItems.has(`poem:${p._id}`)} 
                            onChange={(e) => toggleSelection(e, p._id, 'poem')} 
                            style={{ transform: 'scale(1.1)' }}
                          />
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.9 }}>
                            <FaFileAlt style={{ color: 'var(--text-color)', opacity: 0.7 }} /> 
                            {p.title} 
                            {p.image && <FaImage title="Has Image" style={{ color: '#888', fontSize: '0.8rem' }} />}
                          </span>
                        </span>
                        <div className="admin-list-poem-actions" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.1rem 0.4rem', fontSize: '0.7rem', borderRadius: '4px', border: '1px solid var(--border-color)', marginRight: '0.5rem' }}>
                            <FaImage /> {p.image ? 'Change' : 'Add Image'}
                            <input 
                              type="file" 
                              accept="image/*" 
                              style={{ display: 'none' }} 
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onloadend = async () => {
                                  await api.put(`/poems/${p._id}`, { ...p, image: reader.result });
                                  fetchData();
                                };
                                reader.readAsDataURL(file);
                              }} 
                            />
                          </label>
                          <button onClick={() => movePoem(p, 'up')} style={{ padding: '0.2rem 0.4rem', fontSize: '0.8rem' }}><FaArrowUp /></button>
                          <button onClick={() => movePoem(p, 'down')} style={{ padding: '0.2rem 0.4rem', fontSize: '0.8rem' }}><FaArrowDown /></button>
                          <button onClick={() => openPoemModalForEdit(p)} style={{ padding: '0.1rem 0.4rem', marginRight: '0.5rem', fontSize: '0.7rem' }}>Edit</button>
                          <button onClick={() => deletePoem(p._id)} style={{ padding: '0.1rem 0.4rem', fontSize: '0.7rem', color: '#ff4d4d', borderColor: '#ff4d4d' }}>Delete</button>
                        </div>
                      </li>
                    ))}
                    {chapterPoems.length === 0 && (
                      <li style={{ fontStyle: 'italic', color: '#888', padding: '0.5rem 0', borderBottom: 'none' }}>No poems in this chapter.</li>
                    )}
                  </ul>
                  <button onClick={() => openPoemModalForNew(c._id)} style={{ marginTop: '1rem', fontSize: '0.85rem', padding: '0.5rem 1rem', background: 'transparent', border: `1px dashed ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`, borderRadius: '8px', color: 'var(--text-color)', cursor: 'pointer', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: 'background 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <FaPlus size={10} /> Add New Poem to Chapter
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
                <input type="text" placeholder="Image Credit (e.g. Photo by John Doe)" value={chapterForm.imageCredit || ''} onChange={e => setChapterForm({...chapterForm, imageCredit: e.target.value})} />
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
                      <option value="lgbt">Pride (Rainbow)</option>
                      <option value="class-actress">Class Actress</option>
                    </select>
                  </div>
                </div>

                <div style={{ background: 'white', color: 'black', marginBottom: '1.5rem', minHeight: '300px' }}>
                  <label style={{color: '#111'}}>Content (ES)</label>
                  <Editor value={poemForm.content} onChange={e => setPoemForm({...poemForm, content: e.target.value})} style={{ height: 'clamp(300px, 50vh, 600px)', overflowY: 'auto' }} />
                </div>
                <div style={{ background: 'white', color: 'black', marginBottom: '1.5rem', minHeight: '300px' }}>
                  <label style={{color: '#111'}}>Content (EN)</label>
                  <Editor value={poemForm.contentEn} onChange={e => setPoemForm({...poemForm, contentEn: e.target.value})} style={{ height: 'clamp(300px, 50vh, 600px)', overflowY: 'auto' }} />
                </div>
                <label>Image (optional)</label>
                <input type="file" accept="image/*" onChange={e => handleFileChange(e, setPoemForm)} />
                <input type="text" placeholder="Image Credit (e.g. Photo by John Doe)" value={poemForm.imageCredit || ''} onChange={e => setPoemForm({...poemForm, imageCredit: e.target.value})} />
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
                  <Editor value={intermissionForm.content} onChange={e => setIntermissionForm({...intermissionForm, content: e.target.value})} style={{ height: 'clamp(300px, 50vh, 600px)', overflowY: 'auto' }} />
                </div>
                <div style={{ background: 'white', color: 'black', margin: '1.5rem 0', minHeight: '300px' }}>
                  <label style={{color: '#111'}}>Content (EN)</label>
                  <Editor value={intermissionForm.contentEn} onChange={e => setIntermissionForm({...intermissionForm, contentEn: e.target.value})} style={{ height: 'clamp(300px, 50vh, 600px)', overflowY: 'auto' }} />
                </div>
                <label>Image (optional)</label>
                <input type="file" accept="image/*" onChange={e => handleFileChange(e, setIntermissionForm)} />
                <input type="text" placeholder="Image Credit (e.g. Photo by John Doe)" value={intermissionForm.imageCredit || ''} onChange={e => setIntermissionForm({...intermissionForm, imageCredit: e.target.value})} />
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
                  <Editor value={ventForm.content} onChange={e => setVentForm({...ventForm, content: e.target.value})} style={{ height: 'clamp(300px, 50vh, 600px)', overflowY: 'auto' }} />
                </div>
                <div style={{ background: 'white', color: 'black', margin: '1.5rem 0', minHeight: '300px' }}>
                  <label style={{color: '#111'}}>Content (EN)</label>
                  <Editor value={ventForm.contentEn} onChange={e => setVentForm({...ventForm, contentEn: e.target.value})} style={{ height: 'clamp(300px, 50vh, 600px)', overflowY: 'auto' }} />
                </div>
                <label>Cover Image (optional)</label>
                <input type="file" accept="image/*" onChange={e => handleFileChange(e, setVentForm)} />
                <input type="text" placeholder="Image Credit (e.g. Photo by John Doe)" value={ventForm.imageCredit || ''} onChange={e => setVentForm({...ventForm, imageCredit: e.target.value})} />
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
