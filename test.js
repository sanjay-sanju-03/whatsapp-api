const axios = require('axios');

// Test configuration
const SERVER_URL = 'http://localhost:3000';

// Test message data
const testMessage = {
    to: '918891549779', // Replace with your verified phone number (include country code, no + sign)
    message: 'Hello! This is a test message from WhatsApp API integration. How are you doing today? Please reply to test word count!'
};

// Function to test sending a message
async function testSendMessage() {
    try {
        console.log('Testing message sending...');
        console.log('Message:', testMessage.message);
        console.log('Word count:', testMessage.message.trim().split(/\s+/).length);
        
        const response = await axios.post(`${SERVER_URL}/send-message`, testMessage);
        
        console.log('✅ Message sent successfully!');
        console.log('Response:', response.data);
    } catch (error) {
        console.error('❌ Error sending message:');
        console.error(error.response?.data || error.message);
    }
}

// Function to test health endpoint
async function testHealth() {
    try {
        console.log('Testing health endpoint...');
        const response = await axios.get(`${SERVER_URL}/health`);
        console.log('✅ Health check passed!');
        console.log('Response:', response.data);
    } catch (error) {
        console.error('❌ Health check failed:');
        console.error(error.response?.data || error.message);
    }
}

// Function to test word counting
function testWordCount() {
    console.log('Testing word count function...');
    
    const testTexts = [
        'Hello world',
        'This is a longer message with multiple words',
        '',
        '   ',
        'Single',
        'Hello   world   with   extra   spaces'
    ];
    
    testTexts.forEach(text => {
        const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
        console.log(`Text: "${text}" -> Word count: ${wordCount}`);
    });
}

// Main test function
async function runTests() {
    console.log('🚀 Starting WhatsApp API Integration Tests\n');
    
    // Test word counting
    testWordCount();
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test health endpoint
    await testHealth();
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test message sending (update phone number first!)
    console.log('⚠️  Update the phone number in testMessage object before running this test');
    console.log('   Current phone number:', testMessage.to);
    console.log('   To test message sending, uncomment the line below:');
    console.log('   // await testSendMessage();');
    
    // Uncomment the line below to test actual message sending
    // await testSendMessage();
    
    console.log('\n✅ Tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = {
    testSendMessage,
    testHealth,
    testWordCount,
    runTests
};
