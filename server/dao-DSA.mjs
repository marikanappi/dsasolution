import { url } from 'inspector';
import db from './db.mjs';
import group from './DSAmodel.mjs';
import { Challenge, Answer, Question } from './DSAmodel.mjs';

// Funzione per ottenere tutti i gruppi
export function getAllGroups(db) {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM StudyGroups";
    
        db.all(query, [], (err, rows) => {
            if (err) {
                return reject(err); // Rifiutiamo la Promise se c'è un errore
            }
    
            let groups = rows.map(row => {
                return new group(
                    row.id, 
                    row.name, 
                    row.level, 
                    row.university, 
                    row.SLD, 
                    row.description, 
                    `http://localhost:3001/${row.picture}`, 
                    row.number_of_participants, 
                    row.joined,
                    row.usercreate
                );
            });
    
            resolve(groups); // Risolviamo la Promise con i gruppi ottenuti
        });
    });
}

// Funzione per ottenere i gruppi per un determinato label
export function getGroupByLabel(db, label) {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM StudyGroups WHERE joined = ?";
    
        db.all(query, [label], (err, rows) => {
            if (err) {
                return reject(err); // Rifiutiamo la Promise se c'è un errore
            }
        
            // Mappiamo i gruppi ottenuti dalla query come oggetti
            let groups = rows.map(row => {
                return {
                    id: row.id,
                    name: row.name,
                    level: row.level,
                    university: row.university,
                    SLD: row.SLD,
                    description: row.description,
                    picture: `http://localhost:3001/${row.picture}`,
                    number_of_participants: row.number_of_participants,
                    joined: row.joined,
                    usercreate: row.usercreate
                };
            });
        
            resolve(groups); // Risolviamo la Promise con i gruppi ottenuti
        });
    });
}

//leave group:
export function leaveGroup(db, idGroup) {
    return new Promise((resolve, reject) => {
        let query = "UPDATE StudyGroups SET joined = 0 WHERE id = ?";
    
        db.run(query, [idGroup], (err) => {
            if (err) {
                return reject(err); // Rifiutiamo la Promise se c'è un errore
            }
        
            resolve(); // Risolviamo la Promise
        });
    });
}

//join group:
export function joinGroup(db, idGroup) {
    return new Promise((resolve, reject) => {
        let query = "UPDATE StudyGroups SET joined = 1 WHERE id = ?";
    
        db.run(query, [idGroup], (err) => {
            if (err) {
                return reject(err); // Rifiutiamo la Promise se c'è un errore
            }
        
            resolve(); // Risolviamo la Promise
        });
    });
}

//add group:
export function addGroup(db, name, level, university, SLD, description, picture, number_of_participants, joined) {
    return new Promise((resolve, reject) => {
      const joinedInt = 1;
      const userId_temp = 1;
      const query = `
        INSERT INTO StudyGroups (name, level, university, SLD, description, picture, number_of_participants, joined, usercreate) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      db.run(query, [name, level, university, SLD, description, picture, number_of_participants, joinedInt, userId_temp], function (err) {
        if (err) {
          console.error('Database insert error:', err.message);
          return reject(err);
        }
        resolve(this.lastID); // Return the ID of the inserted record
      });
    });
  }  

// Funzione per ottenere un gruppo per un determinato ID
export function getGroupById(db, name) {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM StudyGroups WHERE name = ?";
    
        db.get(query, [name], (err, row) => {
            if (err) {
                return reject(err); // Rifiutiamo la Promise se c'è un errore
            }
        
            if (row === undefined) {
                reject(new Error("Not found")); // Rifiutiamo la Promise se non troviamo il gruppo
            }
        
            let group = new group(
                row.id, 
                row.name, 
                row.level, 
                row.university, 
                row.SLD, 
                row.description, 
                `http://localhost:3001/${row.picture}`,
                row.number_of_participants, 
                row.joined,
                row.usercreate
            );
            resolve(group); // Risolviamo la Promise con il gruppo ottenuto
        });
    });
}

// Funzione per ottenere un gruppo per un determinato SLD
export function getGroupBySLD(db, SLD) {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM StudyGroups WHERE SLD = ?";
    
        db.get(query, [SLD], (err, row) => {
            if (err) {
                return reject(err); // Rifiutiamo la Promise se c'è un errore
            }
        
            if (row === undefined) {
                reject(new Error("Not found")); // Rifiutiamo la Promise se non troviamo il gruppo
            }
        
            let group = new group(
                row.id, 
                row.name, 
                row.level, 
                row.university, 
                row.SLD, 
                row.description, 
                `http://localhost:3001/${row.picture}`, 
                row.number_of_participants, 
                row.joined,
                row.usercreate
            );
        
            resolve(group); // Risolviamo la Promise con il gruppo ottenuto
        });
    });
}

