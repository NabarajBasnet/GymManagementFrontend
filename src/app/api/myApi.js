import express from 'express';

const app = express();

// Define a simple GET endpoint
app.get('/api/my-endpoint', (req, res) => {
    res.json({ message: 'Hello from Express on Vercel!' });
});

// Export the function for Vercel
export default (req, res) => {
    app(req, res);
};
