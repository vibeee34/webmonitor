require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const monitorRoutes = require('./routes/monitor');
const { getSummary } = require('./services/aiService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('MongoDB Connection Error:', err));

app.use('/api/links', monitorRoutes);

app.get('/api/links/status/health', async (req, res) => {
    const healthStatus = {
        database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
        gemini: "Checking"
    };

    try {
        await getSummary("ping", "ping");
        healthStatus.gemini = "Connected";
    } catch (e) {
        const errorMsg = e.message?.toLowerCase() || "";
        if (errorMsg.includes("quota") || errorMsg.includes("429")) {
            healthStatus.gemini = "Quota Exceeded";
        } else {
            healthStatus.gemini = "Disconnected";
        }
    }

    if (healthStatus.database === "Connected" && healthStatus.gemini === "Connected") {
        healthStatus.overall = "Online";
    } else {
        healthStatus.overall = "Degraded";
    }

    res.json(healthStatus);
});

app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Server Error' });
});

app.listen(PORT, () => console.log(`Port: ${PORT}`));