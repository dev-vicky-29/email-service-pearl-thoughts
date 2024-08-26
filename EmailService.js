class EmailService {
    constructor(provider1, provider2) {
      this.providers = [provider1, provider2]; // Mock providers
      this.currentProvider = 0; // Start with the first provider
      this.retryLimit = 3; // Retry limit for sending emails
      this.rateLimit = 10; // Number of emails per minute
      this.rateLimitCounter = 0; // To track sent emails
      this.sentEmails = new Set(); // For idempotency
    }
  
    async sendEmail(emailData) {
      const { to, subject, body } = emailData;
      const emailHash = `${to}-${subject}-${body}`; // Create unique hash for idempotency
  
      // Idempotency check
      if (this.sentEmails.has(emailHash)) {
        return { status: 'Duplicate email' }; // Prevent duplicate email
      }
  
      // Rate limiting
      if (this.rateLimitCounter >= this.rateLimit) {
        return { status: 'Rate limit exceeded' }; // Return error when rate limit exceeded
      }
  
      let attempts = 0;
      let success = false;
  
      while (attempts < this.retryLimit && !success) {
        try {
          await this.providers[this.currentProvider].send(emailData); // Attempt to send email
          this.sentEmails.add(emailHash); // Store sent email for idempotency
          this.rateLimitCounter++; // Increment rate limit counter
          success = true;
          return { status: 'Email sent successfully' }; // Email sent successfully
        } catch (error) {
          attempts++;
          console.log(`Attempt ${attempts} failed, retrying...`);
          await this.exponentialBackoff(attempts); // Wait before retry
        }
      }
  
      // Fallback mechanism: switch providers if the retries failed
      if (!success) {
        this.switchProvider();
        return this.sendEmail(emailData); // Retry with the fallback provider
      }
  
      return { status: 'Failed to send email after retries' };
    }
  
    // Exponential backoff logic
    async exponentialBackoff(attempt) {
      const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
      return new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  
    // Provider fallback
    switchProvider() {
      this.currentProvider = (this.currentProvider + 1) % this.providers.length;
      console.log('Switching to fallback provider');
    }
  }
  
  module.exports = EmailService;
  