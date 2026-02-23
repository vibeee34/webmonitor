# AI Logic & Implementation

### 🤖 The Brain: Google Gemini
This project uses the `gemini-1.5-flash` model to analyze website content.

### 🔄 The Comparison Flow
1. **Scraping:** The backend fetches the raw HTML of a target URL.
2. **Comparison:** The system retrieves the previously saved version from MongoDB.
3. **Prompting:** The AI is given both versions and asked: 
   *"Identify only the meaningful changes in content, ignoring ads, headers, or timestamps."*
4. **Summary:** The AI returns a concise summary which is displayed on the user's dashboard.

### 🧪 Challenges Solved
* **Content Noise:** Filtering out changing timestamps and dynamic ads to prevent "fake" change alerts.
* **Token Limits:** Cleaning HTML tags before sending them to the AI to stay within free tier limits.