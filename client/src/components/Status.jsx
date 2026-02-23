import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/links";

function Status({ setView }) {
    const [health, setHealth] = useState({ database: 'Checking', gemini: 'Checking', overall: 'Checking' });
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const checkHealth = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/status/health`);
            setHealth(res.data);
        } catch (err) {
            setHealth({ database: "Disconnected", gemini: "Disconnected", overall: "Offline" });
        } finally {
            setLoading(false);
            setLastUpdated(new Date());
        }
    }, []);

    useEffect(() => { checkHealth(); }, [checkHealth]);

    return (
        <div className="container">
            <nav>
                <div className="nav-brand">
                    <h1>⚙️ System Health</h1>
                    <p className="subtitle">Backend & AI Connectivity Status</p>
                </div>
                <button onClick={() => setView("dashboard")} className="nav-link">
                    ← Back to Dashboard
                </button>
            </nav>

            <div className="status-container">
                <div className="link-card status-card">
                    <div className={`status-banner banner-${health.overall.toLowerCase()}`}>
                        <div className="status-flex">
                            <span className={`dot ${health.overall === 'Online' ? 'dot-online' : 'dot-offline'}`}></span>
                            <h4 className={health.overall === 'Online' ? 'text-accent' : 'text-error'}>
                                System is {health.overall}
                            </h4>
                        </div>
                    </div>

                    <div className="diagnostics-list">
                        <div className="diag-item">
                            <label className="diag-label">DATABASE CONNECTION</label>
                            <p className={health.database === "Connected" ? 'text-accent' : 'text-error'}>
                                ● {health.database}
                            </p>
                        </div>

                        <div className="diag-item">
                            <label className="diag-label">AI SERVICE (GEMINI)</label>
                            <p className={health.gemini === "Connected" ? 'text-accent' : 'text-error'}>
                                ● {health.gemini}
                            </p>
                        </div>
                    </div>

                    <button onClick={checkHealth} className="check-btn" disabled={loading}>
                        {loading ? "Checking..." : "Refresh Diagnostics"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Status;