import express from 'express';
import morgan from 'morgan'; // logging middleware
import cors from 'cors';
import multer from 'multer';
import path from 'path';
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
  getTopics,
  createChallenge,
  getImages, 
  getDocuments,
  getAudio,
  updateGroup,
  addMaterial,
  deleteMaterial
} from './dao-DSA.mjs';

const app = express();
const port = 3001;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors()); // Enable CORS for all routes
app.use(express.static('public'));

// Configurazione Multer per salvare le immagini nella cartella "uploads"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    console.log("File ricevuto:", file.originalname);
    console.log("Mimetype:", file.mimetype);
    console.log("Estensione:", path.extname(file.originalname).toLowerCase());


    // Permettiamo immagini, audio e documenti
    const filetypes = /jpeg|jpg|png|pdf|doc|docx|mp3|wav|mpeg/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    console.log("Mimetype ricevuto:", file.mimetype);
    console.log("Mimetype valido?", mimetype);
    console.log("Estensione valida?", extname);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('File format not allowed!'));
  }
});

//Get all groups
app.get('/groups', async (req, res) => {
  try {
    const groups = await getAllGroups(db);
    res.json(groups);
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

app.post('/group', upload.single('image'), async (req, res) => {
  try {
    const { name, level, university, specialNeeds, description, maxParticipants, joined } = req.body;
    const picture = req.file ? req.file.filename : 'default.png';
    
    const groupId = await addGroup(
      db,
      name,
      level,
      university,
      specialNeeds,
      description,
      picture,
      parseInt(maxParticipants) || 0,
      joined
    );

    res.status(201).json({ groupId, message: 'Group created successfully' });
  } catch (err) {
    console.error(err);
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

app.put('/groups/:id', async (req, res) => {
  const { id } = req.params;
  const group = req.body;
  
  console.log("Before DAO call");
  try {
    console.log("Calling DAO with:", { id, ...group });
    await updateGroup(db, { id, ...group });
    console.log("After DAO call");
    res.status(200).json({ message: 'Group updated successfully' });
  } catch (err) {
    console.error("Route error:", err);
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

app.post('/create-challenge', (req, res) => {
  const challenge = req.body;
  console.log("Server challenge:",challenge);
  createChallenge(db, challenge);
  res.status(201).json(challenge);
});

app.get('/topics/:study_group_id', async (req, res) => {
  const study_group_id = req.params.study_group_id; 
  try {
      const topics = await getTopics(db, study_group_id); // Recuperiamo i topic dal database
      res.json(topics); // Inviamo i topic come risposta JSON
  } catch (err) {
      res.status(500).json({ error: err.message }); // Gestione degli errori
  }
});


app.get('/material/images/:group_id', async (req, res) => { 
  const group_id = req.params.group_id;  
  console.log(`Fetching images for group ID: ${group_id}`); 
  try { 
      const images = await getImages(db, group_id);  
      console.log('Images retrieved:', images); 
      res.json(images);  
  } catch (err) { 
      console.error('Error fetching images:', err); 
      res.status(500).json({ error: err.message });  
  } 
}); 

app.get('/material/documents/:group_id', async (req, res) => { 
  const group_id = req.params.group_id;  
  console.log(`Fetching Document for group ID: ${group_id}`); 
  try { 
      const documents = await getDocuments(db, group_id);  
      console.log('Document retrieved:', documents); 
      res.json(documents);  
  } catch (err) { 
      console.error('Error fetching document:', err); 
      res.status(500).json({ error: err.message });  
  } 
});  
 


app.get('/material/audio/:group_id', async (req, res) => {
  const group_id = req.params.group_id; 
  console.log(`Fetching audio for group ID: ${group_id}`);
  try {
      const audio = await getAudio(db, group_id); 
      console.log('Audio retrieved:', audio);
      res.json(audio); 
  } catch (err) {
      console.error('Error fetching images:', err);
      res.status(500).json({ error: err.message }); 
  }
});




app.post('/material', upload.single('file'), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ error: "Nessun file caricato" });
    }

    const { group_id, type } = req.body;
    const filename = req.file.filename; // Nome del file salvato

    const material = await addMaterial(
      db, 
      group_id, 
      filename, 
      type
    );

    res.status(201).json({ 
      message: 'Material added successfully', 
      material: {
        ...material,
        name: `http://localhost:${port}/${filename}` // URL completo del file
      }
    });
  } catch (err) {
    console.error("Route error:", err);
    res.status(500).json({ error: err.message });
  }
});

//elimina materiali 
app.delete('/material/:id', async (req, res) => {
  const material_id = req.params.id;
  try {
    const result = await deleteMaterial(material_id);
    
    if (result === 0) {
      // Materiale non trovato
      console.error(`Material with id ${material_id} not found`);
      return res.status(404).json({ error: 'Material not found' });
    }
    
    res.status(200).json({ message: 'Material deleted successfully' });
  } catch (err) {
    // Log dell'errore
    console.error('Error while deleting material:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
