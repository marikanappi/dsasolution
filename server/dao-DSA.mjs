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
                    row.joined
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
                    joined: row.joined
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
        let query = "INSERT INTO StudyGroups (name, level, university, SLD, description, picture, number_of_participants, joined) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
        db.run(query, [name, level, university, SLD, description, picture, number_of_participants, joined], function(err) {
            if (err) {
                return reject(err); // Rifiutiamo la Promise se c'è un errore
            }
        
            resolve(this.lastID); // Risolviamo la Promise con l'ID dell'ultimo gruppo inserito
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
                row.joined
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
                row.joined
            );
        
            resolve(group); // Risolviamo la Promise con il gruppo ottenuto
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

//funzione per caricare immagine nella table materials
export function addMaterials(db, group_id, type, url, description) {
    return new Promise((resolve, reject) => {
      
        let query = "INSERT INTO Materials (group_id, type, url, description) VALUES (?, ?, ?, ?)";
    
        db.run(query, [group_id, type, url, description], function(err) {
            if (err) {
                return reject(err); // Rifiutiamo la Promise se c'è un errore
            }
        
            resolve(this.lastID); // Risolviamo la Promise con l'ID dell'ultimo materiale inserito
        });
    });
}


//funzione per ottenere immagine dal db secondo type = png o jpg
export function getImage(db, group_id) {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM Materials WHERE group_id = ? AND type = 'image'";

        db.get(query, [group_id], (err, row) => {
            if (err) {
                return reject(err); // Rifiutiamo la Promise se c'è un errore
            }
        
            if (row === undefined) {
                reject(new Error("Not found")); // Rifiutiamo la Promise se non troviamo il materiale
            }
        
            let material = new Material(
                row.id, 
                row.group_id, 
                row.type, 
                row.url, 
                row.description
            );
        
            resolve(material); // Risolviamo la Promise con il materiale ottenuto
        });
    });
}
    