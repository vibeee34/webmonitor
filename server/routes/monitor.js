const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const Link = require('../models/LinkTemp');
const { getSummary } = require('../services/aiService');

router.get('/', async (req, res) => {
    try {
        const links = await Link.find().sort({ _id: -1 });
        res.json(links);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/add', async (req, res) => {
    try {
        const { url, label } = req.body;
        if (!url) return res.status(400).json({ error: "URL is required" });
        const newLink = new Link({ url, label: label || "New Monitor" });
        await newLink.save();
        res.json(newLink);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/check/:id', async (req, res) => {
    console.log(`🔍 Starting check for ID: ${req.params.id}`);
    try {
        const link = await Link.findById(req.params.id);
        if (!link) return res.status(404).json({ error: "Link not found" });

        console.log(`🌐 Scraping: ${link.url}`);
        const { data } = await axios.get(link.url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 10000
        });
        const $ = cheerio.load(data);
        $('script, style').remove();
        const currentContent = $('body').text().replace(/\s\s+/g, ' ').trim().substring(0, 5000);

        if (!link.history) link.history = [];
        const previousCheck = link.history.length > 0 ? link.history[0] : { content: "" };

        console.log("🤖 Sending to Gemini...");
        const summary = await getSummary(previousCheck.content, currentContent);

        link.history.unshift({
            content: currentContent,
            summary: summary,
            timestamp: new Date()
        });

        if (link.history.length > 5) link.history = link.history.slice(0, 5);

        await link.save();
        console.log("Check successful!");
        res.json(link);

    } catch (error) {
        console.error("ERROR IN CHECK ROUTE:", error.message);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Link.findByIdAndDelete(req.params.id);
        res.json({ message: "Link deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete" });
    }
});

module.exports = router;