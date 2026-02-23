import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Status from './components/Status';
import ReactMarkdown from 'react-markdown';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/links";

function App() {
  const [view, setView] = useState("dashboard");
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, label: "" });

  useEffect(() => { fetchLinks(); }, []);

  useEffect(() => {
    const pattern = new RegExp('^(https?:\\/\\/)([\\w.-]+\\.[a-z]{2,})(\\/\\S*)?$', 'i');
    setIsValidUrl(pattern.test(url));
  }, [url]);

  const fetchLinks = async () => {
    try {
      const res = await axios.get(`${API_URL}`);
      setLinks(res.data);
    } catch (err) { console.error("Failed to fetch links"); }
  };

  const addLink = async (e) => {
    e.preventDefault();
    if (links.length >= 8 || !isValidUrl) return;
    try {
      await axios.post(`${API_URL}/add`, { url, label: label || "New Link" });
      setUrl(""); setLabel("");
      fetchLinks();
    } catch (err) { alert("Error adding link."); }
  };

  const confirmDelete = (id, label) => { setDeleteModal({ show: true, id, label }); };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${deleteModal.id}`);
      setDeleteModal({ show: false, id: null, label: "" });
      fetchLinks();
    } catch (err) { alert("Delete failed"); }
  };

  const handleCheck = async (id) => {
    setLoadingId(id);
    try {
      await axios.post(`${API_URL}/check/${id}`);
      fetchLinks();
    } catch (err) { alert("Check failed: " + err.message); }
    setLoadingId(null);
  };

  if (view === "status") return <Status setView={setView} />;

  const isLimitReached = links.length >= 8;

  return (
    <div className="container">
      <nav>
        <div className="nav-brand">
          <h1>🌐 Web Monitor</h1>
          <p className="subtitle">AI-Powered Page Tracking</p>
        </div>
        <button onClick={() => setView("status")} className="nav-link">⚙️ System Health</button>
      </nav>

      <div className="info-bar">
        <span className="info-item"><b>1.</b> Add URLs</span>
        <span className="info-divider"></span>
        <span className="info-item"><b>2.</b> Click Check</span>
        <span className="info-divider"></span>
        <span className="info-item"><b>3.</b> View AI Diffs</span>
      </div>

      <section className="add-link">
        <h2>Add New Tracker</h2>
        <form onSubmit={addLink}>
          <div className="input-group">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={!isValidUrl && url !== "" ? "input-invalid" : ""}
              placeholder={isLimitReached ? "Slot limit reached" : "URL (https://...)"}
              required
              disabled={isLimitReached}
            />
            <div className="error-text">
              {!isValidUrl && url !== "" && "Format: https://example.com"}
            </div>
          </div>
          <div className="input-group">
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={isLimitReached ? "No more slots" : "Label (e.g. Docs)"}
              disabled={isLimitReached}
            />
          </div>
          <button type="submit" disabled={isLimitReached || !isValidUrl}>
            {isLimitReached ? "Full" : "Start Tracking"}
          </button>
        </form>
        <p className="limit-text" style={{ color: isLimitReached ? "#ef4444" : "var(--primary)" }}>
          {isLimitReached ? "⚠️ Maximum 8/8 trackers active." : `${links.length} / 8 slots used`}
        </p>
      </section>

      <section className="link-grid">
        {links.length === 0 && <p className="empty-state">No links added yet.</p>}
        {links.map(link => (
          <div key={link._id} className="link-card">
            <div className="card-header">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0 }}>{link.label}</h3>
                <button onClick={() => confirmDelete(link._id, link.label)} className="delete-btn">🗑️</button>
              </div>
              <code>{link.url}</code>
            </div>
            <button onClick={() => handleCheck(link._id)} disabled={loadingId === link._id} className="check-btn">
              {loadingId === link._id ? "🤖 Analyzing..." : "Check Now"}
            </button>
            {link.history && link.history.length > 0 ? (
              <div className="summary-section">
                <div className="summary-box">
                  <h4>✨ Analysis & Diff</h4>
                  <div className="summary-content"><ReactMarkdown>{link.history[0].summary}</ReactMarkdown></div>
                  <small className="timestamp">🕒 {new Date(link.history[0].timestamp).toLocaleString()}</small>
                </div>
              </div>
            ) : <p className="no-history">No data captured yet.</p>}
          </div>
        ))}
      </section>

      {deleteModal.show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Remove Tracker?</h3>
            <p>Are you sure you want to stop monitoring <b>{deleteModal.label}</b>?</p>
            <div className="modal-actions">
              <button onClick={() => setDeleteModal({ show: false, id: null, label: "" })} className="cancel-btn">Cancel</button>
              <button onClick={handleDelete} className="confirm-delete-btn">Delete Tracker</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;