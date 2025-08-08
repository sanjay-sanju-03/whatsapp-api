const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuration
const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// WhatsApp API Base URL
const WHATSAPP_API_URL = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

// Utility function to count words
function countWords(text) {
    if (!text || typeof text !== 'string') return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Function to send WhatsApp message
async function sendWhatsAppMessage(to, message) {
    try {
        const response = await axios.post(
            WHATSAPP_API_URL,
            {
                messaging_product: "whatsapp",
                to: to,
                type: "text",
                text: {
                    body: message
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${WHATSAPP_API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log('Message sent successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending message:', error.response?.data || error.message);
        throw error;
    }
}

// Webhook verification (required by WhatsApp)
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('Webhook verified successfully!');
            res.status(200).send(challenge);
        } else {
            res.status(403).send('Forbidden');
        }
    }
});

// Webhook to receive messages
app.post('/webhook', async (req, res) => {
    try {
        const body = req.body;
        
        if (body.object === 'whatsapp_business_account') {
            body.entry.forEach(async (entry) => {
                const changes = entry.changes;
                
                changes.forEach(async (change) => {
                    if (change.field === 'messages') {
                        const messages = change.value.messages;
                        
                        if (messages) {
                            messages.forEach(async (message) => {
                                const from = message.from;
                                const messageText = message.text?.body;
                                const messageId = message.id;
                                
                                console.log(`Received message from ${from}: ${messageText}`);
                                
                                if (messageText) {
                                    // Calculate word count
                                    const wordCount = countWords(messageText);
                                    
                                    console.log(`Word count: ${wordCount}`);
                                    
                                    // Store message data (you can save to database here)
                                    const messageData = {
                                        id: messageId,
                                        from: from,
                                        text: messageText,
                                        wordCount: wordCount,
                                        timestamp: new Date().toISOString()
                                    };
                                    
                                    console.log('Message data:', messageData);
                                    
                                    // Optional: Send an auto-reply with word count
                                    const replyMessage = `Thanks for your message! Your message contains ${wordCount} word${wordCount !== 1 ? 's' : ''}.`;
                                    await sendWhatsAppMessage(from, replyMessage);
                                }
                            });
                        }
                    }
                });
            });
        }
        
        res.status(200).send('OK');
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).send('Internal Server Error');
    }
});

// API endpoint to send a message
app.post('/send-message', async (req, res) => {
    try {
        const { to, message } = req.body;
        
        if (!to || !message) {
            return res.status(400).json({
                error: 'Phone number (to) and message are required'
            });
        }
        
        const result = await sendWhatsAppMessage(to, message);
        
        res.json({
            success: true,
            message: 'Message sent successfully',
            data: result,
            wordCount: countWords(message)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to send message',
            details: error.message
        });
    }
});

// API endpoint to get message statistics
app.get('/stats', (req, res) => {
    // This is a simple example - in production, you'd query from a database
    res.json({
        message: 'Message statistics endpoint',
        note: 'Implement database integration to store and retrieve message statistics'
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'WhatsApp API Integration'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'WhatsApp API Integration Server',
        endpoints: {
            'POST /send-message': 'Send a WhatsApp message',
            'POST /webhook': 'WhatsApp webhook endpoint',
            'GET /webhook': 'Webhook verification',
            'GET /stats': 'Message statistics',
            'GET /health': 'Health check'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`WhatsApp API server is running on port ${PORT}`);
    console.log(`Webhook URL: http://localhost:${PORT}/webhook`);
    console.log('Make sure to configure your WhatsApp Business API webhook URL');
});

module.exports = app;
