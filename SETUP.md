# WhatsApp Business API Setup Guide

## Step 1: Create Facebook Developer Account
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "WhatsApp Business API" product to your app

## Step 2: Get Your Credentials

### Phone Number ID
1. In your app dashboard, go to WhatsApp > Getting Started
2. Find "From phone number ID" - this is your WHATSAPP_PHONE_NUMBER_ID

### Access Token
1. In WhatsApp > Getting Started
2. Copy the temporary access token (24 hours)
3. For production, create a permanent token in System Users

### Example .env Configuration
```env
WHATSAPP_API_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=123456789012345
VERIFY_TOKEN=myverifytoken123
PORT=3000
```

## Step 3: Configure Webhook (for receiving messages)

### Local Development (using ngrok)
1. Install ngrok: `npm install -g ngrok`
2. Start your server: `npm start` (should already be running)
3. In another terminal: `ngrok http 3000` or `Start-Process -FilePath "ngrok" -ArgumentList "http", "3000"`
4. Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
5. In Facebook Developer Console:
   - Go to **WhatsApp → Configuration**
   - Click **"Edit"** in the Webhook section
   - **Webhook URL**: `https://YOUR_NGROK_URL.ngrok.io/webhook`
   - **Verify Token**: `1307967827417268` (from your .env file)
   - Click **"Verify and Save"**
   - **Subscribe to fields**: Check ✅ "messages"

### After Webhook Setup
- Send a message to your WhatsApp Business number
- Check your server logs for incoming webhook data
- The system will auto-reply with word count information

### Production Deployment
1. Deploy your app to a cloud service (Heroku, AWS, etc.)
2. Ensure HTTPS is enabled
3. Update webhook URL to your production domain

## Step 4: Test Phone Number
1. Add your test phone number in WhatsApp > Getting Started
2. Verify the phone number via SMS/call
3. Use this number for testing

## Step 5: Send Test Message
1. Update the phone number in test.js
2. Uncomment the test message line
3. Run: `npm test`

## Important Notes

### Phone Number Format
- Always include country code
- No + sign, spaces, or special characters
- Example: 1234567890 (for +1 234 567 8900)

### Rate Limits
- Business API has rate limits
- Test with your verified numbers first
- Review Meta's usage policies

### Production Considerations
- Apply for Business Verification
- Set up proper error handling
- Implement message templates for marketing
- Consider using WhatsApp Business Solution Providers (BSPs)

## Common Issues

### "Invalid phone number"
- Check format (country code + number, no spaces)
- Ensure number is registered with WhatsApp

### "Invalid access token"
- Regenerate token in Facebook Developer Console
- Check token hasn't expired

### "Webhook verification failed"
- Ensure VERIFY_TOKEN matches
- Check webhook URL is accessible via HTTPS

### "Message not delivered"
- Check recipient has WhatsApp installed
- Verify number is correct format
- Review API rate limits
