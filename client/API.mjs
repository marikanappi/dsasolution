// Base URL of your server (adjust if needed)
const BASE_URL = 'http://localhost:3001';

// Function to fetch all groups
async function getAllGroups() {
  try {
    const response = await fetch(`${BASE_URL}/groups`);
    if (!response.ok) {
      throw new Error('Failed to fetch groups');
    }
    const groups = await response.json();
    return groups;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Function to fetch groups by label
async function getGroupsByLabel(label) {
  try {
    const response = await fetch(`${BASE_URL}/groups/label/${label}`);
    if (!response.ok) {
      throw new Error('Failed to fetch groups by label');
    }
    const groups = await response.json();
    return groups;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Function to join a group
async function joinGroup(id) {
  try {
    const response = await fetch(`${BASE_URL}/groups/join/${id}`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to join the group');
    }
    const result = await response.json();
    console.log(result.message);
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Function to leave a group
async function leaveGroup(id) {
  try {
    const response = await fetch(`${BASE_URL}/groups/leave/${id}`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to leave the group');
    }
    const result = await response.json();
    console.log(result.message);
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Function to add a new group
async function addGroup(group) {
  try {
    const response = await fetch(`${BASE_URL}/group`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(group),
    });
    if (!response.ok) {
      throw new Error('Failed to add group');
    }
    const result = await response.json();
    console.log('Group added with ID:', result.groupId);
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Function to fetch a group by name
async function getGroupByName(name) {
  try {
    const response = await fetch(`${BASE_URL}/groups/${name}`);
    if (!response.ok) {
      throw new Error('Failed to fetch group');
    }
    const group = await response.json();
    return group;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Function to fetch a group by SLD
async function getGroupBySLD(SLD) {
  try {
    const response = await fetch(`${BASE_URL}/groups/sld/${SLD}`);
    if (!response.ok) {
      throw new Error('Failed to fetch group by SLD');
    }
    const group = await response.json();
    return group;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getChallenge(groupId) {
  try {
    const response = await fetch(`${BASE_URL}/challenges/${groupId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch challenges for the group');
    }
    const challenges = await response.json();
    return challenges;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getQuestions(challengeId) {
  try {
    const response = await fetch(`${BASE_URL}/questions/${challengeId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch questions for the challenge');
    }
    const questions = await response.json();
    return questions;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getAnswers(questionId) {
  try{
    const response = await fetch(`${BASE_URL}/answers/${questionId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch answers for the question');
    }
    const answers = await response.json();
    return answers;
  }
  catch (err) {
    console.error(err);
    return null;
  }}

// Carica i messaggi dal server
async function getMessages() {
  try {
    const response = await fetch(`${BASE_URL}/messages`);
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }
    const messages = await response.json();
    return messages;
  } catch (err) {
    console.error(err);
    return null;
  }
}

//agiungi messaggio
async function addMessage(message) {
  try {
    const response = await fetch(`${BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    if (!response.ok) {
      throw new Error('Failed to add message');
    }
    const result = await response.json();
    console.log('Message added with ID:', result.messageId);
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function createChallenge(challenge) {
  console.log(challenge);
  try {
    const response = await fetch(`${BASE_URL}/create-challenge`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(challenge),  
    });
    if (!response.ok) {
        throw new Error('Failed to create challenge');
    }
    const result = await response.json();
    return result;
    } catch (err) {
    console.error(err);
    return null;
}
}

async function getTopics (study_group_id) {
  try {
    const response = await fetch(`${BASE_URL}/topics/${study_group_id}`);
    console.log('Group id:', study_group_id);
    console.log('Response:', response);
    if (!response.ok) {
      throw new Error('Failed to fetch topics');
    }
    const topics = await response.json();
    return topics;
  } catch (err) {
    console.error(err);
    return null;
  }
}
//function to add image from pc
async function addImage(formData) {
  try {
    const response = await fetch(`${BASE_URL}/material`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to add image');
    }
    const result = await response.json();
    console.log('Image added with ID:', result.imageId);
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getImage(group_id) {
  try {
    console.log(`Fetching images for group ID: ${group_id}`);
    const response = await fetch(`${BASE_URL}/material/images/${group_id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch images: ${response.statusText}`);
    }
    const images = await response.json();
    console.log('Images:', images);
    return images;
  } catch (err) {
    console.error('Error fetching images:', err);
    return null;
  }
}

async function getDocument(group_id) {
  try {
    console.log(`Fetching document for group ID: ${group_id}`);
    const response = await fetch(`${BASE_URL}/material/documents/${group_id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch document: ${response.statusText}`);
    }
    const document = await response.json();
    console.log('Document:', document);
    return document;
  } catch (err) {
    console.error('Error fetching document:', err);
    return null;
  }
}

async function getAudio(group_id) {
  try {
    console.log(`Fetching audio for group ID: ${group_id}`);
    const response = await fetch(`${BASE_URL}/material/${group_id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch audio: ${response.statusText}`);
    }
    const audio = await response.json();
    console.log('Audio:', audio);
    return audio;
  } catch (err) {
    console.error('Error fetching audio:', err);
    return null;
  }
}



export {
  getAllGroups,
  getGroupsByLabel,
  joinGroup,
  leaveGroup,
  addGroup,
  getGroupByName,
  getGroupBySLD,
  getChallenge,
  getQuestions,
  getAnswers,
  getMessages,
  addMessage,
  createChallenge,
  getTopics,
  addImage,
  getImage,
  getDocument,
  getAudio,
};


