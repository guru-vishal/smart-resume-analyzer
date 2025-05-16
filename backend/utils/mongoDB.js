const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017';  // Replace with your MongoDB connection string
const dbName = 'smart_resume_analyzer';   // Replace with your DB name

let client;
let db;

async function connect() {
  if (!client) {
    client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    db = client.db(dbName);
  }
  return db;
}

const mongoDB = {
  // Users Collection

  async findUserByEmail(email) {
    const db = await connect();
    return db.collection('users').findOne({ email });
  },

  async findUserById(id) {
    const db = await connect();
    if (!ObjectId.isValid(id)) return null;
    return db.collection('users').findOne({ _id: new ObjectId(id) });
  },

  async addUser(user) {
    const db = await connect();
    const result = await db.collection('users').insertOne(user);
    return result.ops ? result.ops[0] : null;
  },

  async updateUser(email, updateData) {
    const db = await connect();
    const result = await db.collection('users').findOneAndUpdate(
      { email },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    return result.value;
  },

  async deleteUser(email) {
    const db = await connect();
    return db.collection('users').deleteOne({ email });
  },

  // Resume Collection

  async findResumeByEmail(email) {
    const db = await connect();
    return db.collection('resumes').findOne({ email });
  },

  async updateResume(email, filePath, extractedText) {
    const db = await connect();
    const newResumeData = {
      email,
      filePath,
      extractedText,
      uploadDate: new Date().toISOString(), // Use full ISO timestamp for more precision
    };
    const result = await db.collection('resumes').findOneAndUpdate(
      { email },
      { $set: newResumeData },
      { upsert: true, returnDocument: 'after' }
    );
    return result.value;
  },

  async deleteResume(email) {
    const db = await connect();
    return db.collection('resumes').deleteOne({ email });
  },

  // Scores Collection

  async findScoreByEmail(email) {
    const db = await connect();
    return db.collection('scores').findOne({ email });
  },

  async updateScore(email, score, skills) {
    const db = await connect();
    const newScoreData = {
      email,
      score,
      skills,
      lastUpdated: new Date().toISOString(), // Use full ISO timestamp
    };
    const result = await db.collection('scores').findOneAndUpdate(
      { email },
      { $set: newScoreData },
      { upsert: true, returnDocument: 'after' }
    );
    return result.value;
  },

  async deleteScore(email) {
    const db = await connect();
    return db.collection('scores').deleteOne({ email });
  },

  // Get leaderboard sorted by score descending with user info
  async getLeaderboard() {
    const db = await connect();
    const leaderboard = await db.collection('scores').aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'email',
          foreignField: 'email',
          as: 'userInfo',
        },
      },
      {
        $unwind: {
          path: '$userInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          email: 1,
          score: 1,
          lastUpdated: 1,
          name: { $ifNull: ['$userInfo.name', 'Anonymous'] },
        },
      },
      {
        $sort: { score: -1 },
      },
    ]).toArray();

    return leaderboard;
  },
};

module.exports = mongoDB;
