// Simple webhook test script
const express = require('express');
const app = express();
const PORT = 3001; // Different port for testing

app.get('/webhook', (req, res) => {
    console.log('Webhook verification request received:');
    console.log('Query params:', req.query);
    
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    
    console.log('Mode:', mode);
    console.log('Token received:', token);
    console.log('Expected token: myverifytoken123');
    console.log('Challenge:', challenge);
    
    if (mode === 'subscribe' && token === 'myverifytoken123') {
        console.log('✅ Webhook verified successfully!');
        res.status(200).send(challenge);
    } else {
        console.log('❌ Webhook verification failed');
        console.log('Mode check:', mode === 'subscribe');
        console.log('Token check:', token === 'myverifytoken123');
        res.status(403).send('Forbidden');
    }
});

app.listen(PORT, () => {
    console.log(`Test webhook server running on port ${PORT}`);
    console.log('Use this for debugging webhook issues');
});
