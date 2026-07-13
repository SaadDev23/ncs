import dns from 'dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dnsServers = process.env.MONGODB_DNS_SERVER ? process.env.MONGODB_DNS_SERVER.split(',').map(s => s.trim()) : ['8.8.8.8', '1.1.1.1'];
try {
  dns.setServers(dnsServers);
  console.log('Using DNS servers for MongoDB SRV lookup:', dnsServers);
} catch (dnsError) {
  console.warn('Could not set custom DNS servers, continuing with system DNS:', dnsError.message || dnsError);
}

const DB_URI = process.env.MONGODB_URI || 'mongodb+srv://dbuser:Password.123@ncs.6bqd9k0.mongodb.net/?retryWrites=true&w=majority';

if (!DB_URI) {
  throw new Error('MONGODB_URI is not defined. Set it in server/.env or your environment.');
}

async function connect() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database successfully connected');
  } catch (error) {
    console.error('Error connecting to the database:', error.message || error);
    throw error;
  }
}

export default connect;


// import { MongoMemoryServer } from 'mongodb-memory-server';

// async function connect() {
//   const mongod = await MongoMemoryServer.create();
//   const getUri = mongod.getUri();

//   mongoose.set('strictQuery', true)
//   const db = await mongoose.connect(getUri);
//   console.log("Database Connected");
//   return db;
// }

// export default connect; // Use export for ES6 modules
