/**
 * In-memory MongoDB lifecycle helpers for tests.
 * `connectTestDb` must set MONGO_URI before app/config modules read it.
 */
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod;

export const connectTestDb = async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri('navjyoti_test');
  await mongoose.connect(process.env.MONGO_URI);
  return mongoose.connection;
};

export const clearTestDb = async () => {
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map((c) => c.deleteMany({})));
};

export const closeTestDb = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongod) await mongod.stop();
};
