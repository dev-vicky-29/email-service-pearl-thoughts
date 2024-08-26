class MockProvider {
    constructor(name) {
      this.name = name;
    }
  
    async send(emailData) {
      return new Promise((resolve, reject) => {
        // Simulate a 50% success rate
        if (Math.random() > 0.5) {
          console.log(`Email sent via ${this.name}`);
          resolve();
        } else {
          console.log(`Email failed via ${this.name}`);
          reject(`Failed to send email via ${this.name}`);
        }
      });
    }
  }
  
  module.exports = MockProvider;
  