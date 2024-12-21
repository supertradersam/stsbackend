// BACKEND: Express App
// File: backend/index.js
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/save', async (req, res) => {
  const { date, amount } = req.body;
  const userId = 'testUser'; // Replace with actual user authentication
  await db
    .collection('users')
    .doc(userId)
    .collection('transactions')
    .doc(date)
    .set({ amount });
  res.send({ success: true });
});

app.get('/api/transactions', async (req, res) => {
  const userId = 'testUser'; // Replace with actual user authentication
  const snapshot = await db
    .collection('users')
    .doc(userId)
    .collection('transactions')
    .get();
  const data = {};
  snapshot.forEach((doc) => (data[doc.id] = doc.data()));
  res.send(data);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));