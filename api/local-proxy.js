// seo-ai-tools/api/local-proxy.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3000; // Port the proxy will run on
const OLLAMA_TARGET = 'http://localhost:11434'; // Your local Ollama API endpoint

// Enable CORS for requests from your frontend domain (adjust if needed)
// For development, allowing all origins is often okay, but be stricter for production.
app.use(cors({ origin: '*' })); // Allow all origins for simplicity

// Proxy endpoint for Ollama generate
app.use('/api/ollama', createProxyMiddleware({
    target: OLLAMA_TARGET,
    changeOrigin: true, // Needed for virtual hosted sites
    pathRewrite: {
        '^/api/ollama': '/api', // Rewrite '/api/ollama/generate' to '/api/generate' for Ollama
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request from ${req.ip} to ${OLLAMA_TARGET}${proxyReq.path}`);
        // Remove body-parser added headers if they cause issues with Ollama
        if (req.body) {
            let bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Type','application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
        }
    },
    onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        res.writeHead(500, {
            'Content-Type': 'text/plain',
        });
        res.end('Proxy error occurred.');
    }
}));

app.listen(PORT, () => {
    console.log(`CORS Proxy for Ollama running on http://localhost:${PORT}`);
    console.log(`Frontend should call: http://localhost:${PORT}/api/ollama/generate`);
});

// Basic root response to check if the proxy server is running
app.get('/', (req, res) => {
    res.send('Ollama CORS Proxy is running.');
});
