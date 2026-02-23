const mongoose = require('mongoose');

const checkSchema = new mongoose.Schema({
    content: String,
    summary: String,
    timestamp: { type: Date, default: Date.now }
});

const linkSchema = new mongoose.Schema({
    url: {
        type: String,
        required: [true, "URL is required"],
        trim: true
    },
    label: { type: String, default: "My Link" },
    history: [checkSchema] // This stores the last 5 checks
});

// IMPORTANT: This line must be exactly like this
module.exports = mongoose.model('Link', linkSchema);