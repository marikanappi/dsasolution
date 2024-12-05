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


async function getUsers() {
  try {
    const response = await fetch(`${BASE_URL}/users`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const users = await response.json();
    return users;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Function to fetch all challenges
async function getChallenges() {
  try {
    const response = await fetch(`${BASE_URL}/challenges`);
    if (!response.ok) {
      throw new Error('Failed to fetch challenges');
    }
    const challenges = await response.json();
    return challenges;
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
async function addGroup(name, level, university, SLD, description, picture, number_of_participants, joined) {
  try {
    const response = await fetch(`${BASE_URL}/groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, level, university, SLD, description, picture, number_of_participants, joined }),
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

export {
  getAllGroups,
  getChallenges,
  getGroupsByLabel,
  joinGroup,
  leaveGroup,
  addGroup,
  getGroupByName,
  getGroupBySLD,
};


