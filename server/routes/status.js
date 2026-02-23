router.get('/health', async (req, res) => {
    const status = {
        backend: "UP",
        database: mongoose.connection.readyState === 1 ? "CONNECTED" : "DISCONNECTED",
        llm: "CHECKING..."
    };
    try {
        await getSummary("test", "test");
        status.llm = "CONNECTED";
    } catch (e) {
        status.llm = "ERROR";
    }
    res.json(status);
});