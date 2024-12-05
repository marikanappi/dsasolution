import express from 'express';
import morgan from 'morgan'; // logging middleware
import cors from 'cors';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import db from './db.mjs'; // Assuming db is correctly exported from db.mjs
import { 
  getAllGroups,  
  getChallenges, 
  getGroupByLabel, 
  leaveGroup, 
  joinGroup, 
  addGroup, 
  getGroupById, 
  getGroupBySLD, 
} from './dao-DSA.mjs';

const app = express();
const port = 3001;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors()); // Enable CORS for all routes

// Setup express-session
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

// Passport setup
passport.use(new LocalStrategy(
  (username, password, done) => {
    // You can implement user authentication logic here
    getUserByLevel(db, username).then(user => {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      // Assume password validation happens here
      return done(null, user);
    }).catch(err => done(err));
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id); // Store the user's ID in the session
});

passport.deserializeUser((id, done) => {
  // Retrieve user details from database based on ID
  getUsers(db).then(users => {
    const user = users.find(u => u.id === id);
    done(null, user);
  }).catch(err => done(err));
});

app.use(passport.initialize());
app.use(passport.session());

// Routes

// Get all groups
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

// Get all challenges
app.get('/challenges', async (req, res) => {
  try {
    const challenges = await getChallenges(db);
    res.json(challenges);
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

// User login (using passport local strategy)
app.post('/login', passport.authenticate('local', {
  successRedirect: '/profile', // Redirect to profile page on successful login
  failureRedirect: '/login',   // Redirect to login page on failure
}));

// User profile route (protected)
app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
