# 📝 AI Prompt Engineering Log

This document tracks the specific prompts used to instruct the **Google Gemini API** for content analysis and diffing.

## 1. The Comparison Prompt
This prompt is used when a user clicks **"Check Now"**. It sends the old HTML and the new HTML to the AI.

**System Role:** > You are a web monitoring assistant. Your job is to compare two versions of website content and identify meaningful updates.

**The Prompt:**
> "I have two versions of a website's content. 
> 
> **Version A (Previous):** [Old Content]
> **Version B (Current):** [New Content]
> 
> Please analyze both and provide a concise summary of what has changed. 
> - Ignore navigation menus, footers, ads, and timestamps.
> - Focus on article headlines, main body text, or price changes.
> - If the content is identical, state: 'No meaningful changes detected.'
> - If this is the first time the content is being seen, provide a brief overview of the page's purpose."

## 2. Token Optimization Strategy
To stay within the Gemini Free Tier limits, we pre-process the HTML before sending it to the AI:
1. **Remove Scripts:** All `<script>` and `<style>` tags are stripped.
2. **Remove Boilerplate:** We target the `<main>` or `<article>` tags when possible.
3. **HTML to Text:** We convert the raw HTML to clean text to reduce the character count (token usage).

## 3. Error Handling Prompt
If the scraper returns an empty string or a 403 error, the AI is instructed to:
> "The website could not be reached or returned no content. Please explain that the site might be protected by a firewall or bot protection."