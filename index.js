// BACKEND: Express App
// File: backend/index.js
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

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