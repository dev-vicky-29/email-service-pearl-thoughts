const express = require('express');
const bodyParser = require('body-parser');
const EmailService = require('./services/EmailService');
const MockProvider = require('./services/MockProvider');

const app = express();
app.use(bodyParser.json());

// Mock Email Providers
const provider1 = new MockProvider('Provider1');
const provider2 = new MockProvider('Provider2');

// Initialize Email Service with Providers
const emailService = new EmailService(provider1, provider2);

// API Endpoint to send email
app.post('/api/send-email', async (req, res) => {
  const emailData = req.body;  // Get email data from the request body
  try {
    const result = await emailService.sendEmail(emailData);  // Send email using EmailService
    res.json(result);  // Return success response
  } catch (error) {
    res.status(500).json({ error: error.message });  // Handle errors
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
