const mongoose = require('mongoose');
require('dotenv').config();

const dbUrl = `mongodb://${process.env.DB_HOST || 'localhost'}:${
  process.env.DB_PORT || 27017
}/${process.env.DB_NAME || 'chatdb'}`;

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

async function checkDatabase() {
  try {
    await mongoose.connect(dbUrl);
    console.log('Connected to MongoDB');

    const messageCount = await Message.countDocuments();
    console.log(`Total messages: ${messageCount}`);

    if (messageCount > 0) {
      const recentMessages = await Message.find()
        .sort({ timestamp: -1 })
        .limit(3);

      console.log('\nRecent messages:');
      recentMessages.reverse().forEach((msg) => {
        const timestamp = msg.timestamp.toLocaleString();
        console.log(`[${timestamp}] ${msg.name}: ${msg.message}`);
      });
    }

  } catch (error) {
    console.error('Database connection failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkDatabase();
