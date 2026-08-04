import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-wysiwyg';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBookOpen, FaTicketAlt, FaFileAlt, FaArrowUp, FaArrowDown, FaImage, FaStickyNote } from 'react-icons/fa';
import api from '../api';

function AdminDashboard() {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [password, setPassword] = useState('');
  
  const [chapters, setChapters] = useState([]);
  const [poems, setPoems] = useState([]);
  
  const [newChapterTitle, setNewChapterTitle] = useState('');
  
  const [poemForm, setPoemForm] = useState({ _id: null, title: '', content: '', chapterId: '', image: '' });
  const [isPoemModalOpen, setIsPoemModalOpen] = useState(false);

  const [intermissionForm, setIntermissionForm] = useState({ _id: null, title: '', content: '', image: '', isIntermission: true });
  const [isIntermissionModalOpen, setIsIntermissionModalOpen] = useState(false);

  const [ventForm, setVentForm] = useState({ _id: null, title: '', content: '', image: '', isVent: true });
  const [isVentModalOpen, setIsVentModalOpen] = useState(false);

  const [chapterForm, setChapterForm] = useState({ _id: null, title: '', image: '', theme: 'winter' });
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);

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
    setChapterForm({ _id: c._id, title: c.title, image: c.image || '', theme: c.theme || 'winter' });
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
    setPoemForm({ _id: null, title: '', content: '', chapterId: chapterId, image: '' });
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
    setIntermissionForm({ _id: null, title: '', content: '', image: '', isIntermission: true });
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
    setVentForm({ _id: null, title: '', content: '', image: '', isVent: true });
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h2>Anthology Structure</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
        <button onClick={() => { setChapterForm({ _id: null, title: '', image: '', theme: 'winter' }); setIsChapterModalOpen(true); }} style={{ padding: '0.5rem 1rem' }}>
          + Add Chapter
        </button>
        <button onClick={openIntermissionModalForNew} style={{ background: 'var(--text-color)', color: 'var(--bg-color)' }}>
          + Add Intermission
        </button>
        <button onClick={openVentModalForNew} style={{ background: '#fdfd96', color: '#111', border: '1px solid #111' }}>
          + Add Vent
        </button>
      </div>

      <ul className="admin-list" style={{ padding: 0 }}>
        {chapters.map((c, index) => (
          <li key={c._id} style={{ display: 'block', padding: 0, marginBottom: '2rem', border: 'none' }}>
            
            <div style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              padding: '1rem', background: 'var(--border-color)', borderRadius: '4px' 
            }}>
              <strong style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {c.isIntermission ? <><FaTicketAlt /> Intermission: {c.title}</> : c.isVent ? <><FaStickyNote /> Vent: {c.title}</> : <><FaBookOpen /> Chapter: {c.title}</>}
                {c.image && <FaImage title="Has Image" style={{ marginLeft: '0.5rem', color: '#888' }} />}
              </strong>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button onClick={() => moveChapter(index, 'up')} style={{ padding: '0.3rem 0.6rem', fontSize: '0.9rem' }} title="Move Up"><FaArrowUp /></button>
                <button onClick={() => moveChapter(index, 'down')} style={{ padding: '0.3rem 0.6rem', fontSize: '0.9rem' }} title="Move Down"><FaArrowDown /></button>
                {c.isIntermission ? (
                  <button onClick={() => openIntermissionModalForEdit(c)} style={{ padding: '0.2rem 0.5rem', marginRight: '0.5rem', fontSize: '0.8rem' }}>Edit</button>
                ) : c.isVent ? (
                  <button onClick={() => openVentModalForEdit(c)} style={{ padding: '0.2rem 0.5rem', marginRight: '0.5rem', fontSize: '0.8rem' }}>Edit</button>
                ) : (
                  <button onClick={() => openChapterModalForEdit(c)} style={{ padding: '0.2rem 0.5rem', marginRight: '0.5rem', fontSize: '0.8rem' }}>Edit Theme</button>
                )}
                <button onClick={() => deleteChapter(c._id)} style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>Delete</button>
              </div>
            </div>

            {!c.isIntermission && !c.isVent && (
              <div style={{ padding: '1rem 0 1rem 2rem', borderLeft: '2px solid var(--border-color)', marginLeft: '1rem' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {poems.filter(p => p.chapterId === c._id).map(p => (
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
                  {poems.filter(p => p.chapterId === c._id).length === 0 && (
                    <li style={{ fontStyle: 'italic', color: '#888', padding: '0.5rem 0', borderBottom: 'none' }}>No poems in this chapter.</li>
                  )}
                </ul>
                <button onClick={() => openPoemModalForNew(c._id)} style={{ marginTop: '1rem', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                  + Add Poem Here
                </button>
              </div>
            )}
          </li>
        ))}
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
                <input type="text" placeholder="Chapter Title" value={chapterForm.title} onChange={e => setChapterForm({...chapterForm, title: e.target.value})} required />
                
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
                <input type="text" placeholder="Poem Title" value={poemForm.title} onChange={e => setPoemForm({...poemForm, title: e.target.value})} required />
                
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

                <div style={{ background: 'white', color: 'black', marginBottom: '1.5rem', minHeight: '400px' }}>
                  <Editor value={poemForm.content} onChange={e => setPoemForm({...poemForm, content: e.target.value})} style={{ height: '400px' }} />
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
                <input type="text" placeholder="Intermission Title (e.g. Stop 1: Nowhere)" value={intermissionForm.title} onChange={e => setIntermissionForm({...intermissionForm, title: e.target.value})} required />
                
                <label>Transport Type</label>
                <select value={intermissionForm.theme || 'plane'} onChange={e => setIntermissionForm({...intermissionForm, theme: e.target.value})} required>
                  <option value="plane">Plane (Midnight Radar)</option>
                  <option value="train">Train (Metro Map)</option>
                  <option value="bus">Bus (Highway)</option>
                  <option value="train-cherry">Train (Cherry Yum Yum)</option>
                </select>

                <div style={{ background: 'white', color: 'black', margin: '1.5rem 0', minHeight: '400px' }}>
                  <Editor value={intermissionForm.content} onChange={e => setIntermissionForm({...intermissionForm, content: e.target.value})} style={{ height: '400px' }} />
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
                <input type="text" placeholder="Vent Title (e.g. Brain Dump 1)" value={ventForm.title} onChange={e => setVentForm({...ventForm, title: e.target.value})} required />
                
                <label>Vent Aesthetic Theme</label>
                <select value={ventForm.theme || 'notebook'} onChange={e => setVentForm({...ventForm, theme: e.target.value})} required>
                  <option value="notebook">Notebook (Stacked Pages)</option>
                  <option value="postits">Post-its (Scattered)</option>
                </select>

                <div style={{ background: 'white', color: 'black', margin: '1.5rem 0', minHeight: '400px' }}>
                  <Editor value={ventForm.content} onChange={e => setVentForm({...ventForm, content: e.target.value})} style={{ height: '400px' }} />
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
