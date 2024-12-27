import express from 'express';
import morgan from 'morgan'; // logging middleware
import cors from 'cors';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import db from './db.mjs'; // Assuming db is correctly exported from db.mjs
import { 
  getAllGroups,  
  getGroupByLabel, 
  leaveGroup, 
  joinGroup, 
  addGroup, 
  getGroupById, 
  getGroupBySLD, 
  getChallenges,
  getQuestions,
  getAnswers,
  addImages,
  getImages,
  
} from './dao-DSA.mjs';

const app = express();
const port = 3001;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors()); // Enable CORS for all routes
app.use(express.static('public'));

//Get all groups
app.get('/groups', async (req, res) => {
  try {
    const groups = await getAllGroups(db);
    console.log(groups);
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await getUsers(db);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get groups by label
app.get('/groups/label/:label', async (req, res) => {
  const { label } = req.params;
  try {
    const groups = await getGroupByLabel(db, label);
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Join group
app.post('/groups/join/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await joinGroup(db, id);
    res.status(200).json({ message: 'Group joined successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Leave group
app.post('/groups/leave/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await leaveGroup(db, id);
    res.status(200).json({ message: 'Group left successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add group
app.post('/groups', async (req, res) => {
  const { name, level, university, SLD, description, picture, number_of_participants, joined } = req.body;
  try {
    const groupId = await addGroup(db, name, level, university, SLD, description, picture, number_of_participants, joined);
    res.status(201).json({ groupId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get group by ID
app.get('/groups/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const group = await getGroupById(db, name);
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get group by SLD
app.get('/groups/sld/:SLD', async (req, res) => {
  const { SLD } = req.params;
  try {
    const group = await getGroupBySLD(db, SLD);
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/challenges/:groupId', async (req, res) => {
  const groupId = req.params.groupId;  // Correct reference to groupId
  try {
    const challenges = await getChallenges(db, groupId);
    
    if (challenges.length === 0) {
      return res.status(404).json({ error: "No challenges found for this group" });
    }

    res.json(challenges); // Return the challenges as JSON
  } catch (err) {
    console.error('Error fetching challenges:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get ('/questions/:challengeId', async (req, res) => {
  const challengeId = req.params.challengeId;
  try {
    const questions = await getQuestions(db, challengeId);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/answers/:questionId', async (req, res) => {
  const questionId = req.params.questionId;
  try {
    const answers = await getAnswers(db, questionId);
    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ottieni tutti i messaggi
app.get('/messages', (req, res) => {
  res.json(messages);
});

// Aggiungi un nuovo messaggio
app.post('/messages', (req, res) => {
  const newMessage = req.body;
  messages.push(newMessage);
  res.status(201).json(newMessage);
});

//aggiungi una nuova image in material 
app.post('/material', async (req, res) => {
  const { groupId, nome, tipo} = req.body;
  try {
    const imageId = await addImages(db, groupId, nome, tipo);
    res.status(201).json({ imageId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//prendi immagini in material dal gruppo 
app.get('/material/:materialId', async (req, res) => {
  const groupId = req.params.groupId;
  try {
    const images = await getImages(db, materialId);
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