export function updateGroup(db, group) {
    return new Promise((resolve, reject) => {
        console.log("DAO received:", group);
        const query = "UPDATE StudyGroups SET name = ?, SLD = ?, level = ? WHERE id = ?";
        const params = [group.name, group.SLD, group.level, group.id];
        console.log("Query:", query);
        console.log("Params:", params);
        
        db.run(query, params, function(err) {
            if (err) {
                console.error("SQL Error:", err);
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

export function getChallenges (db, groupId) {

    return new Promise((resolve, reject) => {
        const query = "SELECT challenge_id, title, group_id FROM challenges WHERE group_id = ?";

        db.all(query, [groupId], (err, rows) => {
            if (err) {
                console.error('Database error: ', err);
                return reject(err); // Rifiutiamo la Promise in caso di errore
            }

            if (rows.length === 0) {
                return reject(new Error("Challenges not found"));
            }

            // Creiamo gli oggetti Challenge per ogni riga
            const challenges = rows.map(row => new Challenge(row.challenge_id, row.title, row.group_id));

            resolve(challenges); // Restituiamo l'array di oggetti Challenge
        });
    });
}

export function getQuestions(db, challengeId) {
    return new Promise((resolve, reject) => {
        const query = "SELECT question_id, text FROM questions WHERE challenge_id = ?";

        db.all(query, [challengeId], (err, rows) => {
            if (err) {
                console.error('Database error: ', err);
                return reject(err); // Rifiutiamo la Promise in caso di errore
            }

            if (rows.length === 0) {
                return reject(new Error("Questions not found"));
            }

            // Creiamo gli oggetti Question per ogni riga
            const questions = rows.map(row => new Question(row.question_id, row.text));
            resolve(questions); // Restituiamo l'array di oggetti Question
        });
    });
}

export function getAnswers(db, questionId) { 
    return new Promise((resolve, reject) => {
        const query = "SELECT answer_id, text, is_correct, feedback FROM answers WHERE question_id = ?";

        db.all(query, [questionId], (err, rows) => {
            if (err) {
                console.error('Database error: ', err);
                return reject(err); // Rifiutiamo la Promise in caso di errore
            }

            if (rows.length === 0) {
                return reject(new Error("Answers not found"));
            }

            // Creiamo gli oggetti Answer per ogni riga
            const answers = rows.map(row => new Answer(row.answer_id, row.text, row.is_correct, row.feedback));

            resolve(answers); // Restituiamo l'array di oggetti Answer
        });
    });
}

export function createChallenge(db, challenge) {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO challenges (group_id, title, topic_id) VALUES (?, ?, ?)";

        db.run(query, [challenge.group_id,challenge.title,challenge.topic_id], function(err) {
            if (err) {
                console.error('Database error: ', err);
                return reject(err); // Rifiutiamo la Promise in caso di errore
            }

            resolve(this.lastID); // Restituiamo l'ID dell'ultimo record inserito
        });
    });
}

export function getTopics(db, study_group_id) {
    return new Promise((resolve, reject) => {
        const query = "SELECT topic_id, name FROM topics WHERE study_group_id = ?";
        db.all(query, [study_group_id], (err, rows) => {
            if (err) {
                console.error('Database error: ', err);
                return reject(err); // Reject the Promise in case of error
            }

            if (!rows || rows.length === 0) {
                return reject(new Error("Topics not found"));
            }

            // Map the results to get an array of topic objects with topic_id and name
            const topics = rows.map(row => ({
                topic_id: row.topic_id,
                name: row.name
            }));
            resolve(topics); // Return the array of topic objects
        });
    });
}


export function getImages(db, group_id) { 
    console.log("group_id DAO images:",group_id); 
    return new Promise((resolve, reject) => { 
        const query = "SELECT material_id, name FROM material WHERE group_id = ? AND type = 'image'"; 
        db.all(query, [group_id], (err, rows) => { 
            if (err) { 
                console.error('Database error: ', err); 
                return reject(err); // Reject the Promise in case of error 
            } 
 
            if (!rows || rows.length === 0) { 
                return reject(new Error("Images not found")); 
            } 
 
            // Map the results to get an array of image objects with material_id and name 
            const images = rows.map(row => ({ 
                material_id: row.material_id, 
                name: `http://localhost:3001/${row.name}`,  
            })); 
 
            //create a map of strings 
            console.log("images DAO:",images); 
            resolve(images); // Return the array of image objects 
        }); 
    }); 
} 
 
export function getDocuments(db, group_id) { 
    return new Promise((resolve, reject) => { 
        const query = "SELECT material_id, name FROM material WHERE group_id = ? AND type = 'document'"; 
        db.all(query, [group_id], (err, rows) => { 
            if (err) { 
                console.error('Database error: ', err); 
                return reject(err); // Reject the Promise in case of error 
            } 
 
            if (!rows || rows.length === 0) { 
                return reject(new Error("Documents not found")); 
            } 
 
            // Map the results to get an array of document objects with material_id and name 
            console.log("rows DAO documents:",rows); 
            const documents = rows.map(row => ({ 
                material_id: row.material_id, 
                name: `http://localhost:3001/${row.name}`,  
            })); 
 
            resolve(documents); // Return the array of document objects 
        }); 
    }); 
} 
 
export function getAudio(db, group_id) { 
    return new Promise((resolve, reject) => { 
        const query = "SELECT material_id, name FROM material WHERE group_id = ? AND type = 'audio'"; 
        db.all(query, [group_id], (err, rows) => { 
            if (err) { 
                console.error('Database error: ', err); 
                return reject(err); // Reject the Promise in case of error 
            } 
 
            if (!rows || rows.length === 0) { 
                return reject(new Error("Audios not found")); 
            } 
 
            // Map the results to get an array of audio objects with material_id and name 
            const audios = rows.map(row => ({ 
                material_id: row.material_id, 
                name: `http://localhost:3001/${row.name}`,  
            })); 
 
            resolve(audios); // Return the array of audio objects 
        }); 
    }); 
}